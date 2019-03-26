import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Form, Button } from 'semantic-ui-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { TeacherService } from '../../../services/teacher-service';
import { TeacherAction } from '../../../actions/teacher-action';

class SetTeacherPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            password: null,
            loading: false
        }
        this.openModal = this.openModal.bind(this);
        this.changeTeacherPassword = this.changeTeacherPassword.bind(this);
    }
    openModal() {
        this.setState({
            isOpen: true,
            password: null,
            loading: false
        });
    }

    changeTeacherPassword() {
        this.setState({ loading: true });
        let password = this.state.password;
        TeacherService.changePassword(this.props.teacher.Username.trim(), password)
            .then(res => {
                window.alert('Thành công');
                this.setState({ isOpen: false });
            })
            .catch(err => {
                window.alert('Tác vụ thất bại, vui lòng thử lại sau!');
                this.setState({ loading: false });
            })
    }

    render() {
        let isActive = this.props.teacher.Status === 1;
        return (
            <div style={{ boxSizing: 'border-box' }}>
                {isActive ? <Button style={{ margin: '0px 0px 10px 0px' }}
                    onClick={this.openModal}>Đổi mật khẩu</Button> : null}
                <Modal isOpen={this.state.isOpen}>
                    <ModalHeader className='text-center'>
                        Đổi mật khẩu giáo viên
                </ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.changeTeacherPassword} loading={this.state.loading}>
                            <Form.Field>
                                <label>Username: {this.props.teacher.Username}</label>
                            </Form.Field>
                            <Form.Field>
                                <label>Mật khẩu mới:</label>
                                <input type='password' value={this.state.password} required
                                    minLength='4'
                                    maxLength='20'
                                    onChange={(e) => {
                                        let val = e.target.value;
                                        val = val.replace(' ', '');
                                        e.target.value = val;
                                        this.setState({
                                            password: val
                                        })
                                    }} />
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
    teacher: state.teacher,
    subjects: state.subjects
})

const mapDispatchToProps = dispatch => ({
    setTeacher: (teacher) => {
        dispatch(TeacherAction.setTeacher(teacher));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(SetTeacherPassword);