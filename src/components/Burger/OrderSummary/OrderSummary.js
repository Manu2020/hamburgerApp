import React, {Component} from 'react';
import Auxiliary from '../../../hoc/Auxiliary/Auxiliary';
import Button from '../../UI/Button/Button';


class OrderSummary extends Component{

	// this could be a functional component

	/*
	componentWillUpdate(){
		console.log('order summary will update');
	}
	*/

	render(){
		const ingredientsSummary = Object.keys(this.props.ingredients).map(igKey =>{
			return 	<li key= {igKey}>
			<span style={{textTransform: 'capitalize'}}>{igKey}</span>: {this.props.ingredients[igKey]}
			</li>
		});
		return(
			<Auxiliary>
				<h3> Your Order </h3>
				<p> A very good yummy burger with the following ingredients:</p>
				<ul>
					{ingredientsSummary}
				</ul>
				<p><strong>Total Price: {this.props.price.toFixed(2)}</strong></p>
				<p>Continue to checkout?</p>
				<Button
				btnType="Danger"
				clicked={this.props.purchaseCancel}>CANCEL</Button>			
				<Button
				btnType="Success"
				clicked={this.props.purchaseContinue}>CONTINUE</Button>
			</Auxiliary>
		);
	}
}

export default OrderSummary;