
import React, { Component } from 'react';
import Auxiliary from '../Auxiliary/Auxiliary';
import classes from './Layout.css';
import Toolbar from '../../Navigation/Toolbar/Toolbar';
import { connect } from 'react-redux';
import SideDrawer from '../../Navigation/SideDrawer/SideDrawer';

class Layout extends Component {

	state= {
		showSideDrawer: false
	}

	sideDrawerClosedHandler = () => {
		this.setState({showSideDrawer: false});
	}

	toggleSideDrawerHandler = () => {
		this.setState((prevState) => {
			return {showSideDrawer: !prevState.showSideDrawer};
		});
	}

	render(){
		return(
			<Auxiliary>
				<Toolbar 
					drawerToggleClicked={this.toggleSideDrawerHandler}
					isAuth={this.props.isAuthenticated}
				/>
				<SideDrawer 
					closed= {this.sideDrawerClosedHandler} 
					open= {this.state.showSideDrawer} 
					isAuth={this.props.isAuthenticated}
				/>
				<main className= {classes.Content}>
					{this.props.children}
				</main>
			</Auxiliary>
		);
	}
}

const mapStateToProps = state => {
	return{
		isAuthenticated: state.auth.token !== null
	};
}

export default connect(mapStateToProps)(Layout);