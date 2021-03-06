import React from 'react';
import { Jumbotron, Button } from 'reactstrap';
import { isLoggedIn, AuthService } from '../../services/auth-service';
import { Redirect } from 'react-router-dom';
import Component from './component';
import { FormGroup, Label, Input } from 'reactstrap';
import { withRouter } from 'react-router-dom'
import { Form } from 'semantic-ui-react';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoggedIn: false
        }
        isLoggedIn(() => {
            this.setIsLoggedIn(true);
        }, () => { });
        this.login = this.login.bind(this);
        this.changeUsername = this.changeUsername.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.setIsLoggedIn = this.setIsLoggedIn.bind(this);
    }

    setIsLoggedIn = (val) => {
        this.setState({ isLoggedIn: val })
    }

    login() {
        AuthService.login(this.state.username, this.state.password)
            .then(res => {
                this.props.history.push('/')
            }).catch(err => {
                alert('Sai username hoặc mật khẩu!')
            })
    }

    changeUsername(e) {
        this.setState({ username: e.target.value })
    }

    changePassword(e) {
        this.setState({ password: e.target.value })
    }

    render() {
        if (this.state.isLoggedIn) {
            return <Redirect to={{ pathname: '/' }} />
        } else {
            return (<div className='container'>
                <div className='row justify-content-center align-self-center'>
                    <div className='col-sm-6' style={{ 'margin-top': '100px' }}>
                        <Jumbotron>
                            <h3>School Information System</h3>
                            <Form onSubmit={this.login}>
                                <FormGroup>
                                    <Label>Username</Label>
                                    <Input type="text" required={true}
                                        maxLength='20'
                                        placeholder="Username" value={this.state.username}
                                        onChange={this.changeUsername} />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Password</Label>
                                    <Input type="password" required={true}
                                        maxLength='20'
                                        placeholder="Password" value={this.state.password}
                                        onChange={this.changePassword} />
                                </FormGroup>
                                <Button color='primary'>Login</Button>
                            </Form>
                        </Jumbotron>
                    </div></div>
            </div>);
        }
    }
}

export default withRouter(LoginPage);
