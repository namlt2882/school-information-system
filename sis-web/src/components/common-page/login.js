import React, { Component } from 'react';
import { Jumbotron, Button } from 'reactstrap';
import { isLoggedIn } from '../../services/auth-service';
import { Redirect } from 'react-router-dom';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        if (isLoggedIn()) {
            return <Redirect to={{ pathname: '/' }} />
        } else {
            return (<div>
                <Jumbotron>
                    Login page
            </Jumbotron>
            </div>);
        }
    }
}

export default LoginPage;
