import React from 'react';
import Logo from '../../components/Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.css';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';

const sideDrawer = (props) => {

	let attachedClasses= [classes.SideDrawer, classes.Close];
	if(props.open){
		attachedClasses = [classes.SideDrawer, classes.Open];
	}

	return (
		<Auxiliary>
		<Backdrop show={props.open} clicked={props.closed}/>
		<div className= {attachedClasses.join(' ')} onClick={props.closed}>
			<Logo height="11%" marginB="32px" />
			<nav>
				<NavigationItems isAuthenticated={props.isAuth}/>
			</nav>
		</div>
		</Auxiliary>

	);

};

export default sideDrawer;