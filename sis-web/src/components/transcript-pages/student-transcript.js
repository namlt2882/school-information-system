import React from 'react';
import Component from '../common/component';
import { available1, PrimaryLoadingPage } from '../common/loading-page';
import { connect } from 'react-redux'
import { TranscriptAction } from '../../actions/transcript-action';
import { TranscriptService } from '../../services/transcript-service';
import { Container } from 'semantic-ui-react';
import { sortSubjectAlphabetically } from '../class-pages/class-detail';

class StudentTranscript extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1,
            classId: this.props.classId,
            studentId: this.props.studentId,
            subjects: [],
            exams: [],
            transcriptMap: null
        }
        this.calculateTranscript = this.calculateTranscript.bind(this);
    }
    componentDidMount() {
        available1();
        TranscriptService.getStudentTranscript(this.state.classId, this.state.studentId).then(res => {
            let list = res.data;
            this.props.setTranscripts(list);
            this.incrementLoading();
            this.calculateTranscript();
        })
    }

    componentWillUnmount() { }

    calculateTranscript() {
        let subjects = [];
        let exams = [];
        let transcriptMap = new Map();
        let transcripts = this.props.transcripts;
        transcripts.forEach(tran => {
            //find and add subject if not existed
            let subject = subjects.find(s => s.csId === tran.ClassSubjectId);
            if (!subject) {
                subject = {
                    csId: tran.ClassSubjectId,
                    name: tran.SubjectName.trim(),
                    Name: tran.SubjectName.trim()
                }
                subjects.push(subject);
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
            transcriptMap.set(`${tran.ClassSubjectId}-${tran.ExamId}`, tran);
        })
        sortSubjectAlphabetically(subjects);
        exams.sort((e1, e2) => -(e2.percent - e1.percent));
        this.setState({
            subjects: subjects,
            exams: exams,
            transcriptMap: transcriptMap
        })
    }

    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }
        let subjects = this.state.subjects;
        let exams = this.state.exams;
        let transcriptMap = this.state.transcriptMap;
        // let mapKeys = [...transcriptMap.keys()]
        let average = 0;
        return (<Container>
            <div className='col-sm-12 row'>
                <table border='1' className='text-center col-sm-12'>
                    <thead>
                        <th></th>
                        {exams.map(e => <th>{e.name}</th>)}
                        <th>Trung bình</th>
                    </thead>
                    <tbody>
                        {subjects.map(s => {
                            let subAverage = 0.0;
                            return <tr>
                                <td className='bold-text'>{s.name}</td>
                                {exams.map((e, i) => {
                                    let transcript = transcriptMap.get(`${s.csId}-${e.id}`);
                                    let score = transcript.Score;
                                    if (score !== null) {
                                        subAverage += 0.01 * score * e.percent;
                                    } else {
                                        score = '-'
                                    }
                                    if (exams.length === (i + 1)) {
                                        average += subAverage;
                                    }
                                    return <td>{score}</td>
                                })}
                                <td>{subAverage.toFixed(2)}</td>
                            </tr>
                        })}
                        <tr>
                            <td></td>
                            {exams.map(e => <td></td>)}
                            <td>{parseFloat(average / subjects.length).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Container>);
    }
}

const mapStateToProps = (state) => ({
    transcripts: state.transcripts
})
const mapDispatchToProps = dispatch => ({
    setTranscripts: (list) => {
        dispatch(TranscriptAction.setTranscripts(list));
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(StudentTranscript);
