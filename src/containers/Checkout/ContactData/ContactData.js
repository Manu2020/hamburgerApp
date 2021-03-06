
import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import axios from '../../../axios-orders'
import classes from './ContactData.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index'

import { connect } from 'react-redux';

/* eslint-disable no-useless-escape */

class ContactData extends Component {
	state = {
		orderForm: {
			name: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Your Name'
				},
				value: '',
				validation : {
					required: true
				},
				valid: false,
				touched: false
			},
			street: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Street'
				},
				value: '',
				validation : {
					required: true
				},
				valid: false,
				touched: false
			},
			zipCode: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Zip Code'
				},
				value: '',
				validation : {
					required: true,
					minLength: 5,
					maxLength: 5
				},
				valid: false,
				touched: false
			},
			country: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Country'
				},
				value: '',
				validation : {
					required: true
				},
				valid: false,
				touched: false
			},	
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'E-mail'
				},
				value: '',
				validation : {
					required: true
				},
				valid: false,
				touched: false
			},
			deliveryMethod: {
				elementType: 'select',
				elementConfig: {
					options: [
						{value: 'fastest', displayValue: 'Fastest'},
						{value: 'cheapest', displayValue: 'Cheapest'}
						]
				},
				value: 'Fastest',
				valid: true
			},			
		},
		formIsValid: false
	}

	checkValidity(value, rules){
		let isValid = true;
		//console.log('rules: ',rules);
		if (rules.required){
			isValid = value.trim() !== '' && isValid;
		}
		if(rules.minLength){
			isValid = value.length >= rules.minLength && isValid;
			//console.log("minLength check: ",isValid);
		}
		if(rules.maxLength){
			isValid = value.length <= rules.maxLength && isValid;
			//console.log("maxLength check: ",isValid);
		}
		if(rules.isEmail){
			const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			isValid = pattern.test(value) && isValid
		}
		return isValid;
	}

	inputChangedHandler = (event, inputIdentifier) => {
		//it is necessary to clone the state and then also the
		//	updated element, otherwise nested attributes point to
		//		the original state object and the update of state
		//			won't be done correctly async.
		const updatedOrderForm= { ...this.state.orderForm };
		const updatedFormElement={ ...updatedOrderForm[inputIdentifier] };
		//console.log("element to validate: : ",updatedFormElement);
		updatedFormElement.value = event.target.value;
		if(updatedFormElement.elementType !== 'select'){
			updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
		}
		updatedFormElement.touched = true;
		updatedOrderForm[inputIdentifier] = updatedFormElement;
		//console.log(updatedFormElement);
		let formIsValid = true;
		for( let inputIdentifier in updatedOrderForm){
			formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
		}
		//console.log(formIsValid);
		this.setState({orderForm: updatedOrderForm, formIsValid:formIsValid});
	}

	orderHandler = (event) => {
		event.preventDefault();
		const formData = {};
		for(let formElementIdentifier in this.state.orderForm){
			formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
		}
		const order = {
			ingredients: this.props.ings,
			price: this.props.price,
			orderData: formData,
			userId: this.props.userId
		}
		this.props.onOrderBurger(order, this.props.token);
	}

	render () {
		const formElementsArray = [];
		for (let key in this.state.orderForm){
			formElementsArray.push({
				id: key,
				config: this.state.orderForm[key]
			});
		}

		let form= (
			<form onSubmit={this.orderHandler}>
				{formElementsArray.map(formElement => (
					<Input key={formElement.id} 
						elementType={formElement.config.elementType}
						elementConfig= {formElement.config.elementConfig}
						value={formElement.config.value}
						invalid={!formElement.config.valid}
						shouldValidate= {formElement.config.validation}
						touched={formElement.config.touched}
						changed= {(event) => this.inputChangedHandler(event,formElement.id)} /> 
				))}
				<Button btnType="Success" disabled={!this.state.formIsValid} clicked={this.orderHandler}>ORDER</Button>
			</form>
		);
		if(this.props.loading){
			form = <Spinner />;
		}
		return (
			<div className= {classes.ContactData}>
				<h4>Enter your Contact Data </h4>
				{form}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return{
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		loading: state.order.loading,
		token: state.auth.token,
		userId: state.auth.userId
	}
}

const mapDispatchToProps = dispatch => {
	return{
		onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));