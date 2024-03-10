import {useEffect, useState} from 'react';
import ProductItem from "../ProductItem/ProductItem.jsx";
import ServiceAPI from "../../API/ServiceAPI.js";
import classes from "./ProductList.module.css";
import ProductFilter from "../ProductFilter/ProductFilter.jsx";
import MyButton from "../UI/button/MyButton.jsx";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [isProductsLoading, setIsProductsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [inputValue, setInputValue] = useState('')
    const [filter, setFilter] = useState({sortType: '', value: ''})

    const limitPerPage = 50;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsProductsLoading(true);
                let offset;
                let limit;

                if (currentPage === 1) {
                    offset = 0;
                    limit = 47;
                } else {
                    offset = (currentPage - 2) * limitPerPage + 47;
                    limit = limitPerPage;
                }

                const ids = await ServiceAPI.getIds(offset, limit);
                const items = await ServiceAPI.getItems(ids);

                const uniqueItems = items.filter((item, index, self) => self.findIndex(t => t.id === item.id) === index);

                if (uniqueItems.length < 50) {
                    const additionalOffset = (50 - uniqueItems.length) * (currentPage - 1);
                    const additionalIds = await ServiceAPI.getIds(additionalOffset, 50 - uniqueItems.length);
                    const additionalItems = await ServiceAPI.getItems(additionalIds);
                    const additionalUniqueItems = additionalItems.filter((item, index, self) => self.findIndex(t => t.id === item.id) === index);
                    setProducts([...uniqueItems, ...additionalUniqueItems]);
                } else {
                    setProducts(uniqueItems);
                }
                setIsProductsLoading(false);
            } catch (error) {
                console.error('Ошибка при получении товаров:', error);
                fetchData();
                console.log('Отправка запроса повторно...')
            }
        };
        fetchData();
    }, [currentPage]);


    const fetchDataFiltered = async (field, value) => {
        try {
            if (field) {
                setIsProductsLoading(true);
                let numericValue;
                if (field === 'price') {
                    numericValue = Number(value)
                } else {
                    numericValue = String(value);
                }
                console.log(typeof numericValue)
                const ids = await ServiceAPI.filterProducts(field, numericValue);
                const items = await ServiceAPI.getItems(ids);
                const uniqueItems = items.filter((item, index, self) => self.findIndex(t => t.id === item.id) === index);
                setProducts(uniqueItems);
                setIsProductsLoading(false);
            } else {
                alert('Выберите метод сортировки')
            }

        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            fetchDataFiltered(field, value);
            console.log('Отправка запроса повторно...')
        }
    };


    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1)
        setInputValue(currentPage - 1)
    }
    const handleNextPage = () => {
        setCurrentPage(currentPage + 1)
        setInputValue(currentPage + 1)
        console.log(typeof filter.value)
    }

    const handleChange = (event) => {
        setInputValue(event.target.value)
        if (event.target.value > 0) {
            setTimeout(() => {
                setCurrentPage(event.target.value === '' ? 1 : Number(event.target.value))
            }, 2000)
        }
    }
    return (
        <section>
            <ProductFilter filter={filter} setFilter={setFilter}/>
            <div className={classes.filter}>
                <MyButton onClick={() => fetchDataFiltered(filter.sortType, filter.value)}>Отфильтровать</MyButton>
            </div>
            <hr/>
            <div className={classes.gridLayout}>
                {isProductsLoading
                  ? <h1>Идет загрузка...</h1>
                  : products.length ?
                    products.map((item, index) =>
                      <ProductItem key={index} item={item}/>
                    ) : <h1>Товары не найдены!</h1>
                }
            </div>
            <h1>Текущая страница: {currentPage}</h1>

            {!isProductsLoading && !filter.sortType && (<>
                <div className={classes.buttonsPagination}>
                    <MyButton onClick={handlePrevPage} disabled={currentPage === 1}>Предыдущая страница</MyButton>
                    <MyButton onClick={handleNextPage}>Следующая страница</MyButton>
                </div>
                <form>
                    <input
                      type="text"
                      placeholder='Введите нужную страницу'
                      onChange={handleChange}
                      value={inputValue}
                    />
                </form>
            </>)}
        </section>
    );
};

export default ProductList;