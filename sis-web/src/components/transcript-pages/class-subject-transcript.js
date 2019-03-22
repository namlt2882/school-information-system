import React from 'react';
import Component from '../common/component';
import { available1, PrimaryLoadingPage } from '../common/loading-page';
import { connect } from 'react-redux'
import { TranscriptAction } from '../../actions/transcript-action';
import { TranscriptService } from '../../services/transcript-service';
import { Container, Header, Form, Button } from 'semantic-ui-react';

class ClassSubjectTranscript extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1,
            classSubjectId: this.props.classSubjectId,
            students: [],
            exams: [],
            subjectName: null,
            transcriptMap: null,
            isLoading: false
        }
        this.calculateTranscript = this.calculateTranscript.bind(this);
        this.onChangeScore = this.onChangeScore.bind(this);
        this.updateTranscript = this.updateTranscript.bind(this);
    }
    componentDidMount() {
        available1();
        TranscriptService.getClassSubjectTranscript(this.state.classSubjectId).then(res => {
            let list = res.data;
            this.props.setTranscripts(list);
            this.incrementLoading();
            this.calculateTranscript();
        })
    }

    componentWillUnmount() { }

    calculateTranscript() {
        let students = [];
        let exams = [];
        let transcriptMap = new Map();
        let transcripts = this.props.transcripts;
        let subjectName = null;
        if (transcripts.length > 0) {
            subjectName = transcripts[0].SubjectName;
        }
        transcripts.forEach(tran => {
            //find and add student if not existed
            let student = students.find(s => s.id === tran.StudentId);
            if (!student) {
                student = this.props.students.find(s => s.Id === tran.StudentId);
                student = {
                    id: tran.StudentId,
                    name: `${student.LastName} ${student.FirstName}`,
                    FirstName: student.FirstName.trim()
                }
                students.push(student);
            }
            //find and add exams if not existed
            let exam = exams.find(e => e.id === tran.ExamId);
            if (!exam) {
                exam = {
                    id: tran.ExamId,
                    name: `${tran.ExamName} (${tran.PercentRate} %)`,
                    percent: tran.PercentRate
                }
                exams.push(exam);
            }
            //add transcript to map with key format: classSubjectId-examId
            transcriptMap.set(`${tran.StudentId}-${tran.ExamId}`, tran);
        })
        sortStudentAlphabetically(students);
        exams.sort((e1, e2) => -(e2.percent - e1.percent));
        this.setState({
            students: students,
            exams: exams,
            transcriptMap: transcriptMap,
            subjectName: subjectName
        })
    }
    onChangeScore(key, score) {
        let transcriptMap = this.state.transcriptMap;
        let transcript = transcriptMap.get(key);
        transcript.Score = score;
        this.setState({ transcriptMap: transcriptMap })
    }

    updateTranscript() {
        if (window.confirm('Are you sure?')) {
            this.setState({ isLoading: true });
            let transcripts = this.state.transcriptMap.entries();
            transcripts = Array.from(transcripts).map(e => e[1]);
            let data = transcripts.map(t => ({
                Id: t.Id,
                Score: t.Score
            }))
            TranscriptService.updateTranscripts(data).then(res => {
                window.alert('Update successfully!');
                this.setState({ isLoading: false });
                this.props.closeModal();
            }).catch(err => {
                window.alert('Service unavailable!');
                this.setState({ isLoading: false });
            })
        }
    }

    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }
        let students = this.state.students;
        let exams = this.state.exams;
        let transcriptMap = this.state.transcriptMap;
        let average = 0;
        return (<Container>
            <Header>{`Môn: ${this.state.subjectName}`}<br />
                {`Giáo viên: ${localStorage.getItem('name')}`}</Header>
            <div className='col-sm-12 row'>
                <Form className='col-sm-12 row' loading={this.state.isLoading}>
                    <table border='1' className='text-center col-sm-12'>
                        <thead>
                            <th>#</th>
                            <th></th>
                            {exams.map(e => <th>{e.name}</th>)}
                            <th>Trung bình</th>
                        </thead>
                        <tbody>
                            {students.map((s, i) => {
                                let subAverage = 0.0;
                                return <tr>
                                    <td>{i + 1}</td>
                                    <td className='bold-text'>{s.name}</td>
                                    {exams.map((e, i) => {
                                        let transcriptKey = `${s.id}-${e.id}`;
                                        let transcript = transcriptMap.get(transcriptKey);
                                        let score = transcript.Score;
                                        if (score !== null) {
                                            subAverage += 0.01 * score * e.percent;
                                        }
                                        if (exams.length === (i + 1)) {
                                            average += subAverage;
                                        }
                                        return <EditableCell key={transcriptKey} score={score}
                                            onChangeScore={(score) => {
                                                this.onChangeScore(transcriptKey, score);
                                            }} />
                                    })}
                                    <td>{subAverage.toFixed(2)}</td>
                                </tr>
                            })}
                            <tr>
                                <td></td>
                                <td></td>
                                {exams.map(e => <td></td>)}
                                <td>{parseFloat(average / students.length).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='col-sm-12'>
                        <Button style={{ float: 'right', margin: '10px' }}
                            color='primary' onClick={this.updateTranscript}>Cập nhật bảng điểm</Button>
                    </div>
                </Form>
            </div>
        </Container>);
    }
}

class EditableCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            score: this.props.score,
            editable: false
        }
        this.setScore = this.setScore.bind(this);
        this.updateOriginScore = this.updateOriginScore.bind(this);
        this.setEditable = this.setEditable.bind(this);
    }
    setScore(e) {
        let score = e.target.value;
        this.setState({
            score: score
        })
    }
    updateOriginScore(e) {
        let score = e.target.value;
        if (score == '') {
            score = null;
        } else {
            score = parseFloat(score);
            if (score < 0 || score > 10) {
                score = this.props.score;
            }
        }
        this.setState({
            score: score ? score : 0,
            editable: false
        })
        this.props.onChangeScore(score);
    }
    setEditable() {
        this.setState({
            score: this.props.score,
            editable: true
        }, () => {
            this.refs.input.focus();
        })
    }
    render() {
        let score = this.state.score;
        let editable = this.state.editable;
        return (<td onDoubleClick={this.setEditable} style={{ cursor: 'pointer' }}>
            <input ref='input' style={{ display: editable ? 'block' : 'none' }} type='number'
                min='0' max='10' step='0.01' value={score} onChange={this.setScore}
                onBlur={this.updateOriginScore}
                onKeyPress={(e) => {
                    if (e.charCode == 13) {
                        this.updateOriginScore(e);
                    }
                }} />
            {!editable ? <span>{this.props.score !== null ? this.props.score : '-'}</span> : null}
        </td>);
    }
}

export const sortStudentAlphabetically = (students) => {
    students.sort((s1, s2) => {
        let name1 = s1.FirstName.toUpperCase();
        let name2 = s2.FirstName.toUpperCase();
        return (name1 < name2) ? -1 : (name1 > name2) ? 1 : 0;
    })
}

const mapStateToProps = (state) => ({
    transcripts: state.transcripts,
    students: state.students
})
const mapDispatchToProps = dispatch => ({
    setTranscripts: (list) => {
        dispatch(TranscriptAction.setTranscripts(list));
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(ClassSubjectTranscript);
