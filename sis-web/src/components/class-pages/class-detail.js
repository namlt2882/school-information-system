import React from 'react';
import { Container, Header, Icon, Divider, Button, Label } from 'semantic-ui-react';
import Component from '../common/component';
import { PrimaryLoadingPage, available1 } from '../common/loading-page';
import { ClassService } from '../../services/class-service';
import { TeacherService } from '../../services/teacher-service';
import { SubjectService } from '../../services/subject-service';
import { ClassAction } from '../../actions/class-action';
import { TeacherAction } from '../../actions/teacher-action';
import { SubjectAction } from '../../actions/subject-action';
import { connect } from 'react-redux'
import { MDBDataTable } from 'mdbreact'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import UpdateClassInfo from './update/update-class-info';
import UpdateClassSubject from './update/update-class-subject';
import StudentTranscript from '../transcript-pages/student-transcript';
import AddClassMember from './add-class-member';
library.add(faPen);

class ClassDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 3,
            isOpenTranscript: false,
            transcriptContent: null
        }
        this.deleteStudent = this.deleteStudent.bind(this);
        this.closeClass = this.closeClass.bind(this);
    }

    componentWillMount() {
        available1();
        ClassService.get(this.props.match.params.id).then(res => {
            let clazz = res.data;
            this.props.setClass(clazz);
            this.incrementLoading();
        })
        TeacherService.getAll().then(res => {
            let list = res.data;
            list.forEach(t => {
                t.Username = t.Username.trim();
            })
            this.props.setTeachers(list);
            this.incrementLoading();
        })
        SubjectService.getAll().then(res => {
            let list = res.data;
            this.props.setSubjects(list);
            this.incrementLoading();
        })

    }

    deleteStudent(student) {
        let clazz = this.props.clazz;
        if (window.confirm(`Hành động này sẽ xóa ${student.LastName} ${student.FirstName} ra khỏi lớp ${clazz.Name}. Bảng điểm của học sinh này có thể bị ảnh hưởng, xác nhận xóa?`)) {
            ClassService.removeStudent(clazz.Id, student.Id)
                .then(res => {
                    clazz.Students = clazz.Students.filter(s => s.Id !== student.Id);
                    this.props.setClass(clazz);
                }).catch(err => {
                    window.alert('Tác vụ thất bại, vui lòng thử lại sau!');
                    console.error(err);
                })
        }
    }

    closeClass() {
        let clazz = this.props.clazz;
        if (window.confirm(`Hành động này sẽ đóng lớp ${clazz.Name} lại, không thể thêm học sinh hay chỉnh sửa thông tin của lớp học này. Xác nhận tiếp tục?`)) {
            ClassService.close(clazz.Id).then(res => {
                clazz.Status = 2;
                this.props.setClass(clazz);
            }).catch(err => {
                window.alert('Tác vụ thất bại, vui lòng thử lại sau!');
                console.error(err);
            })
        }
    }

    pushData(students) {
        let data1 = { ...data };
        data1.rows = [];
        let isClassActive = this.props.clazz.Status === 1;
        if (students) {
            data1.rows = students.map((s, i) => {
                return {
                    No: i + 1,
                    Name: `${s.LastName} ${s.FirstName}`,
                    Birthday: s.Birthday ? new Date(s.Birthday).toLocaleDateString() : '',
                    Action:
                        [<Button color='primary'
                            onClick={() => {
                                let transcriptContent = <StudentTranscript
                                    key={`${this.props.clazz.Id}-${s.Id}`}
                                    classId={this.props.clazz.Id} studentId={s.Id} />
                                this.setState({
                                    isOpenTranscript: true,
                                    transcriptContent: transcriptContent
                                })
                            }}>Bảng điểm</Button>,
                        <Button color='secondary' style={{ display: isClassActive ? 'inline-block' : 'none' }} onClick={() => {
                            this.deleteStudent(s);
                        }}>Xóa</Button>]
                }
            })
        }
        return data1;
    }

    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }
        let clazz = this.props.clazz;
        document.title = `Thông tin lớp ${clazz.Name}`
        let data1 = this.pushData(clazz.Students);
        let average = parseFloat(0);
        let isActive = clazz.Status === 1;
        return (<Container>
            <div className='col-sm-12 row'>
                {/* Class info */}
                <div className='col-sm-5 row'>
                    <div className='col-sm-12 row'>
                        <div className='col-sm-12 text-center my-header'>
                            <h3><Icon name='info' />Thông tin lớp học
                            </h3>
                        </div>
                        <table className='col-sm-12'>
                            <tbody>
                                {isActive ? <tr>
                                    <td></td>
                                    <td><UpdateClassInfo /></td>
                                </tr> : null}
                                <tr>
                                    <td><b>Tên lớp</b></td>
                                    <td>{clazz.Name}</td>
                                </tr>
                                <tr>
                                    <td><b>Giáo viên chủ nhiệm</b></td>
                                    <td>{clazz.HomeroomTeacher ? clazz.HomeroomTeacher.Name : null}</td>
                                </tr>
                                <tr>
                                    <td><b>Tình trạng</b></td>
                                    <td>
                                        {<Label color={getStatusColor(clazz.Status)}>
                                            {describeClassStatus(clazz.Status)}
                                        </Label>}
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Số môn học hiện tại</b></td>
                                    <td>{clazz.Subjects.length}</td>
                                </tr>
                                <tr>
                                    <td><b>Số lượng học sinh</b></td>
                                    <td>{clazz.Students.length}</td>
                                </tr>
                                {isActive ? <tr>
                                    <td></td>
                                    <td><Button color='orange' onClick={this.closeClass}>Đóng lớp</Button></td>
                                </tr> : null}
                            </tbody>
                        </table>
                    </div>
                    <div className='col-sm-12 row'>
                        <div className='col-sm-12 text-center my-header'>
                            <h3><Icon name='info' />Các môn học hiện tại</h3>
                        </div>
                        {isActive ? <div className='col-sm-12'>
                            <UpdateClassSubject />
                        </div> : null}
                        {clazz.Subjects.length > 0 ? <table className='col-sm-12' border='1'>
                            <thead>
                                <tr>
                                    <th>Bộ môn</th>
                                    <th>Giáo viên</th>
                                    <th>Điểm trung bình</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clazz.Subjects.map(s => {
                                    average += s.AverageScore;
                                    return <tr>
                                        <td>{s.Name}</td>
                                        <td>{s.Teacher ? s.Teacher.Name : null}</td>
                                        <td>{s.AverageScore.toFixed(2)}</td>
                                    </tr>
                                })}
                                <tr>
                                    <td></td>
                                    <td><b>Trung bình các môn</b>:</td>
                                    <td>{(1.0 * average / clazz.Subjects.length).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table> : <span>Không có môn học nào trong lớp này!</span>}

                    </div>
                </div>
                {/* Student in class */}
                <div className='col-sm-7'>
                    <div style={{ width: '100%', boxSizing: 'border-box' }}>
                        <div className='text-center my-header'
                            style={{ marginBottom: '0px', width: '100%', boxSizing: 'border-box' }}>
                            <h3><Icon name='users' />Học sinh trong lớp</h3>
                        </div>
                    </div>
                    {isActive ? <AddClassMember /> : null}
                    <div style={{ width: '100%', boxSizing: 'border-box' }}>
                        {data1.rows.length > 0 ? <MDBDataTable
                            className='hide-last-row'
                            striped
                            bordered
                            data={data1} /> : <span>Không có học sinh nào trong lớp này!</span>}
                    </div>
                </div>
            </div>
            <Modal isOpen={this.state.isOpenTranscript} className='normal-modal'>
                <ModalBody>
                    {this.state.transcriptContent}
                </ModalBody>
                <ModalFooter>
                    <Button color='secondary' onClick={() => {
                        this.setState({
                            isOpenTranscript: false,
                            transcriptContent: null
                        })
                    }}>Đóng</Button>
                </ModalFooter>
            </Modal>
        </Container>);
    }
}

