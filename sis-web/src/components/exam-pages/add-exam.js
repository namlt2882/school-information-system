import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux'
import { ExamAction } from '../../actions/exam-action';
import { ExamService } from '../../services/exam-service';
import { AuthService } from '../../services/auth-service';

class AddExam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            name: null,
            percent: 0,
            loading: false
        }
        this.openModal = this.openModal.bind(this);
        this.addExam = this.addExam.bind(this);
    }
    openModal() {
        this.setState({
            isOpen: true,
            name: null,
            percent: 0
        });
    }
    addExam() {
        this.setState({ loading: true });
        let data = {
            Name: this.state.name,
            PercentRate: this.state.percent
        }
        ExamService.addExam(data).then(res => {
            let rs = res.data;
            this.props.addExam(rs);
            this.setState({ isOpen: false, loading: false });
        }).catch(err => {
            alert('Service unavailable!');
            this.setState({ loading: false });
        })
    }
    render() {
        let max = 100 - this.props.exams.reduce((acc, e) => { return acc + e.PercentRate }, 0);
        return (<div>
            {AuthService.isManager() ? <Button color='primary' onClick={this.openModal}>Thêm kì thi</Button> : null}
            <Modal isOpen={this.state.isOpen}>
                <ModalHeader className='text-center'>
                    Thêm kì thi
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.addExam} loading={this.state.loading}>
                        <Form.Field>
                            <label>Tên</label>
                            <input type='text' placeholder='Name' required
                                value={this.state.name}
                                onChange={(e) => {
                                    this.setState({ name: e.target.value });
                                }} />
                        </Form.Field>
                        <Form.Field>
                            <label>Trọng số trên tổng điểm ({`0% <= x <= ${max}%`})</label>
                            <input type='number' required
                                value={this.state.percent}
                                min={0} max={max}
                                onChange={(e) => {
                                    let value = parseInt(e.target.value);
                                    this.setState({ percent: value });
                                }} />
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
                    }}>Hủy</Button>
                </ModalFooter>
            </Modal>
        </div>);
    }
}

const mapStateToProps = (state) => ({
    exams: state.exams
})

const mapDispatchToProps = dispatch => ({
    addExam: (exam) => {
        dispatch(ExamAction.addExam(exam));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(AddExam);