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
import { TeacherService } from '../../services/teacher-service'
import { SubjectService } from '../../services/subject-service'
import { Link } from 'react-router-dom'
import { getStatusColor, describeClassStatus, sortClass } from './class-detail';
class ListClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 3,
            openModal: false,
            modalContent: null
        }
    }
    pushData(classes = this.props.classes) {
        let data1 = { ...data };
        data1.rows = [];
        let rows = classes.map((c, i) => {
            let homeRoomTeacher = c.Manager;
            if (homeRoomTeacher !== null) {
                homeRoomTeacher = this.props.teachers.find(t => t.Username === homeRoomTeacher);
            }
            return {
                No: i + 1,
                Name: c.Name,
                Manager: homeRoomTeacher ? homeRoomTeacher.Name : null,
                SubjectQuantity: c.SubjectQuantity,
                StudentQuantity: c.StudentQuantity,
                Status: <Label color={getStatusColor(c.Status)}>
                    {describeClassStatus(c.Status)}
                </Label>,
                Action: <Button color='primary' onClick={() => {
                    this.props.history.push(`/class/${c.Id}/view`);
                }}>Chi tiết</Button>
            }
        })
        data1.rows = rows;
        return data1;
    }
    componentDidMount() {
        available1();
        document.title = 'Danh sách lớp học';
        ClassService.getAll().then(res => {
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
    }

    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }
        let data = this.pushData(this.props.classes);
        return (<Container>
            <Header className='text-center'>Danh sách Lớp học</Header>
            <div className='col-sm-12'>
                <AddClass />
            </div>
            <div className='col-sm-12 row justify-content-center align-self-center'>
                <div className='col-sm-11'>
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
                    <Button color='secondary' onClick={() => {
                        this.setState({
                            openModal: false,
                            modalContent: null
                        })
                    }}>Close</Button>
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
            label: 'Số lượng môn học',
            field: 'SubjectQuantity'
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
    teachers: state.teachers
})

const mapDispatchToProps = dispatch => ({
    setClasses: (list) => {
        sortClass(list);
        dispatch(ClassAction.setClasses(list));
    },
    setTeachers: (list) => {
        dispatch(TeacherAction.setTeachers(list));
    },
    setSubjects: (list) => {
        dispatch(SubjectAction.setSubjects(list));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(ListClass);