const data = {
    columns: [
        {
            label: '#',
            field: 'No'
        },
        {
            label: 'Tên',
            field: 'Name'
        },
        {
            label: 'Ngày sinh',
            field: 'Birthday'
        },
        {
            label: '',
            field: 'Action'
        }
    ],
    rows: []
}

export const getStatusColor = (status) => {
    let rs = 'green';
    switch (status) {
        case 2:
            rs = 'gray'
            break;
    }
    return rs;
}

export const describeClassStatus = (status) => {
    let rs = '';
    switch (status) {
        case 1:
            rs = 'Đang dạy'
            break;
        case 2:
            rs = 'Đã đóng'
            break;
    }
    return rs;
}

export const sortSubjectAlphabetically = (subjects) => {
    subjects.sort((s1, s2) => {
        let name1 = s1.Name.toUpperCase();
        let name2 = s2.Name.toUpperCase();
        return (name1 < name2) ? -1 : (name1 > name2) ? 1 : 0;
    })
}

export const sortStudentAlphabetically = (students) => {
    students.sort((s1, s2) => {
        let name1 = s1.FirstName.toUpperCase();
        let name2 = s2.FirstName.toUpperCase();
        return (name1 < name2) ? -1 : (name1 > name2) ? 1 : 0;
    })
}

const mapStateToProps = (state) => ({
    clazz: state.clazz,
    teachers: state.teachers,
    subjects: state.subjects
})
const mapDispatchToProps = dispatch => ({
    setClass: (clazz) => {
        sortSubjectAlphabetically(clazz.Subjects);
        dispatch(ClassAction.setClass(clazz));
    },
    setTeachers: (list) => {
        dispatch(TeacherAction.setTeachers(list));
    },
    setSubjects: (list) => {
        dispatch(SubjectAction.setSubjects(list));
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(ClassDetail);