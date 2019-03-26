import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { SubjectService } from '../../services/subject-service';
import { connect } from 'react-redux'
import { SubjectAction } from '../../actions/subject-action';

class UpdateSubject extends Component {
    constructor(props) {
        super(props);
        let subject = this.props.subjects.find(s => s.Id === this.props.subjectId);
        this.state = {
            formLoading: false,
            name: subject.Name
        }
        this.updateSubject = this.updateSubject.bind(this);
    }
    updateSubject() {
        this.setState({ formLoading: true })
        let subjects = this.props.subjects;
        let subject = subjects.find(s => s.Id === this.props.subjectId);
        SubjectService.update(subject.Id, this.state.name)
            .then(res => {
                subject.Name = this.state.name;
                this.setState({ formLoading: false })
                this.props.setSubjects(subjects);
                this.props.closeModal();
            }).catch(err => {
                window.alert('Tác vụ không thành công, vui lòng thử lại sau!');
                this.setState({ formLoading: false })
            })
    }
    render() {
        let subject = this.props.subjects.find(s => s.Id === this.props.subjectId);
        return (<Form loading={this.state.formLoading} onSubmit={this.updateSubject}>
            <Form.Field>
                <label>{`Môn: ${subject ? subject.Name : ''}`}</label>
            </Form.Field>
            <Form.Field>
                <label>Tên mới:</label>
                <input required value={this.state.name}
                    maxLength='50'
                    onChange={(e) => {
                        let val = e.target.value;
                        this.setState({ name: val });
                    }} />
            </Form.Field>
            <Button color='primary'>Cập nhật</Button>
        </Form>);
    }
}
const mapStateToProps = (state) => ({
    subjects: state.subjects
})

const mapDispatchToProps = dispatch => ({
    setSubjects: (list) => {
        dispatch(SubjectAction.setSubjects(list));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateSubject);
