import React from 'react';
import Component from '../common/component';
import { SubjectAction } from '../../actions/subject-action';
import { connect } from 'react-redux'
import { available1, PrimaryLoadingPage } from '../common/loading-page';
import { SubjectService } from '../../services/subject-service';
import SubjectDetail from './subject-detail';
import AddSubject from './add-subject';
import { MDBDataTable } from 'mdbreact'
import { Container, Header, Button } from 'semantic-ui-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import UpdateSubject from './update-subject';
class ListSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1,
            openModal: false,
            modalContent: null
        }
        this.closeModal = this.closeModal.bind(this);
    }
    pushData(subjects = this.props.subjects) {
        let data1 = { ...data };
        data1.rows = [];
        let rows = subjects.map((s, i) => {
            return {
                No: i + 1,
                Name: s.Name,
                Action: <Button color='primary' onClick={() => {
                    let modalContent = <UpdateSubject key={s.Id} subjectId={s.Id}
                        closeModal={this.closeModal} />
                    this.setState({
                        openModal: true,
                        modalContent: modalContent
                    })
                }}>Cập nhật</Button>
            }
        })
        data1.rows = rows;
        return data1;
    }
    componentDidMount() {
        available1();
        document.title = 'Danh sách môn học'
        SubjectService.getAll().then(res => {
            this.props.setSubjects(res.data);
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
        let data = this.pushData(this.props.subjects);
        return (<Container>
            <Header className='text-center'>Danh sách Môn học</Header>
            <div className='col-sm-12'>
                <AddSubject />
            </div>
            <div className='col-sm-12 row justify-content-center align-self-center'>
                <div className='col-sm-8'>
                    {data.rows.length > 0 ? <MDBDataTable
                        className='hide-last-row'
                        striped
                        bordered
                        data={data} /> : <span>Không thấy môn học nào!</span>}
                </div>
            </div>
            <Modal isOpen={this.state.openModal}>
                <ModalHeader>Cập nhật môn học</ModalHeader>
                <ModalBody>
                    {this.state.modalContent}
                </ModalBody>
                <ModalFooter>
                    <Button color='secondary' onClick={this.closeModal}>Hủy</Button>
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
            label: 'Tên môn học',
            field: 'Name'
        },
        {
            label: '',
            field: 'Action'
        }
    ],
    rows: []
}

const mapStateToProps = (state) => ({
    subjects: state.subjects
})

const mapDispatchToProps = dispatch => ({
    setSubjects: (list) => {
        dispatch(SubjectAction.setSubjects(list));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(ListSubject);
