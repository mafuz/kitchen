import axios from "axios";

//const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

//const API_URL = `${BACKEND_URL}/api/products/`;

// Create New Product
// const createProduct = async (formData) => {
//   const response = await axios.post(API_URL, formData);
//   return response.data;
// };

// Get all products
const getProducts = async () => {
  const response = await axios.get("http://localhost:4000/api/products");
  return response.data;
};

// Delete a Product
// const deleteProduct = async (id) => {
//   const response = await axios.delete(API_URL + id);
//   return response.data;
// };
// // Get a Product
// const getProduct = async (id) => {
//   const response = await axios.get(API_URL + id);
//   return response.data;
// };
// // Update Product
// const updateProduct = async (id, formData) => {
//   const response = await axios.patch(`${API_URL}${id}`, formData);
//   return response.data;
// };

// // Review Product
// const reviewProduct = async (id, formData) => {
//   const response = await axios.patch(`${API_URL}review/${id}`, formData);
//   return response.data.message;
// };

// // Review Product
// const deleteReview = async (id, formData) => {
//   const response = await axios.patch(`${API_URL}deleteReview/${id}`, formData);
//   return response.data.message;
// };

// // Review Product
// const updateReview = async (id, formData) => {
//   const response = await axios.patch(`${API_URL}updateReview/${id}`, formData);
//   return response.data.message;
// };

const productService = {
  // createProduct,
  getProducts,
  // getProduct,
  // deleteProduct,
  // updateProduct,
  // reviewProduct,
  // deleteReview,
  // updateReview,
};

export default productService;



// import React, {
//   useContext,
//   useEffect,
//   useReducer,
//   useRef,
//   useState,
// } from 'react';

// import { getError } from '../../../screens/utils';

// import axios from 'axios';
// import { toast } from 'react-toastify';

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'REFRESH_PRODUCT':
//       return { ...state, products: action.payload };
//     case 'CREATE_REQUEST':
//       return { ...state, loadingCreateReview: true };
//     case 'CREATE_SUCCESS':
//       return { ...state, loadingCreateReview: false };
//     case 'CREATE_FAIL':
//       return { ...state, loadingCreateReview: false };
//     case 'FETCH_REQUEST':
//       return { ...state, loading: true };
//     case 'FETCH_SUCCESS':
//       return { ...state, products: action.payload, loading: false };
//     case 'FETCH_FAIL':
//       return { ...state, loading: false, error: action.payload };
//     default:
//       return state;
//   }
// };

// function ProductService() {

//   const [{ error, products }, dispatch] = useReducer(reducer, {
//   products: [],

//   loading: true,
//   error: '',
// });
// // Get all products
// const getProducts = async () => {
//   try {
//     const { data } = await axios.get(`http://localhost:4000/api/products`);
//     dispatch({ type: 'FETCH_SUCCESS', payload: data });
//   } catch (err) {
//     //console.log(err);
//     toast.error(getError(error));
//   }
// };
// useEffect(() => {
//   getProducts();
// }, [products]);
//   return (
//     <div>productService</div>
//   )
// }

// export default ProductService


