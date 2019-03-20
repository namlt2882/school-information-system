import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ClassAction } from '../../../actions/class-action';
import { ClassService } from '../../../services/class-service';
import { Form, Button, Checkbox } from 'semantic-ui-react';
library.add(faPen);

class UpdateClassSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            loading: false,
            subjectMap: [],
            subjects: []
        }
        this.openModal = this.openModal.bind(this);
        this.addSubject = this.addSubject.bind(this);
        this.removeSubject = this.removeSubject.bind(this);
        this.addAllSubject = this.addAllSubject.bind(this);
        this.removeAllSubject = this.removeAllSubject.bind(this);
        this.changeTeacher = this.changeTeacher.bind(this);
        this.updateClassSubject = this.updateClassSubject.bind(this);
    }
    updateClassSubject() {
        this.setState({ loading: true });
        let clazz = this.props.clazz;
        let addData = this.state.subjects;
        let removeData = clazz.Subjects.filter(cs => !addData.find(ad => ad.subjectId === cs.Id))
            .map(s => ({ subjectId: s.Id, teacherId: s.Teacher }));
        ClassService.addSubjects(clazz.Id, addData).then(res => {
            let Subjects = addData.map(ad => {
                let sub = this.props.subjects.find(s => s.Id === ad.subjectId);
                let teacher = this.props.teachers.find(t => t.Username === ad.teacherId);
                return {
                    Id: sub.Id,
                    Name: sub.Name,
                    Teacher: teacher ? {
                        Username: teacher.Username,
                        Name: teacher.Name
                    } : null
                }
            })
            clazz.Subjects = Subjects;
            this.props.setClass(clazz);
            if (removeData.length > 0) {
                ClassService.removeSubjects(clazz.Id, removeData).then(res => {
                    this.setState({
                        isOpen: false,
                        loading: false
                    })
                }).catch(e => {
                    alert('Service unavailable!');
                })
            } else {
                this.setState({
                    isOpen: false,
                    loading: false
                })
            }
        }).catch(e => {
            alert('Service unavailable!');
        })
    }
    openModal() {
        let clazz = this.props.clazz;
        this.setState({
            isOpen: true,
            loading: false,
            subjectMap: this.props.subjects.map(s => {
                let sub = clazz.Subjects.find(s1 => s1.Id === s.Id);
                if (sub) {
                    return true;
                } else return false;
            }),
            subjects: clazz.Subjects.map(s => ({
                subjectId: s.Id,
                teacherId: s.Teacher ? s.Teacher.Username.trim() : null
            }))
        })
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
        return (<div className='panel-action'>
            <FontAwesomeIcon size='sm' color='black' icon='pen' className='icon-btn'
                onClick={this.openModal} />
            <Modal isOpen={this.state.isOpen}>
                <ModalHeader className='text-center'>
                    Chỉnh sửa môn học
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.updateClassSubject} loading={this.state.loading} className='row'>
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
                                        {this.props.teachers.filter(teacher => teacher.SubjectId === s.Id).map(t =>
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
    teachers: state.teachers,
    subjects: state.subjects
})
const mapDispatchToProps = dispatch => ({
    setClass: (clazz) => {
        dispatch(ClassAction.setClass(clazz));
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(UpdateClassSubject);
