import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux'
import { StudentAction } from '../../actions/student-action';
import { StudentService } from '../../services/student-service';
import { DatePicker } from '@progress/kendo-react-dateinputs';

class AddStudent extends React.Component {
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
        this.addStudent = this.addStudent.bind(this);
        this.changeBirthday = this.changeBirthday.bind(this);
    }
    openModal() {
        this.setState({
            isOpen: true,
            firstName: '',
            lastName: '',
            birthDay: new Date()
        });
    }
    addStudent() {
        this.setState({ loading: true });
        let data = {
            FirstName: this.state.firstName,
            LastName: this.state.lastName,
            Birthday: this.state.birthDay ? this.state.birthDay.toISOString().slice(0, 10) : null
        }
        StudentService.addStudent(data).then(res => {
            let rs = res.data;
            rs.FullName = `${data.LastName} ${data.FirstName}`
            this.props.addStudent(rs);
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
        return (<div>
            <Button color='primary' onClick={this.openModal}>Thêm học sinh</Button>
            <Modal isOpen={this.state.isOpen}>
                <ModalHeader className='text-center'>
                    Thêm học sinh
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.addStudent} loading={this.state.loading}>
                        <Form.Field>
                            <label>Họ</label>
                            <input type='text' placeholder='Họ' required
                                value={this.state.lastName}
                                onChange={(e) => {
                                    this.setState({ lastName: e.target.value });
                                }} />
                        </Form.Field>
                        <Form.Field>
                            <label>Tên</label>
                            <input type='text' placeholder='Tên' required
                                value={this.state.firstName}
                                onChange={(e) => {
                                    this.setState({ firstName: e.target.value });
                                }} />
                        </Form.Field>
                        <Form.Field>
                            <label>Ngày sinh</label>
                            <DatePicker max={new Date()}
                                defaultValue={new Date()}
                                onChange={this.changeBirthday}>
                            </DatePicker>
                        </Form.Field>
                        <button ref='btn' style={{ display: 'none' }}></button>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={() => {
                        this.refs.btn.click();
                    }}>OK</Button>
                    <Button color='secondary' onClick={() => {
                        this.setState({ isOpen: false });
                    }}>Hủy</Button>
                </ModalFooter>
            </Modal>
        </div>);
    }
}

const mapStateToProps = (state) => ({
    students: state.students
})

const mapDispatchToProps = dispatch => ({
    addStudent: (student) => {
        dispatch(StudentAction.addStudent(student));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(AddStudent);