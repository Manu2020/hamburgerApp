
import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredients/BurgerIngredient';
import { withRouter } from 'react-router-dom';

const burger = (props) =>{
	//console.log("properties: ",props);
	let transformedIngredients = Object.keys(props.ingredients)
		.map(igKey => {
			return [...Array(props.ingredients[igKey])].map((_,i) => {
				return <BurgerIngredient key={igKey + i} type={igKey} />; // dynamically creates BurgerIngredient components
			})
		}).reduce((arr,el)=> {
				return arr.concat(el);  // flatten array so it might have length equals zero
		},[]);

	if(transformedIngredients.length === 0){
		//console.log("length of ingredients equals 0");
		transformedIngredients = <p>Please start adding ingredients!</p>;  //comments
	}

	//console.log('ingredients array: ',transformedIngredients);
	return(
			<div className={classes.Burger}>
				<BurgerIngredient type="bread-top" />
				{transformedIngredients}
				<BurgerIngredient type="bread-bottom" />
			</div> // comments
	);
}

export default withRouter(burger);