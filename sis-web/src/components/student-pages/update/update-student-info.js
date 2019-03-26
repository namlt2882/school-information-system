import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux'
import { StudentAction } from '../../../actions/student-action';
import { StudentService } from '../../../services/student-service';
import { DatePicker } from '@progress/kendo-react-dateinputs';

class UpdateStudentInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            firstName: '',
            lastName: '',
            birthDay: new Date(),
            loading: false
        }
        this.openModal = this.openModal.bind(this);
        this.updateStudent = this.updateStudent.bind(this);
        this.changeBirthday = this.changeBirthday.bind(this);
    }
    openModal() {
        let student = this.props.student;
        let birthday = student.Birthday ? new Date(student.Birthday) : new Date();
        this.setState({
            isOpen: true,
            firstName: student.FirstName,
            lastName: student.LastName,
            birthDay: birthday
        });
    }
    updateStudent() {
        let student = this.props.student;
        this.setState({ loading: true });
        let data = {
            Id: student.Id,
            FirstName: this.state.firstName,
            LastName: this.state.lastName,
            Birthday: this.state.birthDay ? this.state.birthDay.toISOString().slice(0, 10) : null
        }
        StudentService.update(data).then(res => {
            student.FirstName = data.FirstName;
            student.LastName = data.LastName;
            student.Birthday = data.Birthday;
            student.FullName = `${data.LastName} ${data.FirstName}`
            this.props.setStudent(student);
            this.setState({ isOpen: false, loading: false });
        }).catch(err => {
            alert('Tác vụ thất bại, vui lòng thử lại sau!');
            this.setState({ loading: false });
        })
    }
    changeBirthday(e) {
        let val = e.target.value;
        this.setState({ birthDay: val })
    }
    render() {
        let student = this.props.student;
        return (<div>
            <Button color='primary' style={{ margin: '10px 0px 10px 0px' }}
                onClick={this.openModal}>Cập nhật</Button><br />
            <Modal isOpen={this.state.isOpen}>
                <ModalHeader className='text-center'>
                    Học sinh {` ${student.FullName}`}
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.updateStudent} loading={this.state.loading}>
                        <Form.Field>
                            <label>Họ</label>
                            <input type='text' placeholder='Họ' required
                                maxLength='50'
                                value={this.state.lastName}
                                onChange={(e) => {
                                    this.setState({ lastName: e.target.value });
                                }} />
                        </Form.Field>
                        <Form.Field>
                            <label>Tên</label>
                            <input type='text' placeholder='Tên' required
                                maxLength='50'
                                value={this.state.firstName}
                                onChange={(e) => {
                                    this.setState({ firstName: e.target.value });
                                }} />
                        </Form.Field>
                        <Form.Field>
                            <label>Ngày sinh</label>
                            <DatePicker max={new Date()}
                                defaultValue={this.state.birthDay}
                                onChange={this.changeBirthday}>
                            </DatePicker>
                        </Form.Field>
                        <button ref='btn' style={{ display: 'none' }}></button>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={() => {
                        this.refs.btn.click();
                    }}>Cập nhật</Button>
                    <Button color='secondary' onClick={() => {
                        this.setState({ isOpen: false });
                    }}>Hủy</Button>
                </ModalFooter>
            </Modal>
        </div>);
    }
}

const mapStateToProps = (state) => ({
    student: state.student
})

const mapDispatchToProps = dispatch => ({
    setStudent: (student) => {
        dispatch(StudentAction.setStudent(student));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateStudentInfo);