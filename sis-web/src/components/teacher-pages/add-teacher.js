import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux'
import { TeacherAction } from '../../actions/teacher-action';
import { TeacherService } from '../../services/teacher-service';

class AddTeacher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            username: null,
            name: null,
            subjectId: null,
            password: null,
            loading: false
        }
        this.openModal = this.openModal.bind(this);
        this.addTeacher = this.addTeacher.bind(this);
        this.changeSubject = this.changeSubject.bind(this);
    }
    openModal() {
        this.setState({
            isOpen: true,
            username: null,
            name: null,
            subjectId: null,
            password: null
        });
    }
    addTeacher() {
        this.setState({ loading: true });
        let data = {
            Username: this.state.username,
            Password: this.state.password,
            Name: this.state.name,
            SubjectId: this.state.subjectId
        }
        TeacherService.addTeacher(data).then(res => {
            let rs = res.data;
            this.props.addTeacher(rs);
            this.setState({ isOpen: false, loading: false });
        }).catch(err => {
            alert('This username is already existed!');
            this.setState({ loading: false });
        })
    }
    changeSubject(e) {
        let value = e.target.value;
        if (value == '-1') {
            value = null;
        }
        this.setState({ subjectId: value });
    }
    render() {
        return (<div>
            <Button color='primary' onClick={this.openModal}>Thêm giáo viên</Button>
            <Modal isOpen={this.state.isOpen}>
                <ModalHeader className='text-center'>
                    Thêm giáo viên
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.addTeacher} loading={this.state.loading}>
                        <Form.Field>
                            <label>Username</label>
                            <input type='text' placeholder='Username' required
                                value={this.state.username}
                                onChange={(e) => {
                                    this.setState({ username: e.target.value });
                                }} />
                        </Form.Field>
                        <Form.Field>
                            <label>Họ và tên</label>
                            <input type='text' placeholder='Name' required
                                value={this.state.name}
                                onChange={(e) => {
                                    this.setState({ name: e.target.value });
                                }} />
                        </Form.Field>
                        <Form.Field>
                            <label>Mật khẩu</label>
                            <input type='password' placeholder='Password' required
                                value={this.state.password}
                                onChange={(e) => {
                                    this.setState({ password: e.target.value });
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
    teachers: state.teachers,
    subjects: state.subjects
})

const mapDispatchToProps = dispatch => ({
    addTeacher: (teacher) => {
        dispatch(TeacherAction.addTeacher(teacher));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(AddTeacher);