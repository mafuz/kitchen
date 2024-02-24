import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import "./Carousel.scss";
import axios from 'axios';
import {shortenText} from "../../utils"
import { toast } from 'react-toastify';
import { Store } from '../../Store';


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export function CarouselItem({url, product_id, name, price, description, quantity}) {

  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : ``;

 

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
  useReducer(reducer, {
    product: [],
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

  const burl = process.env.REACT_APP_DEV_BASE_URL;

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
          `${burl}/api/product/` + product_id
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
      (x) => x.product_id === prod?.product_id
    );
    const cartQuantity = existItem ? existItem?.cartQuantity + 1 : 1;
    const { data } = await axios.get(
      `${burl}/api/product/` + prod?.product_id
    );
    // if (ins?.instock < quantity) {
    //   window.alert('Sorry. Product is out of stock');
    //   return;
    // }

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...prod, cartQuantity },
    });
    navigate('/cart');
  };
  
  return (
    <div className="carouselItem">
      {/* <pre>{JSON.stringify(prod)}</pre> */}
     <Link to={`/product-details/${product_id}`} style={{ textDecoration: 'none' }}>
      <img className="product--image" src={url} alt="product"/>
      <p className="price" >
        {`GHS${price}`}
      </p>
      <h4>{shortenText(name, 18)}</h4>
      <p className='--mb'>{shortenText(description, 26)}</p>
     </Link>
     {/* <button className="--btn --btn-primary --btn-block">Add To Cart</button> */}
     {quantity > 0 ? (
          <button
          className="--btn --btn-primary --btn-block"
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
  )
}

export default CarouselItem