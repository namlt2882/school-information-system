import React from 'react';
import { Container, Header, Button } from 'semantic-ui-react';
import Component from './component';
import { TeacherService } from '../../services/teacher-service';
import { AuthService } from '../../services/auth-service';

class PersonalPage extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.changePassword = this.changePassword.bind(this);
    }

    changePassword() {
        let username = AuthService.getUsername();
        while (true) {
            let password = window.prompt('Nhập mật khẩu mới:');
            if (password == null) {
                return;
            }
            if (password.trim() == '' || password.length < 4 || password.length > 20) {
                window.alert('Mật khẩu phải có ít nhất 4 kí tự, nhiều nhất 20 kí tự và không chứa dấu cách');
            } else {
                while (true) {
                    let confirmPassword = window.prompt('Nhập lại mật khẩu mới:');
                    if (confirmPassword == null) {
                        return;
                    }
                    if (confirmPassword != password) {
                        window.alert('Nhập lại mật khẩu mới sai, vui lòng nhập lại!');
                    } else {
                        TeacherService.changePassword(username, password).then(res => {
                            window.alert('Đổi mật khẩu thành công!')
                            AuthService.logout();
                        }).catch(err => {
                            window.alert('Tác vụ thất bại, vui lòng thử lại sau!');
                        })
                        return;
                    }
                }
            }
        }
    }

    render() {
        let username = localStorage.getItem('username');
        let name = localStorage.getItem('name');
        let role = localStorage.getItem('role');
        if (role == 1) {
            role = 'Admin'
        } else if (role == 2) {
            role = 'Giáo viên'
        }
        return (<Container className='col-sm-12 row'>
            <Header className='text-center'>Thông tin cá nhân</Header>
            <div className='col-sm-12 row'>
                <div className='col-sm-7 row justify-content-center align-self-center'>
                    <table>
                        <tbody>
                            <tr>
                                <td className='bold-text'>Username:</td>
                                <td>{username}</td>
                            </tr>
                            <tr>
                                <td className='bold-text'>Họ và tên:</td>
                                <td>{name}</td>
                            </tr>
                            <tr>
                                <td className='bold-text'>Quyền hạn:</td>
                                <td>{role}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><Button color='primary'
                                    onClick={this.changePassword}>Đổi mật khẩu</Button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </Container>);
    }
}

export default PersonalPage;