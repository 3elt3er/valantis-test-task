import {useEffect, useMemo, useState} from 'react';
import ProductItem from "../ProductItem/ProductItem.jsx";
import ServiceAPI from "../../API/ServiceAPI.js";
import classes from "./ProductList.module.css";
import ProductFilter from "../ProductFilter/ProductFilter.jsx";
import MyButton from "../UI/button/MyButton.jsx";
import MyInput from "../UI/input/MyInput.jsx";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [inputValue, setInputValue] = useState('')
    const [filter, setFilter] = useState({sortType: '', value: ''})

    const LIMIT_PER_PAGE = 50;
    const MAX_RETRIES = 10;

    const filterUniqueItems = (items) => {
        return items.filter((item, index, self) => self.findIndex(t => t.id === item.id) === index);
    };

    useEffect(() => {
        const fetchData = async (retries = 0) => {
            try {
                setIsLoading(true);
                let offset;
                let limit;

                if (currentPage === 1) {
                    offset = 0;
                    limit = 47;
                } else {
                    offset = (currentPage - 2) * LIMIT_PER_PAGE + 47;
                    limit = LIMIT_PER_PAGE;
                }

                const ids = await ServiceAPI.getIds(offset, limit);
                const items = await ServiceAPI.getItems(ids);
                const uniqueItems = filterUniqueItems(items);

                if (uniqueItems.length < 50) {
                    const additionalOffset = (50 - uniqueItems.length) * (currentPage - 1);
                    const additionalIds = await ServiceAPI.getIds(additionalOffset, 50 - uniqueItems.length);
                    const additionalItems = await ServiceAPI.getItems(additionalIds);
                    const additionalUniqueItems = additionalItems.filter((item, index, self) => self.findIndex(t => t.id === item.id) === index);
                    setProducts([...uniqueItems, ...additionalUniqueItems]);
                } else {
                    setProducts(uniqueItems);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Ошибка при получении товаров:', error);
                if (retries < MAX_RETRIES) {
                    console.log(`Попытка №${retries + 1}...`);
                    fetchData(retries + 1);
                } else {
                    console.error('Достигнуто максимальное количество попыток');
                    setIsLoading(false);
                }
            }
        };
        fetchData();
    }, [currentPage]);


    const fetchDataFiltered = async (field, value, retries = 0) => {
        try {
            if (field) {
                setIsLoading(true);
                let numericValue;
                if (field === 'price') {
                    numericValue = Number(value)
                } else {
                    numericValue = String(value);
                }

                const ids = await ServiceAPI.filterProducts(field, numericValue);
                const items = await ServiceAPI.getItems(ids);
                const uniqueItems = filterUniqueItems(items);

                setProducts(uniqueItems);
                setIsLoading(false);
                setInputValue('1');
            } else {
                alert('Выберите метод сортировки')
            }

        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            if (retries < MAX_RETRIES) {
                console.log(`Попытка №${retries + 1}...`);
                fetchDataFiltered(field, value, retries + 1);
            } else {
                console.error('Достигнуто максимальное количество попыток');
                setIsLoading(false);
            }
        }
    };


    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1)
        setInputValue(currentPage - 1)
    }
    const handleNextPage = () => {
        setCurrentPage(currentPage + 1)
        setInputValue(currentPage + 1)
    }

    const handleChange = (event) => {
        setInputValue(event.target.value)
        if (event.target.value > 0) {
            setTimeout(() => {
                setCurrentPage(event.target.value === '' ? 1 : Number(event.target.value))
            }, 2000)
        }
    }

    const memoizedProductFilter = useMemo(() => (
        <ProductFilter filter={filter} setFilter={setFilter} />
    ), [filter, setFilter]);

    const memoizedButton = useMemo(() => (
        <MyButton onClick={() => fetchDataFiltered(filter.sortType, filter.value)}>Отфильтровать</MyButton>
        ), [filter]);
    return (
        <section className={classes.container}>
            {memoizedProductFilter}
            <div className={classes.filterButton}>
                {memoizedButton}
            </div>
            <div className={classes.gridLayout}>
                {isLoading
                  ? <h1>Идет загрузка...</h1>
                  : products.length ?
                    products.map((item, index) =>
                      <ProductItem key={index} item={item}/>
                    ) : <h1>Товары не найдены!</h1>
                }
            </div>
            <h1>Текущая страница: {currentPage}</h1>

            {!isLoading && !filter.sortType && (<>
                <div className={classes.buttonsPagination}>
                    <MyButton onClick={handlePrevPage} disabled={currentPage === 1}>Предыдущая страница</MyButton>
                    <MyButton onClick={handleNextPage}>Следующая страница</MyButton>
                </div>
                <form>
                    <MyInput
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