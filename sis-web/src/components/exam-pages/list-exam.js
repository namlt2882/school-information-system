import React from 'react';
import Component from '../common/component';
import { connect } from 'react-redux'
import { available1, PrimaryLoadingPage } from '../common/loading-page';
import { MDBDataTable } from 'mdbreact'
import { Container, Header, Button } from 'semantic-ui-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ExamAction } from '../../actions/exam-action';
import { ExamService } from '../../services/exam-service';
import AddExam from './add-exam';
class ListExam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1,
            openModal: false,
            modalContent: null
        }
    }
    pushData(exams = this.props.exams) {
        let data1 = { ...data };
        data1.rows = [];
        let rows = exams.map((e, i) => {
            return {
                No: i + 1,
                Name: e.Name,
                Percent: `${e.PercentRate} %`,
                Action: null
            }
        })
        data1.rows = rows;
        return data1;
    }
    componentDidMount() {
        available1();
        document.title = 'Danh sách kì thi';
        ExamService.getAll().then(res => {
            this.props.setExams(res.data);
            this.incrementLoading();
        })
    }

    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }
        let data = this.pushData(this.props.exams);
        return (<Container>
            <Header className='text-center'>Danh sách Kì thi</Header>
            <div className='col-sm-12'>
                <AddExam />
            </div>
            <div className='col-sm-12 row justify-content-center align-self-center'>
                <div className='col-sm-8'>
                    {data.rows.length > 0 ? <MDBDataTable
                        className='hide-last-row'
                        striped
                        bordered
                        data={data} /> : <span>Không có kì thi nào!</span>}
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
            label: 'Tên kì thi',
            field: 'Name'
        },
        {
            label: 'Trọng số trên tổng điểm',
            field: 'Percent'
        },
        {
            label: '',
            field: 'Action'
        }
    ],
    rows: []
}

const mapStateToProps = (state) => ({
    exams: state.exams
})

const mapDispatchToProps = dispatch => ({
    setExams: (list) => {
        dispatch(ExamAction.setExams(list));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(ListExam);
