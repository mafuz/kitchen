import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ProductFilter.module.scss';
import {
  FILTER_BY_BRAND,
  FILTER_BY_CATEGORY,
  FILTER_BY_PRICE,
} from '../../../redux/features/product/filterSlice';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';



// const initialState = {
//   product: null,
//   products: [],
//   minPrice: null,
//   maxPrice: null,

// };

const ProductFilter = ({ products }) => {

  let minPrice = null;
   let  maxPrice = null;
  
  
  // const {  products, minPrice, maxPrice } = useSelector(
  //   (state) => state.product
  // );

  // const [{ loading, error, products, loadingCreateReview }, dispatch] =
  // useReducer(reducer, {
  //   products: [],
  //   reviews: '',
  //   item: [],
  //   loading: true,
  //   error: '',
  // });

  const array = [];
  // const [products, setProducts] = useState([]);

  const [category, setCategory] = useState('All');
  const [brand, setBrand] = useState('All');

  const dispatch = useDispatch();

  const [price, setPrice] = useState([50, 1500]);




  const allCategories = [
    'All',
    ...new Set(products?.map((product) => product.category)),
  ];
  const allBrands = [
    'All',
    ...new Set(products.map((product) => product.brand)),
  ];

  // useEffect(() => {
    // dispatch(GET_PRICE_RANGE({ products }));
   
    products.map((product) => {
      const price = product.price;
      
      return array.push(price);
    });
    
    let max = Math.max(...array);
    let min = Math.min(...array);

     minPrice = min;
     maxPrice = max;
  // }, [dispatch, products]);

  // let tempProducts = [];
  // tempProducts = 
  products.filter(
    (product) => product.price >= price[0] && product.price <= price[1]
  );
  //return tempProducts;

  useEffect(() => {
    dispatch(FILTER_BY_BRAND({ products, brand }));
  }, [dispatch, brand]);

  useEffect(() => {
    dispatch(FILTER_BY_PRICE({ products, price }));
    // console.log(price);
  }, [dispatch, price]);

  const filterProducts = (cat) => {
    setCategory(cat);
    dispatch(FILTER_BY_CATEGORY({ products, category: cat }));
  };

  const clearFilters = () => {
    setCategory('All');
    setBrand('All');
    setPrice([minPrice, maxPrice]);
  };
  //  console.log(minPrice, maxPrice)
  return (
    <div className={styles.filter}>
    {/* <pre>{JSON.stringify(minPrice)}</pre>
      <pre>{JSON.stringify(maxPrice, minPrice)}</pre> */}
      <h4>Categories</h4>
      <div className={styles.category}>
        {allCategories.map((cat, index) => {
          return (
            <button
              key={index}
              type="button"
              className={`${category}` === cat ? `${styles.active}` : null}
              onClick={() => filterProducts(cat)}
            >
              &#8250; {cat}
            </button>
          );
        })}
      </div>
      <h4>Brand</h4>
      <div className={styles.brand}>
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          {allBrands.map((brand, index) => {
            return (
              <option key={index} value={brand}>
                {brand}
              </option>
            );
          })}
        </select>
        <h4>Price</h4>
        {/* <Range /> */}

        <div className={styles.price}>
          <Slider
            range
            marks={{
              1: `${price[0]}`,
              100: `${price[1]}`,
            }}
            min={minPrice}
            max={maxPrice}
            defaultValue={[minPrice, maxPrice]}
            tipFormatter={(value) => `$${value}`}
            tipProps={{
              placement: "top",
              visible: true,
            }}
            value={price}
            onChange={(price) => setPrice(price)}
          />
        </div>
        <br />
        <br />
        <button className="--btn --btn-danger" onClick={clearFilters}>
          Clear Filter
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
