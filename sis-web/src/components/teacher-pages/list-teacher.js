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
class ListTeacher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1,
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
    }
    pushData(teachers = this.props.teachers) {
        let data1 = { ...data };
        data1.rows = [];
        let rows = teachers.map((t, i) => {
            return {
                No: i + 1,
                Name: t.Name,
                Action: <Button color='primary' onClick={() => {
                    let modalContent = <TeacherDetail teacher={t} />
                    this.setState({
                        openModal: true,
                        modalContent: modalContent
                    })
                }}>Detail</Button>
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
                <Header className='text-center'>Teacher</Header>
                <div className='col-sm-12'>
                    <AddTeacher />
                </div>
                <div className='col-sm-12 row justify-content-center align-self-center'>
                    <div className='col-sm-8'>
                        {data.rows.length > 0 ? <MDBDataTable
                            className='hide-last-row'
                            striped
                            bordered
                            data={data} /> : <span>Found 0 teacher!</span>}
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
            label: 'Teacher',
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
    teachers: state.teachers
})

const mapDispatchToProps = dispatch => ({
    setTeachers: (list) => {
        dispatch(TeacherAction.setTeachers(list));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(ListTeacher);