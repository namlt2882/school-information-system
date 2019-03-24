import React from 'react';
import { connect } from 'react-redux'
import { StudentAction } from '../../actions/student-action'
import { Form, Divider, Button } from 'semantic-ui-react';
import Component from '../common/component';
import { PrimaryLoadingPage } from '../common/loading-page';
import StudentStatus from './student-status';
import StudentTranscript from '../transcript-pages/student-transcript';
import { Link } from 'react-router-dom'
import UpdateStudentInfo from './update/update-student-info';
import { StudentService } from '../../services/student-service';

class StudentDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 0
        }
        this.deleteStudent = this.deleteStudent.bind(this);
        this.setGraduated = this.setGraduated.bind(this);
    }
    componentDidMount() { }
    componentWillUnmount() { }
    deleteStudent() {
        let student = this.props.student;
        if (window.confirm(`Hành động này sẽ xóa ${student.FullName} ra khỏi hệ thống. Tất cả bảng điểm liên quan có thể bị mất, xác nhận tiếp tục?`)) {
            StudentService.delete(student.Id).then(res => {
                this.props.closeModal();
                this.props.deleteStudent(student);
            }).catch(err => {
                window.alert('Tác vụ thất bại, vui lòng thử lại sau!');
            })
        }
    }
    setGraduated() {
        let student = this.props.student;
        if (window.confirm(`Hành động này sẽ loại ${student.FullName} ra khỏi tất cả lớp học hiện tại, đồng thời không thể thêm ${student.FullName} vào bất cứ lớp học nào. Tất cả bảng điểm cũ đều được bảo lưu, xác nhận tiếp tục?`)) {
            StudentService.setGraduated(student.Id).then(res => {
                student.Status = 2;
                student.CurrentClass = null;
                this.props.setStudent(student);
            }).catch(err => {
                window.alert('Tác vụ thất bại, vui lòng thử lại sau!');
            })
        }
    }
    render() {
        let student = this.props.student;
        if (this.isLoading() || !student) {
            return <PrimaryLoadingPage />
        }
        let currentClass = student.CurrentClass;
        let closedClasses = student.ClosedClasses;
        let isActive = student.Status === 1;
        let isGraduated = student.Status === 2;
        return (<Form className='row'>
            <div className='col-sm-3' style={{ boxSizing: 'border-box' }}>
                <label className='text-center'><b>{student.FullName}</b></label>
                <Divider />
                <table style={{ width: '100%', boxSizing: 'border-box' }}>
                    <tbody>
                        <tr>
                            <td className='bold-text'>Họ:</td>
                            <td>{student.LastName}</td>
                        </tr>
                        <tr>
                            <td className='bold-text'>Tên:</td>
                            <td>{student.FirstName}</td>
                        </tr>
                        <tr>
                            <td className='bold-text'>Ngày sinh:</td>
                            <td>{student.Birthday ? new Date(student.Birthday).toLocaleDateString() : null}</td>
                        </tr>
                        <tr>
                            <td className='bold-text'>Tình trạng:</td>
                            <td><StudentStatus status={student.Status} /></td>
                        </tr>
                        <tr>
                            <td className='bold-text'>Lớp hiện tại:</td>
                            <td>{currentClass ? <Link target='_blank' to={`/class/${currentClass.Id}/view`}>
                                {currentClass.Name}</Link> : null}</td>
                        </tr>
                    </tbody>
                </table>
                <div style={{ width: '100%', boxSizing: 'border-box' }}>
                    {!isGraduated ? [
                        <UpdateStudentInfo />,
                        <Button color='orange' style={{ margin: '0px 0px 10px 0px' }}
                            onClick={this.setGraduated}>Tốt nghiệp</Button>, <br />,
                        <Button color='secondary' style={{ margin: '0px 0px 10px 0px' }}
                            onClick={this.deleteStudent}>Xóa</Button>] :
                        null}
                </div>
            </div>
            <div className='col-sm-9'>
                {currentClass ? [<label className='text-center'>Bảng điểm hiện tại</label>,
                <Divider />,
                <StudentTranscript key={`${currentClass.Id}-${student.Id}`}
                    classId={currentClass.Id} studentId={student.Id} />] : null}
                {closedClasses.length > 0 ? [<label className='text-center'>Bảng điểm đã lưu</label>,
                <Divider />,
                closedClasses.map(cc => [
                    <div className='bold-text text-center'>{`${cc.Name} (Đã đóng)`}</div>,
                    <StudentTranscript key={`${cc.Id}-${student.Id}`}
                        classId={cc.Id} studentId={student.Id} />])] : null}
            </div>
        </Form>);
    }
}
const mapStateToProps = (state) => ({
    student: state.student
})

const mapDispatchToProps = dispatch => ({
    setStudent: (student) => {
        dispatch(StudentAction.setStudent(student));
    },
    deleteStudent: (student) => {
        dispatch(StudentAction.deleteStudent(student));
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(StudentDetail);