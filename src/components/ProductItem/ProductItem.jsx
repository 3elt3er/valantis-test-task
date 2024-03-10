import classes from "./ProductItem.module.css";

const ProductItem = (props) => {
	const {id, brand, price, product} = props.item;
	return (
		<div className={classes.item}>
			<div className={classes.row}>{`ID: ${id}`}</div>
			<div className={classes.row}>{brand ? `Brand: ${brand}` : null}</div>
			<div className={classes.row}>{`Price: ${price}`}</div>
			<div className={classes.row}>{`Product: ${product}`}</div>
		</div>
	);
};

export default ProductItem;