import MyInput from "../UI/input/MyInput.jsx";
import MySelect from "../UI/select/MySelect.jsx";
import classes from "./ProductFilter.module.css";

const ProductFilter = ({filter, setFilter}) => {
	return (
		<div className={classes.filterBox}>
			<MyInput
				placeholder="Критерии сортировки..."
				value={filter.value}
				onChange={e => setFilter({...filter, value: e.target.value})}

			/>
			<MySelect
				value={filter.sortType}
				onChange={selectedSort => setFilter({...filter, sortType: selectedSort})}
				defaultValue="Сортировка по"
				options={[
					{value: 'product', name: 'По названию'},
					{value: 'price', name: 'По цене'},
					{value: 'brand', name: 'По бренду'},
				]}
			/>
		</div>
	);
};

export default ProductFilter;