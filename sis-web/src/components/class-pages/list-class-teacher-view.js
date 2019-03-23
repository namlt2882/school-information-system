import React from 'react';
import Component from '../common/component';
import { connect } from 'react-redux'
import { available1, PrimaryLoadingPage } from '../common/loading-page';
import { MDBDataTable } from 'mdbreact'
import { Container, Header, Button, Label } from 'semantic-ui-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import AddClass from './add-class';
import { ClassService } from '../../services/class-service';
import { ClassAction } from '../../actions/class-action';
import { TeacherAction } from '../../actions/teacher-action';
import { SubjectAction } from '../../actions/subject-action';
import { StudentAction } from '../../actions/student-action';
import { TeacherService } from '../../services/teacher-service'
import { SubjectService } from '../../services/subject-service'
import { StudentService } from '../../services/student-service'
import { Link } from 'react-router-dom'
import { getStatusColor, describeClassStatus } from './class-detail';
import { AuthService } from '../../services/auth-service';
import ClassSubjectTranscript from '../transcript-pages/class-subject-transcript';
class ListClassTeacherView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 4,
            openModal: false,
            modalContent: null
        }
        this.closeModal = this.closeModal.bind(this);
    }
    pushData(classes = this.props.classes) {
        let data1 = { ...data };
        data1.rows = [];
        let rows = classes.map((c, i) => {
            let homeRoomTeacher = c.Manager;
            if (homeRoomTeacher !== null) {
                homeRoomTeacher = this.props.teachers.find(t => t.Username === homeRoomTeacher);
            }
            let subject = this.props.subjects.find(s => s.Id === c.SubjectId);
            return {
                No: i + 1,
                Name: c.Name,
                Manager: homeRoomTeacher ? homeRoomTeacher.Name : null,
                Subject: subject.Name,
                StudentQuantity: c.StudentQuantity,
                Status: <Label color={getStatusColor(c.Status)}>
                    {describeClassStatus(c.Status)}
                </Label>,
                Action: <Button color='primary' onClick={() => {
                    let modalContent = <ClassSubjectTranscript className={c.Name} closeModal={this.closeModal} classSubjectId={c.ClassSubjectId} />
                    this.setState({
                        openModal: true,
                        modalContent: modalContent
                    })
                }}>Cập nhật bảng điểm</Button>
            }
        })
        data1.rows = rows;
        return data1;
    }
    componentDidMount() {
        available1();
        document.title = 'Danh sách lớp học';
        let username = AuthService.getUsername();
        ClassService.getTeachingClass(username).then(res => {
            this.props.setClasses(res.data);
            this.incrementLoading();
        })
        TeacherService.getAll().then(res => {
            this.props.setTeachers(res.data);
            this.incrementLoading();
        })
        SubjectService.getAll().then(res => {
            this.props.setSubjects(res.data);
            this.incrementLoading();
        })
        StudentService.getAll().then(res => {
            this.props.setStudents(res.data);
            this.incrementLoading();
        })
    }

    closeModal() {
        this.setState({
            openModal: false,
            modalContent: null
        })
    }

    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }
        let data = this.pushData(this.props.classes);
        return (<Container>
            <Header className='text-center'>Lớp học đang dạy</Header>
            <div className='col-sm-12'>
                <AddClass />
            </div>
            <div className='col-sm-12 row justify-content-center align-self-center'>
                <div className='col-sm-10'>
                    {data.rows.length > 0 ? <MDBDataTable
                        className='hide-last-row'
                        striped
                        bordered
                        data={data} /> : <span>Không có lớp nào hiện tại!</span>}
                </div>
            </div>
            <Modal isOpen={this.state.openModal} className='big-modal'>
                <ModalBody>
                    {this.state.modalContent}
                </ModalBody>
                <ModalFooter>
                    <Button color='secondary' onClick={this.closeModal}>Close</Button>
                </ModalFooter>
            </Modal>
        </Container>);
    }
}

const data = {
    columns: [
        {
            label: '#',
            field: 'No'
        },
        {
            label: 'Tên lớp',
            field: 'Name'
        },
        {
            label: 'Giáo viên chủ nhiệm',
            field: 'Manager'
        },
        {
            label: 'Môn học',
            field: 'Subject'
        },
        {
            label: 'Số lượng học sinh',
            field: 'StudentQuantity'
        },
        {
            label: 'Tình trạng',
            field: 'Status'
        },
        {
            label: '',
            field: 'Action'
        }
    ],
    rows: []
}

const mapStateToProps = (state) => ({
    classes: state.classes,
    teachers: state.teachers,
    subjects: state.subjects
})

const mapDispatchToProps = dispatch => ({
    setClasses: (list) => {
        dispatch(ClassAction.setClasses(list));
    },
    setTeachers: (list) => {
        dispatch(TeacherAction.setTeachers(list));
    },
    setSubjects: (list) => {
        dispatch(SubjectAction.setSubjects(list));
    },
    setStudents: (list) => {
        dispatch(StudentAction.setStudents(list));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(ListClassTeacherView);