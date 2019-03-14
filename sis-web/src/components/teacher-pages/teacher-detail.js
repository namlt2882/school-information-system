import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux'
import { Container, List, Button, Icon, Divider, ListItem } from 'semantic-ui-react';

class TeacherDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teacher: null
        }
    }
    render() {
        let teacher = this.props.teacher;
        return (<div className='col-sm-12 row justify-content-center align-self-center'>
            <div className='col-sm-5'>
                <div><Icon name='info' />Teacher Info</div>
                <Divider />
                <table>
                    <tbody>
                        <tr>
                            <td><b>Username</b>:</td>
                            <td>{teacher.Username}</td>
                        </tr>
                        <tr>
                            <td><b>Name</b>:</td>
                            <td>{teacher.Name}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='col-sm-7'>
                <div className='text-center'><Icon name='group' />Classes</div>
                <Divider />
                <div>

                </div>
            </div>
        </div>);
    }
}

const mapStateToProps = (state) => ({
    teachers: state.teachers
})

const mapDispatchToProps = dispatch => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(TeacherDetail);