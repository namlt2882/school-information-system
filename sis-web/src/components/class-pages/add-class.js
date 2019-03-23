import React from 'react';
import { Form, Button, Checkbox } from 'semantic-ui-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux'
import { ClassAction } from '../../actions/class-action';
import { ClassService } from '../../services/class-service';

class AddClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            name: null,
            manager: null,
            subjects: [],
            percent: 0,
            loading: false,
            subjectMap: []
        }
        this.openModal = this.openModal.bind(this);
        this.addClass = this.addClass.bind(this);
        this.changeManager = this.changeManager.bind(this);
        this.addSubject = this.addSubject.bind(this);
        this.removeSubject = this.removeSubject.bind(this);
        this.addAllSubject = this.addAllSubject.bind(this);
        this.removeAllSubject = this.removeAllSubject.bind(this);
        this.changeTeacher = this.changeTeacher.bind(this);
    }
    componentDidMount() {
        let subjectMap = this.props.subjects.map(s => ({ subjectId: false, teacherId: null }));
        this.setState({ subjectMap: subjectMap });
    }
    openModal() {
        this.setState({
            isOpen: true,
            name: null,
            manager: null,
            subjects: [],
            subjectMap: this.props.subjects.map(s => false)
        });
    }
    addClass() {
        this.setState({ loading: true });
        let data = {
            Name: this.state.name,
            Manager: this.state.manager
        }
        ClassService.addClass(data).then(res => {
            let rs = res.data;
            if (rs) {
                if (this.state.subjects.length > 0) {
                    ClassService.addSubjects(rs.Id, this.state.subjects).then(res => {
                        rs.SubjectQuantity = this.state.subjects.length;
                        rs.StudentQuantity = 0;
                        this.props.addClass(rs);
                        this.setState({ isOpen: false, loading: false });
                    })
                } else {
                    this.props.addClass(rs);
                    this.setState({ isOpen: false, loading: false });
                }
            }
        }).catch(err => {
            alert('Service unavailable!');
            this.setState({ loading: false });
        })
    }
    changeManager(e) {
        let value = e.target.value;
        if (value === '-1') {
            value = null;
        }
        this.setState({ manager: value });
    }
    addAllSubject() {
        let subjects = this.props.subjects.map(s => {
            let subject = this.state.subjects.find(s1 => s1.subjectId == s.Id)
            if (subject) {
                return subject;
            } else return { subjectId: s.Id, teacherId: null }
        });
        let subjectMap = this.props.subjects.map(s => true);
        this.setState({ subjects: subjects, subjectMap: subjectMap })
    }
    removeAllSubject() {
        let subjects = [];
        let subjectMap = this.props.subjects.map(s => false);
        this.setState({ subjects: subjects, subjectMap: subjectMap })
    }
    addSubject(no, subjectId) {
        let subjects = this.state.subjects;
        if (!subjects.find(s => s.subjectId === subjectId)) {
            subjects.push({ subjectId: subjectId, teacherId: null });
            this.setState({ subjects: subjects });
        }
        let subjectMap = this.state.subjectMap;
        subjectMap[no] = true;
        this.setState({ subjectMap: subjectMap });
    }
    removeSubject(no, subjectId) {
        let subjects = this.state.subjects.filter(s => s.subjectId !== subjectId);
        let subjectMap = this.state.subjectMap;
        subjectMap[no] = false;
        this.setState({
            subjects: subjects,
            subjectMap: subjectMap
        });
    }
    changeTeacher(subjectId, teacherId) {
        let subjects = this.state.subjects;
        let classSubject = subjects.find(cs => cs.subjectId === subjectId);
        if (classSubject) {
            classSubject.teacherId = teacherId;
            this.setState({ subjects: subjects });
        }
    }
    render() {
        let checkAll = false;
        let tmp = this.state.subjectMap.map(sm => ({ value: sm })).find(sm => sm.value == false);
        if (tmp) {
            checkAll = false;
        } else {
            checkAll = true;
        }
        return (<div>
            <Button color='primary' onClick={this.openModal}>Thêm lớp</Button>
            <Modal isOpen={this.state.isOpen} className='normal-modal'>
                <ModalHeader className='text-center'>
                    Thêm lớp
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.addClass} loading={this.state.loading} className='row'>
                        <div className='col-sm-4'>
                            <Form.Field>
                                <label>Tên lớp</label>
                                <input type='text' placeholder='Tên lớp' required
                                    value={this.state.name}
                                    onChange={(e) => {
                                        this.setState({ name: e.target.value });
                                    }} />
                            </Form.Field>
                            <Form.Field>
                                <label>Giáo viên chủ nhiệm</label>
                                <select value={this.state.manager} onChange={this.changeManager}>
                                    <option value='-1'>--</option>
                                    {this.props.teachers.filter(t => t.Status === 1).map(t =>
                                        <option value={t.Username}>
                                            {t.Name}
                                        </option>)}
                                </select>
                            </Form.Field>
                        </div>
                        <div className='col-sm-8 row'>
                            <Form.Field className='col-sm-12 row'>
                                <label>Môn học</label>
                                <Checkbox className='col-sm-12' checked={checkAll} onChange={(e, data) => {
                                    if (data.checked) {
                                        this.addAllSubject();
                                    } else {
                                        this.removeAllSubject();
                                    }
                                }} />
                                {this.props.subjects.map((s, i) => {
                                    let teacherId = null;
                                    let tmp = this.state.subjects.find(cs => cs.subjectId == s.Id);
                                    if (tmp) {
                                        teacherId = tmp.teacherId;
                                    }
                                    //dropdown teacher
                                    let dropDownTeacher = null;
                                    if (this.state.subjectMap[i]) {
                                        dropDownTeacher = <select className='col-sm-8' value={teacherId}
                                            onChange={(e) => {
                                                let val = e.target.value;
                                                if (val === '-1') {
                                                    this.changeTeacher(s.Id, null);
                                                } else {
                                                    this.changeTeacher(s.Id, val);
                                                }
                                            }}>
                                            <option value='-1'>--</option>
                                            {this.props.teachers
                                                .filter(teacher => teacher.Status === 1 && teacher.SubjectId === s.Id)
                                                .map(t =>
                                                <option value={t.Username.trim()}>{t.Name}</option>)}
                                        </select>
                                    }
                                    return <div className='col-sm-12 row'>
                                        <Checkbox className='col-sm-4' checked={this.state.subjectMap[i]}
                                            label={s.Name}
                                            onChange={(e, data) => {
                                                if (data.checked) {
                                                    this.addSubject(i, s.Id);
                                                } else {
                                                    this.removeSubject(i, s.Id);
                                                }
                                            }} />
                                        {dropDownTeacher}
                                    </div>
                                })}
                            </Form.Field>
                        </div>
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
    classes: state.classes,
    subjects: state.subjects,
    teachers: state.teachers
})

const mapDispatchToProps = dispatch => ({
    addClass: (clazz) => {
        dispatch(ClassAction.addClass(clazz));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(AddClass);