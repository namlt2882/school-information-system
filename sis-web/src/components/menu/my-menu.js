import React, { Component } from 'react';
import {
    Collapse, Navbar, NavbarToggler,
    NavbarBrand, Nav, NavItem,
    NavLink
} from 'reactstrap';
import { Route, Link } from 'react-router-dom';

class MyMenu extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand><Link to='/'>SIS</Link></NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            {menus.map(({ name, to, exact }) =>
                                <Route
                                    path={to} exact={exact}
                                    children={({ match }) => {
                                        var active = match ? 'active' : '';
                                        return (<NavItem>
                                            <NavLink>
                                                <Link to={to}>{name}</Link>
                                            </NavLink>
                                        </NavItem>)
                                    }}
                                />
                            )}
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

export default MyMenu;

const menus = [
    {
        name: 'Dashboard',
        to: '/',
        exact: true
    },
    {
        name: 'User',
        to: '/user',
        exact: false
    },
    {
        name: 'Subject',
        to: '/subject',
        exact: false
    },
    {
        name: 'Student',
        to: '/student',
        exact: false
    },
    {
        name: 'Academic transcript',
        to: '/transcript',
        exact: false
    }
];
