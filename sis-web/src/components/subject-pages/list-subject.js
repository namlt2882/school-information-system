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
class ListSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1,
            openModal: false,
            modalContent: null
        }
    }
    pushData(subjects = this.props.subjects) {
        let data1 = { ...data };
        data1.rows = [];
        let rows = subjects.map((s, i) => {
            return {
                No: i + 1,
                Name: s.Name,
                Action: <Button color='primary' onClick={() => {
                    let modalContent = <SubjectDetail subject={s} />
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
    componentDidMount() {
        available1();
        SubjectService.getAll().then(res => {
            this.props.setSubjects(res.data);
            this.incrementLoading();
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
                    }}>Hủy</Button>
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
