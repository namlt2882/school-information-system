import React from 'react';
import Component from '../common/component';
import { connect } from 'react-redux'
import { StudentAction } from '../../actions/student-action';
import { available1, PrimaryLoadingPage } from '../common/loading-page';
import { StudentService } from '../../services/student-service';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Container, Header, Button } from 'semantic-ui-react';
import { MDBDataTable } from 'mdbreact'
import AddStudent from './add-student';
import StudentDetail from './student-detail';
import { sortSubjectAlphabetically, sortStudentAlphabetically } from '../class-pages/class-detail';
import StudentStatus from './student-status';
import { Link } from 'react-router-dom'

class ListStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1,
            openModal: false,
            modalContent: null
        }
        this.pushData = this.pushData.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    componentDidMount() {
        available1();
        document.title = 'Danh sách học sinh';
        StudentService.getAll().then(res => {
            let list = res.data;
            this.props.setStudents(list);
            this.incrementLoading();
        })
    }

    pushData(students = this.props.students) {
        let data1 = { ...data };
        data1.rows = [];
        let rows = students.map((s, i) => {
            return {
                No: i + 1,
                LastName: s.LastName,
                FirstName: s.FirstName,
                Birthday: s.Birthday ? new Date(s.Birthday).toLocaleDateString() : null,
                Clazz: s.CurrentClass ? <Link target='_blank' to={`/class/${s.CurrentClass.Id}/view`}>
                    {s.CurrentClass.Name}</Link> : null,
                Status: <StudentStatus status={s.Status} />,
                Action: <Button color='primary' onClick={() => {
                    this.props.setStudent(s);
                    let modalContent = <StudentDetail key={s.Id} closeModal={this.closeModal} />
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
        let data = this.pushData(this.props.students);
        return (<Container>
            <Header className='text-center'>Danh sách Học sinh</Header>
            <div className='col-sm-12'>
                <AddStudent />
            </div>
            <div className='col-sm-12 row justify-content-center align-self-center'>
                <div className='col-sm-10'>
                    {data.rows.length > 0 ? <MDBDataTable
                        className='hide-last-row'
                        striped
                        bordered
                        data={data} /> : <span>Không có học sinh nào!</span>}
                </div>
            </div>
            <Modal isOpen={this.state.openModal} className='big-modal'>
                <ModalBody>
                    {this.state.modalContent}
                </ModalBody>
                <ModalFooter>
                    <Button color='secondary' onClick={this.closeModal}>Đóng</Button>
                </ModalFooter>
            </Modal>
        </Container>);
    }
}

const data = {
    columns: [
        {
            label: '#'
        },
        {
            label: 'Họ',
            field: 'LastName'
        },
        {
            label: 'Tên',
            field: 'FirstName'
        },
        {
            label: 'Ngày sinh'
        },
        {
            label: 'Lớp'
        },
        {
            label: 'Tình trạng'
        },
        {
            label: ''
        }
    ],
    rows: []
}

const mapStateToProps = (state) => ({
    students: state.students
})

const mapDispatchToProps = dispatch => ({
    setStudents: (list) => {
        list.forEach(s => {
            s.FullName = `${s.LastName} ${s.FirstName}`;
        })
        sortStudentAlphabetically(list);
        dispatch(StudentAction.setStudents(list));
    },
    setStudent: (student) => {
        dispatch(StudentAction.setStudent(student));
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(ListStudent);
