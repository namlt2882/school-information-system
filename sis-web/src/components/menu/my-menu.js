import React, { Component } from 'react';
import {
	Collapse, Navbar, NavbarToggler,
	NavbarBrand, Nav, NavItem,
	NavLink, Dropdown, DropdownToggle,
	DropdownMenu, DropdownItem
} from 'reactstrap';
import { Route, Link } from 'react-router-dom';
import '../common/common.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faTachometerAlt, faUsers, faBook,
	faUserGraduate, faScroll, faUserCircle
} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { AuthService } from '../../services/auth-service';
library.add(faTachometerAlt, faUsers, faBook, faUserGraduate, faScroll, faUserCircle);

class MyMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
			dropdownProfile: false
		};
		this.toggle = this.toggle.bind(this);
		this.toggleProfile = this.toggleProfile.bind(this);
	}
	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}
	toggleProfile() {
		this.setState(prevState => ({
			dropdownProfile: !prevState.dropdownProfile
		}));
	}
	render() {
		return (
			<div className='navbar-holder'>
				<div className='my-navbar'>
					<Navbar color="light" light expand="md" color='royalblue'>
						<NavbarBrand><Link to='/'>SIS</Link></NavbarBrand>
						<NavbarToggler onClick={this.toggle} />
						<Collapse isOpen={this.state.isOpen} navbar>
							<Nav className="ml-auto" navbar>
								{menus.map(({ name, to, exact, icon, roles }) => {
									let role = localStorage.getItem('role');
									let isAuthenticated = roles.some((r) => r == role);
									if (!isAuthenticated) {
										return false;
									}
									return (<Route
										path={to} exact={exact}
										children={({ match }) => {
											var active = match ? 'active' : '';
											var clazz = active ? 'choosen-nav-item' : '';
											return (<NavItem className={clazz}>
												<NavLink>
													<FontAwesomeIcon icon={icon} color='white' size='md'
														style={{
															margin: '0 5 0 5',
															opacity: active ? '1' : '0.7'
														}} />
													<Link to={to}>
														{name}
													</Link>
												</NavLink>
											</NavItem>)
										}}
									/>)
								}
								)}
								<MyProfile dropdownProfile={this.state.dropdownProfile}
									toggleProfile={this.toggleProfile} />
							</Nav>
						</Collapse>
					</Navbar>
				</div>
			</div>
		);
	}
}

class MyProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	render() {
		return (<NavItem className='nav-icon'>
			<div style={{ paddingTop: '2px' }}>
				<Dropdown isOpen={this.props.dropdownProfile} toggle={this.props.toggleProfile}
					className='my-profile'>
					<DropdownToggle className='transparent-button'>
						<FontAwesomeIcon icon='user-circle' color='white' size='lg' />
					</DropdownToggle>
					<DropdownMenu className='nav-icon-panel row justify-content-center align-self-center'>
						<div className='col-sm-10' style={{ cursor: 'default' }}>
							Hi, <b>{localStorage.getItem('name')}</b><br />
						</div>
						<DropdownItem>
							My profile
                            </DropdownItem>
						<DropdownItem onClick={() => {
							AuthService.logout();
						}}>
							<FontAwesomeIcon icon='sign-out-alt' color='black' size='sm' />
							Logout
                        </DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</div>
		</NavItem>);
	}
}

export default MyMenu;

const menus = [
	{
		name: 'Dashboard',
		to: '/',
		exact: true,
		icon: 'tachometer-alt',
		roles: [1]
	},
	{
		name: 'User',
		to: '/user',
		exact: false,
		icon: 'users',
		roles: [1]
	},
	{
		name: 'Subject',
		to: '/subject',
		exact: false,
		icon: 'book',
		roles: [1]
	},
	{
		name: 'Student',
		to: '/student',
		exact: false,
		icon: 'user-graduate',
		roles: [1]
	},
	{
		name: 'Academic transcript',
		to: '/transcript',
		exact: false,
		icon: 'scroll',
		roles: [1]
	}
];
