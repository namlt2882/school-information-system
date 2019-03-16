import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux'
import { SubjectService } from '../../services/subject-service';
import { SubjectAction } from '../../actions/subject-action';

class AddSubject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            name: null,
            loading: false
        }
        this.openModal = this.openModal.bind(this);
        this.addSubject = this.addSubject.bind(this);
    }
    openModal() {
        this.setState({
            isOpen: true,
            name: null
        });
    }
    addSubject() {
        this.setState({ loading: true });
        let data = {
            Name: this.state.name
        }
        SubjectService.addSubject(data).then(res => {
            let rs = res.data;
            this.props.addSubject(rs);
            this.setState({ isOpen: false, loading: false });
        }).catch(err => {
            alert('Service unavailable!');
            this.setState({ loading: false });
        })
    }
    render() {
        return (<div>
            <Button color='primary' onClick={this.openModal}>Thêm môn học</Button>
            <Modal isOpen={this.state.isOpen}>
                <ModalHeader className='text-center'>
                    Thêm môn học
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.addSubject} loading={this.state.loading}>
                        <Form.Field>
                            <label>Tên</label>
                            <input type='text' placeholder='Name' required
                                value={this.state.name}
                                onChange={(e) => {
                                    this.setState({ name: e.target.value });
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
    subjects: state.subjects
})

const mapDispatchToProps = dispatch => ({
    addSubject: (subject) => {
        dispatch(SubjectAction.addSubject(subject));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(AddSubject);