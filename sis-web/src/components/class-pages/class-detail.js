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
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import UpdateClassInfo from './update/update-class-info';
import UpdateClassSubject from './update/update-class-subject';
library.add(faPen);

class ClassDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 3
        }
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

    pushData(students) {
        let data1 = { ...data };
        data1.rows = [];
        if (students) {
            data1.rows = students.map((s, i) => {
                return {
                    No: i + 1,
                    Name: `${s.LastName} ${s.FirstName}`,
                    Birthday: s.Birthday ? new Date(s.Birthday).toLocaleDateString() : '',
                    Action:
                        [<Button color='primary'>Bảng điểm</Button>,
                        <Button color='secondary'>Xóa</Button>]
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
        let data1 = this.pushData(clazz.Students);
        return (<Container>
            <div className='col-sm-12 row'>
                {/* Class info */}
                <div className='col-sm-4 row'>
                    <div className='col-sm-12 row'>
                        <div className='col-sm-12 text-center my-header'>
                            <h3><Icon name='info' />Thông tin lớp học
                            </h3>
                        </div>
                        <table className='col-sm-12'>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td><UpdateClassInfo /></td>
                                </tr>
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
                            </tbody>
                        </table>
                    </div>
                    <div className='col-sm-12 row'>
                        <div className='col-sm-12 text-center my-header'>
                            <h3><Icon name='info' />Các môn học hiện tại</h3>
                        </div>
                        <div className='col-sm-12'>
                            <UpdateClassSubject />
                        </div>
                        {clazz.Subjects.length > 0 ? <table className='col-sm-12' border='1'>
                            <thead>
                                <tr>
                                    <th>Bộ môn</th>
                                    <th>Giáo viên</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clazz.Subjects.map(s => <tr>
                                    <td>{s.Name}</td>
                                    <td>{s.Teacher ? s.Teacher.Name : null}</td>
                                </tr>)}
                            </tbody>
                        </table> : <span>Không có môn học nào trong lớp này!</span>}

                    </div>
                </div>
                {/* Student in class */}
                <div className='col-sm-8 row'>
                    <div className='col-sm-12 row'>
                        <div className='col-sm-12 text-center my-header' style={{ marginBottom: '0px' }}>
                            <h3><Icon name='users' />Học sinh trong lớp</h3>
                        </div>
                    </div>
                    <div className='col-sm-12'>
                        {data1.rows.length > 0 ? <MDBDataTable
                            className='hide-last-row'
                            striped
                            bordered
                            data={data1} /> : <span>Không có học sinh nào trong lớp này!</span>}
                    </div>
                </div>
            </div>
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

const mapStateToProps = (state) => ({
    clazz: state.clazz,
    teachers: state.teachers,
    subjects: state.subjects
})
const mapDispatchToProps = dispatch => ({
    setClass: (clazz) => {
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