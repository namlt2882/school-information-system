import React, { Component } from 'react';
import { connect } from 'react-redux'
import { ExamAction } from '../../actions/exam-action';
import { Button, Form } from 'semantic-ui-react';
import { ExamService } from '../../services/exam-service';

class UpdateExam extends Component {
    constructor(props) {
        super(props);
        let exam = this.props.exams.find(s => s.Id === this.props.examId);
        this.state = {
            formLoading: false,
            name: exam.Name,
            percent: exam.PercentRate
        }
        this.updateExam = this.updateExam.bind(this);
    }
    updateExam() {
        this.setState({ formLoading: true });
        let exams = this.props.exams;
        let exam = exams.find(s => s.Id === this.props.examId);
        ExamService.update(exam.Id, this.state.name, parseInt(this.state.percent))
            .then(res => {
                exam.Name = this.state.name;
                exam.PercentRate = parseInt(this.state.percent);
                this.props.setExams(exams);
                this.props.closeModal();
            }).catch(err => {
                this.setState({ formLoading: false });
            })
    }
    render() {
        let exam = this.props.exams.find(s => s.Id === this.props.examId);
        let max = 100 - this.props.exams.filter(s => s.Id !== this.props.examId)
            .reduce((acc, e) => acc + e.PercentRate, 0);
        return (<Form loading={this.state.formLoading} onSubmit={this.updateExam}>
            <Form.Field>{`Tên kì thi: ${exam ? exam.Name : ''}`}</Form.Field>
            <Form.Field>
                <label>Tên mới</label>
                <input type='text' value={this.state.name} required
                    onChange={(e) => {
                        let val = e.target.value;
                        this.setState({
                            name: val
                        })
                    }} />
            </Form.Field>
            <Form.Field>
                <label>Trọng số trên tổng điểm</label>
                <input type='number' value={this.state.percent} step='1'
                    min={0} max={max} required onChange={(e) => {
                        let val = e.target.value;
                        this.setState({
                            percent: val
                        })
                    }} />
            </Form.Field>
            <Button color='primary'>Cập nhật</Button>
        </Form>);
    }
}
const mapStateToProps = (state) => ({
    exams: state.exams
})

const mapDispatchToProps = dispatch => ({
    setExams: (list) => {
        dispatch(ExamAction.setExams(list));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateExam);