import React from 'react';
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { MultiSelect } from '@progress/kendo-react-dropdowns';
import { ClassService } from '../../services/class-service';
import { ClassAction } from '../../actions/class-action';
import Component from '../common/component';
import { PrimaryLoadingPage } from '../common/loading-page';
import { StudentService } from '../../services/student-service';
import { StudentAction } from '../../actions/student-action';

class AddClassMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1,
            isOpen: false,
            selectedStudents: []
        }
        this.onChangeSelectedStudents = this.onChangeSelectedStudents.bind(this);
        this.openModal = this.openModal.bind(this);
        this.removeStudent = this.removeStudent.bind(this);
        this.addStudents = this.addStudents.bind(this);
    }
    componentDidMount() { }
    componentWillUnmount() { }
    openModal() {
        this.setState({
            isOpen: true,
            selectedStudents: [],
            loading: 0
        })
        StudentService.getNoClassStudent().then(res => {
            let list = res.data;
            this.props.setStudents(list);
            this.incrementLoading();
        })
    }
    onChangeSelectedStudents(e) {
        let val = e.target.value;
        this.setState({
            selectedStudents: val
        })
    }
    addStudents() {
        let clazz = this.props.clazz;
        let selectedStudents = this.state.selectedStudents;
        let data = {
            ClassId: clazz.Id,
            StudentIds: selectedStudents.map(s => s.Id)
        }
        ClassService.addStudents(data).then(res => {
            selectedStudents.forEach(s => {
                clazz.Students.push(s);
            })
            this.props.setClass(clazz);
            this.setState({ isOpen: false });
        }).catch(err => {
            window.alert('Tác vụ thất bại, vui lòng thử lại sau!');
        })
    }
    removeStudent(id) {
        let selectedStudents = this.state.selectedStudents;
        selectedStudents = selectedStudents.filter(s => s.Id !== id);
        this.setState({ selectedStudents: selectedStudents });
    }
    render() {
        let students = this.props.students;
        let selectedStudents = this.state.selectedStudents;
        let modalContent = null;
        if (this.isLoading()) {
            modalContent = <PrimaryLoadingPage />
        } else {
            modalContent = [<ModalHeader className='text-center'>
                Thêm học sinh cho lớp {` ${this.props.clazz.Name}`}
            </ModalHeader>,
            <ModalBody className='row'>
                <div className='col-sm-5'>
                    <label>Học sinh chưa có lớp ({students.length}):</label>
                    <MultiSelect
                        data={students}
                        value={selectedStudents}
                        textField='FullName'
                        dataItemKey='Id'
                        onChange={this.onChangeSelectedStudents}
                    />
                </div>
                <div className='col-sm-7'>
                    <label>Học sinh sẽ thêm vào lớp {` ${this.props.clazz.Name} (${selectedStudents.length})`}</label>
                    {selectedStudents.length > 0 ? <table border='1' style={{ width: '100%', boxSizing: 'border-box' }}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Họ</th>
                                <th>Tên</th>
                                <th>Ngày sinh</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedStudents.map((s, i) => <tr key={s.Id}>
                                <td>{i + 1}</td>
                                <td>{s.LastName}</td>
                                <td>{s.FirstName}</td>
                                <td>{s.Birthday ? new Date(s.Birthday).toLocaleDateString() : ''}</td>
                                <td>
                                    <Button color='secondary'
                                        onClick={() => {
                                            this.removeStudent(s.Id);
                                        }}>Xóa</Button>
                                </td>
                            </tr>)}
                        </tbody>
                    </table> : null}
                </div>
            </ModalBody>,
            <ModalFooter>
                <Button color='green' onClick={this.addStudents}>Thêm</Button>
                <Button color='secondary' onClick={() => {
                    this.setState({
                        isOpen: false
                    })
                }}>Hủy</Button>
            </ModalFooter>]
        }
        return (<div style={{ margin: '15px 0px 10px 0px', height: '30px', width: '100%', boxSizing: 'border-box' }}>
            <Button style={{ float: 'right' }} color='primary'
                onClick={this.openModal}>Thêm học sinh</Button>
            <Modal isOpen={this.state.isOpen} className='big-modal'>
                {modalContent}
            </Modal>
        </div>);
    }
}

const mapStateToProps = (state) => ({
    students: state.students,
    clazz: state.clazz
})
const mapDispatchToProps = dispatch => ({
    setClass: (clazz) => {
        dispatch(ClassAction.setClass(clazz));
    },
    setStudents: (list) => {
        list.forEach(s => {
            s.FullName = `${s.LastName} ${s.FirstName}`
        })
        dispatch(StudentAction.setStudents(list));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(AddClassMember);
