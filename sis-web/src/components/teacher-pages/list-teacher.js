import React from 'react';
import Component from '../common/component';
import { Container, Header, Button } from 'semantic-ui-react';
import AddTeacher from './add-teacher';
import { connect } from 'react-redux'
import { available1, PrimaryLoadingPage } from '../common/loading-page';
import { TeacherAction } from '../../actions/teacher-action';
import { MDBDataTable } from 'mdbreact'
import { TeacherService } from '../../services/teacher-service';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TeacherDetail from './teacher-detail';
import { SubjectAction } from '../../actions/subject-action';
import { SubjectService } from '../../services/subject-service';
class ListTeacher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 2,
            openModal: false,
            modalContent: null
        }
        this.pushData = this.pushData.bind(this);
    }
    componentDidMount() {
        available1();
        TeacherService.getAll().then(res => {
            this.props.setTeachers(res.data);
            this.incrementLoading();
        })
        SubjectService.getAll().then(res => {
            this.props.setSubjects(res.data);
            this.incrementLoading();
        })
    }
    pushData(teachers = this.props.teachers) {
        let data1 = { ...data };
        data1.rows = [];
        let rows = teachers.map((t, i) => {
            let subject = this.props.subjects.find(s => s.Id === t.SubjectId);
            return {
                No: i + 1,
                Name: t.Name,
                Subject: subject ? subject.Name : '',
                HomeroomClass: t.HomeroomClass.map((hc, i) => `${i > 0 ? ', ' : ''}${hc.Name}`),
                TeachingClassQuantity: t.TeachingClassQuantity > 0 ? `${t.TeachingClassQuantity} lớp` : '(không)',
                Action: <Button color='primary' onClick={() => {
                    let modalContent = <TeacherDetail teacher={t} />
                    this.setState({
                        openModal: true,
                        modalContent: modalContent
                    })
                }}>Chi tiết</Button>
            }
        })
        data1.rows = rows;
        return data1;
    }
    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }
        let data = this.pushData(this.props.teachers);
        return (
            <Container>
                <Header className='text-center'>Danh sách Giáo viên</Header>
                <div className='col-sm-12'>
                    <AddTeacher />
                </div>
                <div className='col-sm-12 row justify-content-center align-self-center'>
                    <div className='col-sm-8'>
                        {data.rows.length > 0 ? <MDBDataTable
                            className='hide-last-row'
                            striped
                            bordered
                            data={data} /> : <span>Không có giáo viên nào!</span>}
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
                        }}>Đóng</Button>
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
            label: 'Tên giáo viên',
            field: 'Name'
        },
        {
            label: 'Bộ môn',
            field: 'Subject'
        },
        {
            label: 'Chủ nhiệm lớp',
            field: 'HomeroomClass'
        },
        {
            label: 'Đang dạy',
            field: 'TeachingClassQuantity'
        },
        {
            label: '',
            field: 'Action'
        }
    ],
    rows: []
}

const mapStateToProps = (state) => ({
    teachers: state.teachers,
    subjects: state.subjects
})

const mapDispatchToProps = dispatch => ({
    setTeachers: (list) => {
        dispatch(TeacherAction.setTeachers(list));
    },
    setSubjects: (list) => {
        dispatch(SubjectAction.setSubjects(list));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(ListTeacher);