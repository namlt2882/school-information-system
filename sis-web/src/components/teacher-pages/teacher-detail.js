import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux'
import { Container, List, Button, Icon, Divider, ListItem, Label } from 'semantic-ui-react';
import Component from '../common/component';
import { available1, PrimaryLoadingPage } from '../common/loading-page';
import { ClassService } from '../../services/class-service';
import { ClassAction } from '../../actions/class-action'
import UpdateTeacherInfo from './update/update-teacher-info';
import { Link } from 'react-router-dom'
import TeacherStatus from './teacher-status';
import { TeacherService } from '../../services/teacher-service';
import { TeacherAction } from '../../actions/teacher-action';
import SetTeacherPassword from './update/set-teacher-password';

class TeacherDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1
        }
        this.banTeacher = this.banTeacher.bind(this);
        this.deleteTeacher = this.deleteTeacher.bind(this);
        this.activateTeacher = this.activateTeacher.bind(this);
    }
    componentDidMount() {
        available1();
        ClassService.getTeachingClass(this.props.teacher.Username.trim())
            .then(res => {
                this.props.setClasses(res.data);
                this.incrementLoading();
            })
    }
    componentWillUnmount() { }

    banTeacher() {
        let teacher = this.props.teacher;
        if (window.confirm('Hành động này đình chỉ giáo viên và sẽ xóa tên giáo viên khỏi tất cả các lớp đang dạy và các lớp đang chủ nhiệm! Xác nhận tiếp tục')) {
            TeacherService.ban(teacher.Username.trim()).then(res => {
                teacher.Status = 2;
                teacher.HomeroomClass = [];
                teacher.TeachingClassQuantity = 0;
                this.props.setClasses([]);
                this.props.setTeacher(teacher);
            }).catch(err => {
                window.alert('Tác vụ thất bại, vui lòng thử lại sau!');
                console.error(err);
            })
        }
    }

    deleteTeacher() {
        let teacher = this.props.teacher;
        if (window.confirm('Hành động này sẽ xóa giáo viên khỏi hệ thống và các lớp hiện tại! Xác nhận tiếp tục')) {
            TeacherService.delete(teacher.Username.trim()).then(res => {
                teacher.Status = 2;
                this.props.closeModal();
                this.props.deleteTeacher(teacher);
            }).catch(err => {
                window.alert('Tác vụ thất bại, vui lòng thử lại sau!');
                console.error(err);
            })
        }
    }

    activateTeacher() {
        let teacher = this.props.teacher;
        if (window.confirm('Hành động này sẽ bỏ đình chỉ giáo viên này! Xác nhận tiếp tục')) {
            TeacherService.activate(teacher.Username.trim()).then(res => {
                teacher.Status = 1;
                this.props.setTeacher(teacher);
            }).catch(err => {
                window.alert('Tác vụ thất bại, vui lòng thử lại sau!');
                console.error(err);
            })
        }
    }

    render() {
        let teacher = this.props.teacher;
        if (this.isLoading() || teacher === null) {
            return <PrimaryLoadingPage />
        }
        let subject = this.props.subjects.find(s => s.Id === teacher.SubjectId);
        let isActive = teacher.Status === 1;
        let isBan = teacher.Status === 2;
        return (<div className='col-sm-12 row justify-content-center align-self-center'>
            <div className='col-sm-5'>
                <div><Icon name='info' />Thông tin giáo viên</div>
                <Divider />
                <table>
                    <tbody>
                        <tr>
                            <td className='bold-text'>Username:</td>
                            <td>{teacher.Username}</td>
                        </tr>
                        <tr>
                            <td className='bold-text'>Họ và tên:</td>
                            <td>{teacher.Name}</td>
                        </tr>
                        <tr>
                            <td className='bold-text'>Dạy môn:</td>
                            <td>{subject ? subject.Name : null}</td>
                        </tr>
                        <tr>
                            <td className='bold-text'>Tình trạng</td>
                            <td><TeacherStatus status={teacher.Status} /></td>
                        </tr>
                        {isActive ? <tr>
                            <td className='bold-text'>Chủ nhiệm lớp:</td>
                            <td>{teacher.HomeroomClass.map((hc, i) => `${i > 0 ? ', ' : ''}${hc.Name}`)}</td>
                        </tr> : null}
                    </tbody>
                </table>
                <UpdateTeacherInfo />
                <div style={{ boxSizing: 'border-box' }}>
                    {isActive ? [
                        <SetTeacherPassword />,
                        <Button style={{ margin: '0px 0px 10px 0px' }}
                            color='orange'
                            onClick={this.banTeacher}>Đình chỉ giáo viên</Button>,
                        <Button color='secondary'
                            onClick={this.deleteTeacher}>Xóa giáo viên</Button>] : null}
                    {isBan ? <Button style={{ margin: '0px 0px 10px 0px' }}
                        color='green'
                        onClick={this.activateTeacher}>Bỏ đình chỉ</Button> : null}
                </div>
            </div>
            <div className='col-sm-7' style={{ boxSizing: 'border-box' }}>
                <div className='text-center'><Icon name='group' />Lớp hiện tại ({teacher.TeachingClassQuantity})</div>
                <Divider />
                <div style={{ width: '100%', boxSizing: 'border-box' }}>
                    {this.props.classes.length > 0 ? <table style={{ width: '100%', boxSizing: 'border-box' }}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Lớp</th>
                                <th>Môn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.classes.map((c, i) => {
                                let subject = this.props.subjects.find(s => s.Id === c.SubjectId);
                                return <tr>
                                    <td>{i + 1}</td>
                                    <td><Link target='_blank' to={`/class/${c.Id}/view`}>{c.Name}</Link></td>
                                    <td>{subject ? subject.Name : null}</td>
                                </tr>
                            })}
                        </tbody>
                    </table> : <span>Giáo viên này đang không dạy lớp nào!</span>}
                </div>
            </div>
        </div>);
    }
}

export const sortTeacher = (teachers) => {
    teachers.sort((t1, t2) => {
        return t1.Status - t2.Status;
    })
}

export const getTeacherStatusColor = (status) => {
    let color = 'gray';
    switch (status) {
        case 1: color = 'green'; break;
        case 2: color = 'orange'; break;
    }
    return color;
}

export const describeTeacherStatus = (status) => {
    let rs = '';
    switch (status) {
        case 1:
            rs = 'Đang dạy';
            break;
        case 2:
            rs = 'Đình chỉ';
            break;
    }
    return rs;
}

const mapStateToProps = (state) => ({
    teachers: state.teachers,
    teacher: state.teacher,
    classes: state.classes,
    subjects: state.subjects
})

const mapDispatchToProps = dispatch => ({
    setClasses: (list) => {
        dispatch(ClassAction.setClasses(list));
    },
    setTeacher: (teacher) => {
        dispatch(TeacherAction.setTeacher(teacher));
    },
    deleteTeacher: (teacher) => {
        dispatch(TeacherAction.deleteTeacher(teacher));
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(TeacherDetail);