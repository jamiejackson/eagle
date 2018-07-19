import React, { Component } from "react";
import { ButtonToolbar, Navbar, Button } from "react-bootstrap";

class Header extends Component {
	goTo(route) {
		this.props.history.replace(`/${route}`);
	}

	login() {
		this.props.auth.login();
	}

	logout() {
		this.props.auth.logout();
	}

	render() {
		const { isAuthenticated } = this.props.auth;

		return (
			<div>
				<Navbar fluid>
					<Navbar.Header>
						<Navbar.Brand>
							<a href="/">ICF Eagle</a>
						</Navbar.Brand>
						<Navbar.Toggle />
					</Navbar.Header>
					<Navbar.Collapse>
						<Navbar.Form pullRight>
							<ButtonToolbar>
								<Button bsStyle="primary" onClick={this.goTo.bind(this, "home")}>Home</Button>
								<Button	id="qsMoviesBtn" bsStyle="warning" onClick={this.goTo.bind(this, "movies")}>Movies</Button>
								{!isAuthenticated() && (
									<Button	id="qsLoginBtn"	bsStyle="primary" onClick={this.login.bind(this)}>Log In</Button>
								)}
								{isAuthenticated() && (
									<Button	id="qsProtectedBtn"	bsStyle="success" onClick={this.goTo.bind(this, "protected")}>Protected</Button>
								)}
								{isAuthenticated() && (
									<Button	id="qsLogoutBtn" bsStyle="danger" onClick={this.logout.bind(this)}>Log Out</Button>
								)}
							</ButtonToolbar>
						</Navbar.Form>
					</Navbar.Collapse>
				</Navbar>
			</div>
		);
	}
}

export default Header;