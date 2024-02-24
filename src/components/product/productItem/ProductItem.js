import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import styles from './ProductItem.module.scss';
import Card from '../../card/Card';
import {
  calculateAverageRating,
  getCartQuantityById,
  shortenText,
} from '../../../utils';
import axios from 'axios';
import DOMPurify from 'dompurify';
import ProductRating from '../productRating/ProductRating';
import { toast } from 'react-toastify';
import { Store } from '../../../Store';


const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
      
      case 'UPDATE_REQUEST':
        return { ...state, loadingCreateReview: true };
      case 'UPDATE_SUCCESS':
        return { ...state, reviews: action.payload, loadingCreateReview: false };
      case 'UPDATEE_FAIL':
        return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, prodt: action.payload, loading: false };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ProductItem = ({
  product,
  grid,
  product_id,
  p_name,
  price,
  description,
  images,
  regular_price,
  ratings,
}) => {
 
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : ``;

 

  const [{ loading, error, prodt, loadingCreateReview }, dispatch] =
  useReducer(reducer, {
    prodt: [],
    reviews: '',
    item: [],
    loading: true,
    error: '',
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    userInfo,
  } = state;

  const url = process.env.REACT_APP_DEV_BASE_URL;

  const { cart } = state;
  const params = useParams();
  const { id } = params;
  const prod = product[0];
  
//console.log(product_id);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(
          `${url}/api/product/` + product_id
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        // console.log(result.data);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }

      //setProducts(result.data);
    };
    fetchData();
  }, []);



  const addToCartHandler = async () => {
    const existItem = cart?.cartItems?.find(
      (x) => x.product_id === product_id
    );
    const cartQuantity = existItem ? existItem?.cartQuantity + 1 : 1;
    const { data } = await axios.get(
      `${url}/api/product/` + product_id
    );
    // if (ins?.instock < quantity) {
    //   window.alert('Sorry. Product is out of stock');
    //   return;
    // }

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, cartQuantity },
    });
    navigate('/cart');
  };
  
  const averageRating = calculateAverageRating(product?.ratings);

  return (
    <Card cardClass={grid ? `${styles.grid}` : `${styles.list}`}>
       {/* <pre>{JSON.stringify(product)}</pre>  */}
      <Link to={`/product-details/${product_id}`}>
        <div className={styles.img}>
          <img src={images[0]} alt={p_name} />
        </div>
      </Link>
      <div className={styles.content}>
        <div className={styles.details}>
          <p>
            <span>{regular_price > 0 && <del>GHS{regular_price}</del>}</span>
            {` GHS${price} `}
          </p>
          {/* Rating */}
          <ProductRating
            averageRating={averageRating}
            noOfRatings={product?.ratings?.length}
          />
          <h4>{shortenText(p_name, 18)}</h4>
        </div>
        {!grid && (
          // <p className={styles.desc}>{shortenText(description, 200)}</p>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                shortenText(product?.description, 200)
              ),
            }}
          ></div>
        )}

        {product?.quantity > 0 ? (
          <button
            className="--btn --btn-primary"
            onClick={addToCartHandler}
          >
            Add To Cart
          </button>
        ) : (
          <button
            className="--btn --btn-red"
            onClick={() => toast.error('Sorry, Product is out of stock')}
          >
            Out Of Stock
          </button>
        )}
      </div>
    </Card>
  );
};

export default ProductItem;
