
import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-orders';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as burgerBuilderActions from '../../store/actions/index';

class BurgerBuilder extends Component{
	/*
	constructor(props){

	}
	*/
	state ={
		purchasing: false
	}

	componentDidMount () {
		console.log(this.props);
		this.props.onInitIngredients();
		/*
		axios.get('https://hamburgerapp-99994.firebaseio.com/ingredients.json')
			.then(response => {
				this.setState({ingredients: response.data});
			})
			.catch(error => {
				this.setState({error: true});
			});
		*/
	}

	updatePurchaseState (ingredients) {
		const sum = Object.keys(ingredients)
			.map(igKey =>{
				return ingredients[igKey]
			})
			.reduce((sum,el) => {
					return sum + el;
				},0);
		// this.setState({purchasable : sum > 0});
		return sum > 0;
	}

	/*
	addIngredientHandler = (type) =>{
		const oldCount = this.state.ingredients[type];
		const updatedCounted = oldCount + 1;
		//console.log('type: ',type);
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type]= updatedCounted;
		//console.log('updatedIngredients: ',updatedIngredients);
		const priceAddition= INGREDIENT_PRICES[type];
		const oldPrice= this.state.totalPrice;
		const newPrice= oldPrice + priceAddition;
		this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
		this.updatePurchaseState(updatedIngredients);
	}

	removeIngredientHandler = (type) =>{
		const oldCount = this.state.ingredients[type];
		if (oldCount <= 0){
			return;
		}
		const updatedCounted = oldCount -1;
		console.log('type: ',type);
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type]= updatedCounted;
		console.log('updatedIngredients: ',updatedIngredients);
		const priceReduction= INGREDIENT_PRICES[type];
		const oldPrice= this.state.totalPrice;
		const newPrice= oldPrice - priceReduction;
		this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
		this.updatePurchaseState(updatedIngredients);	
	}
	*/

	purchaseHandler = () =>{
		if(this.props.isAuthenticated){
			this.setState({purchasing: true});
		} else {
			this.props.onSetAuthRedirectPath('/checkout');
			this.props.history.push('/auth');
		}

	}

	purchasedCancelHandler = () =>{
		this.setState({purchasing: false});
	}

	purchasedContinueHandler = () =>{
		//alert('Continue pressed!');
		/*
		const queryParams= [];
		for(let i in this.state.ingredients){
			queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
		}
		queryParams.push('price='+this.state.totalPrice);
		const queryString = queryParams.join('&');
		this.props.history.push({
			pathname: '/checkout',
			search: '?' + queryString
		});
		*/
		this.props.onInitPurchase();
		this.props.history.push('/checkout');
	}

	render (){
		const disabledInfo={
			...this.props.ings
		};
		for(let key in disabledInfo){
			disabledInfo[key] = disabledInfo[key] <= 0;
		}
		let orderSummary = null;
		let burger = this.props.error ? <p>Ingredients cannot be loaded.</p> : <Spinner />;
		if(this.props.ings) {
			burger = (
				<Auxiliary>
					<Burger ingredients={this.props.ings}/>
					<BuildControls 
						ingredientAdded={this.props.onIngredientAdded} 
						ingredientRemoved={this.props.onIngredientRemoved}
						disabled= {disabledInfo}
						purchasable= {this.updatePurchaseState(this.props.ings)}
						price={this.props.price}
						ordered={this.purchaseHandler}
						isAuth={this.props.isAuthenticated}
					/>
				</Auxiliary>
			);
			orderSummary= <OrderSummary ingredients= {this.props.ings}
						purchaseCancel={this.purchasedCancelHandler}
						purchaseContinue={this.purchasedContinueHandler}
						price={this.props.price}/>; 
		}
		return(
			<Auxiliary>
				<Modal show={this.state.purchasing} modalClosed={this.purchasedCancelHandler}> 
					{orderSummary}
				</Modal>
				{burger}
			</Auxiliary>
		);
	}
}

const mapStateToProps = state => {
	return{
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
		isAuthenticated: state.auth.token !== null
	};
}

const mapDispatchToProps = dispatch => {
	return{
		onIngredientAdded: (ing) => dispatch(burgerBuilderActions.addIngredient(ing)),
		onIngredientRemoved: (ing) => dispatch(burgerBuilderActions.removeIngredient(ing)),
		onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients()),
		onInitPurchase: () => dispatch(burgerBuilderActions.purchaseInit()),
		onSetAuthRedirectPath: (path) => dispatch(burgerBuilderActions.setAuthRedirectPath(path))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
