import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, Button } from 'semantic-ui-react';
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ClassAction } from '../../../actions/class-action';
import { ClassService } from '../../../services/class-service';
library.add(faPen);

class UpdateClassInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            name: null,
            homeroomTeacher: null,
            loading: false
        }
        this.changeHomeroomTeacher = this.changeHomeroomTeacher.bind(this);
        this.openModal = this.openModal.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
    }

    openModal() {
        let clazz = this.props.clazz;
        this.setState({
            isOpen: true,
            name: clazz.Name,
            homeroomTeacher: clazz.HomeroomTeacher ? clazz.HomeroomTeacher.Username : null,
            loading: false
        });
    }
    changeHomeroomTeacher(e) {
        let val = e.target.value;
        if (val === '-1') {
            val = null;
        }
        this.setState({ homeroomTeacher: val });
    }
    updateInfo() {
        this.setState({ loading: true });
        let clazz = this.props.clazz;
        let data = {
            Name: this.state.name,
            Manager: this.state.homeroomTeacher
        }
        ClassService.updateInfo(clazz.Id, data).then(res => {
            let homeroomTeacher;
            let teacher = this.props.teachers.find(t => t.Username === this.state.homeroomTeacher);
            if (teacher) {
                homeroomTeacher = {
                    Username: teacher.Username,
                    Name: teacher.Name
                };
            } else {
                homeroomTeacher = null;
            }
            clazz.HomeroomTeacher = homeroomTeacher;
            clazz.Name = this.state.name;
            this.props.setClass(clazz);
            this.setState({
                isOpen: false,
                loading: false
            })
        }).catch(err => {
            window.alert('Service is unavailable!');
        })
    }
    render() {
        return (<div className='panel-action'>
            <FontAwesomeIcon size='sm' color='black' icon='pen' className='icon-btn'
                onClick={this.openModal} />
            <Modal isOpen={this.state.isOpen}>
                <ModalHeader>Sửa thông tin lớp học</ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.updateInfo} loading={this.state.loading}>
                        <Form.Field>
                            <label>Tên lớp</label>
                            <input type='text' value={this.state.name} required
                                onChange={(e) => {
                                    this.setState({ name: e.target.value });
                                }} />
                        </Form.Field>
                        <Form.Field>
                            <label>Giáo viên chủ nhiệm</label>
                            <select value={this.state.homeroomTeacher} onChange={this.changeHomeroomTeacher}>
                                <option value='-1'>--</option>
                                {this.props.teachers.map(t =>
                                    <option value={t.Username}>
                                        {t.Name}
                                    </option>)}
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
                    }}>Đóng</Button>
                </ModalFooter>
            </Modal>
        </div>);
    }
}

const mapStateToProps = (state) => ({
    clazz: state.clazz,
    teachers: state.teachers
})
const mapDispatchToProps = dispatch => ({
    setClass: (clazz) => {
        dispatch(ClassAction.setClass(clazz));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateClassInfo);
