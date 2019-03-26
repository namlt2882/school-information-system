import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Form, Button } from 'semantic-ui-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { TeacherService } from '../../../services/teacher-service';
import { TeacherAction } from '../../../actions/teacher-action';

class UpdateTeacherInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            username: null,
            name: null,
            subjectId: null,
            loading: false
        }
        this.openModal = this.openModal.bind(this);
        this.changeSubject = this.changeSubject.bind(this);
        this.updateTeacherInfo = this.updateTeacherInfo.bind(this);
    }

    updateTeacherInfo() {
        this.setState({ loading: true });
        let data = {
            Name: this.state.name,
            SubjectId: this.state.subjectId
        }
        TeacherService.updateTeacherInfo(this.state.username, data).then(res => {
            let teacher = this.props.teacher;
            teacher.Name = this.state.name;
            teacher.SubjectId = this.state.subjectId;
            this.props.setTeacher(teacher);
            this.setState({ isOpen: false, loading: false });
        }).catch(err => {
            alert('Tác vụ không thành công, vui lòng thử lại sau!')
            this.setState({ loading: false });
        })
    }

    openModal() {
        let teacher = this.props.teacher;
        this.setState({
            isOpen: true,
            username: teacher.Username.trim(),
            name: teacher.Name,
            subjectId: teacher.SubjectId
        });
    }

    changeSubject(e) {
        let value = e.target.value;
        if (value == '-1') {
            value = null;
        } else {
            value = parseInt(value);
        }
        this.setState({ subjectId: value });
    }

    render() {
        let isActive = this.props.teacher.Status === 1;
        return (
            <div style={{ boxSizing: 'border-box' }}>
                {isActive ? <Button style={{ margin: '10px 0px 10px 0px' }}
                    color='primary' onClick={this.openModal}>Thay đổi thông tin</Button> : null}
                <Modal isOpen={this.state.isOpen}>
                    <ModalHeader className='text-center'>
                        Sửa thông tin giáo viên
                </ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.updateTeacherInfo} loading={this.state.loading}>
                            <Form.Field>
                                <label>Username: {this.state.username}</label>
                            </Form.Field>
                            <Form.Field>
                                <label>Họ và tên</label>
                                <input type='text' placeholder='Name' required
                                    maxLength='50'
                                    value={this.state.name}
                                    onChange={(e) => {
                                        this.setState({ name: e.target.value });
                                    }} />
                            </Form.Field>
                            <Form.Field>
                                <label>Bộ môn giảng dạy</label>
                                <select value={this.state.subjectId} onChange={this.changeSubject}>
                                    <option value='-1'>--</option>
                                    {this.props.subjects.map(s => <option value={s.Id}>{s.Name}</option>)}
                                </select>
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

export default connect(mapStateToProps, mapDispatchToProps)(UpdateTeacherInfo);