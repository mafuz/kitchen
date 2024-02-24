import React, { useEffect, useState, useReducer } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from "./Product.module.scss";
import { FaCogs } from "react-icons/fa";
import { getError } from "../utils";
import Loader from "../../components/loader/Loader";
import ProductList from "../../components/product/productList/ProductList";
import ProductFilter from "../../components/product/productFilter/ProductFilter";
// import ProductSlice from '../../../redux/features/product/productSlice'

// import {
//   GET_PRICE_RANGE,
//   getProducts,
//   selectIsLoading,
//   selectProducts,
// } from "../../redux/features/product/productSlice";
// import { Spinner } from "../../components/loader/Loader";
// import ProductList from "../../components/product/productList/ProductList";
// import ProductFilter from "../../components/product/productFilter/ProductFilter";

const reducer = (state, action) => {
    switch (action.type) {
      case 'REFRESH_PRODUCT':
        return { ...state, products: action.payload };
      case 'CREATE_REQUEST':
        return { ...state, loadingCreateReview: true };
      case 'CREATE_SUCCESS':
        return { ...state, loadingCreateReview: false };
      case 'CREATE_FAIL':
        return { ...state, loadingCreateReview: false };
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return { ...state, products: action.payload, loading: false };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };


function Shop() {

    const [{ loading, error, products }, dispatch] = useReducer(reducer, {
        products: [],
    
        loading: true,
        error: '',
      });

      const url = process.env.REACT_APP_DEV_BASE_URL;

      const [showFilter, setShowFilter] = useState(false);
    // const isLoading = useSelector(selectIsLoading);
    localStorage.removeItem('couponItem');
    const fetchProducts = async () => {
        try {
          const { data } = await axios.get(`${url}/api/products`
          );
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (err) {
          //console.log(err);
          toast.error(getError(error));
        }
      };
      useEffect(() => {
        fetchProducts();
      }, []);
    
    const toggleFilter = () => {
      setShowFilter(!showFilter);
    };
  
    return (
      <section>
        <div className={`container ${styles.product}`}>
          <aside
            className={
              showFilter ? `${styles.filter} ${styles.show}` : `${styles.filter}`
            }
          >
            {loading ? null : <ProductFilter products={products} />} 
          </aside>
          <div className={styles.content}>
             {loading ? <Loader /> : <ProductList products={products} />} 
             <div className={styles.icon} onClick={toggleFilter}>
            <FaCogs size={20} color="orangered" />
            <p>
              <b>{showFilter ? "Hide Filter" : "Show Filter"}</b>
            </p>
          </div>
          </div>
        </div>
      </section>
    );
  };
  
export default Shop