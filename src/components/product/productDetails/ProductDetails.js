import styles from './ProductDetails.module.scss';

import axios from 'axios';
import { toast } from 'react-toastify';

import Card from '../../card/Card';

import Loader, { Spinner } from '../../loader/Loader';

import DOMPurify from 'dompurify';

import { Store } from '../../../Store';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { calculateAverageRating, getCartQuantityById } from '../../../utils';
import ProductRating from '../productRating/ProductRating';
import ProductRatingSummary from '../productRating/productRatingSummary';
import StarRating from 'react-star-ratings';
import { getError } from '../../../screens/utils';

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
      return { ...state, product: action.payload, loading: false };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ProductDetails = (props) => {
  let reviewsRef = useRef();
  // const { product } = props;
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


    const url = process.env.REACT_APP_DEV_BASE_URL;

  const [imageIndex, setImageIndex] = useState(0);
  const [review, setReview] = useState('');
  //const [product, setProduct] = useState([]);
  const [star, setStar] = useState(0);
  //const [review, set] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  //   const [instocks, setInstock] = useState({});

  //   const ins = instocks[0];

  // const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  // const ids = Number(id);
  const prod = product[0];

  const slideLength = prod?.images?.length;
  const nextSlide = () => {
    setImageIndex(imageIndex === slideLength - 1 ? 0 : imageIndex + 1);
  };
  let slideInterval;
  useEffect(() => {
    if (prod?.images?.length > 1) {
      const auto = () => {
        slideInterval = setInterval(nextSlide, 3000);
      };
      auto();
    }
    return () => clearInterval(slideInterval);
  }, [imageIndex, slideInterval, product]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(
          `${url}/api/product/` + id
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

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    userInfo,
  } = state;

  //const cart = cartItems.find((cart) => cart._id === id);
  const { cart } = state;
  //const cartQuantity = 0;
  //const carts = cartItems[0];

  // const isCartAdded = cartItems.findIndex((carts) => {
  //   return carts.product_id === ids;
  // });

  //---taken out array count ----

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find(
      (x) => x.product_id === prod.product_id
    );
    const cartQuantity = existItem ? existItem.cartQuantity + 1 : 1;
    const { data } = await axios.get(
      `${url}/api/product/` + prod.product_id
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

  const date = new Date();
  const trans_date = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  const saveReviews = async (e) => {
     e.preventDefault();
    const ratings = [{
      
      star: star,
      review: review,
      name: userInfo.username,
     review_date: trans_date,
  }]
    try {
      dispatch({ type: 'UPDATE_REQUEST' });

      const { data } = await axios.put(
        `${url}/api/reviews/` + id,
        {
          ratings,
        },
        {
          headers: {
            authorization: 'Bearer ' + userInfo.token,
          },
        }
      );
     

      dispatch({ type: 'UPDATE_SUCCESS', payload: data });

      toast.success(data);
      //const id = data;
    } catch (err) {
      // dispatch({ type: 'VERRIFY_RESET' });
      toast.error(getError('Review Failed'));
    }

    // await dispatch(getUser());
  };



  const averageRating = calculateAverageRating(product[0]?.ratings);
  return (
    <section>
      <div className={`container ${styles.product}`}>
        {/* <pre>{JSON.stringify(carts.product_id)}</pre> */}
        <h2>Product Details</h2>
        <div>
          <Link to="/shop">&larr; Back To Products</Link>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {product?.map((prod) => {
              return (
                <div key={prod?.product_id} className={styles.details}>
                  <div className={styles.img}>
                    <img
                      src={prod?.images[imageIndex]}
                      alt={prod?.p_name}
                      className={styles.pImg}
                    />
                    <div className={styles.smallImg}>
                      {prod?.images.map((img, index) => {
                        return (
                          <img
                            key={index}
                            src={img}
                            alt={'prod'}
                            onClick={() => setImageIndex(index)}
                            className={imageIndex === index ? 'activeImg' : ''}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className={styles.content}>
                    <h3>{prod?.p_name}</h3>

                    <ProductRating
                      averageRating={averageRating}
                      noOfRatings={prod?.ratings?.length}
                    />
                    <div className="--underline"></div>
                    <div className={styles.property}>
                      <p>
                        <b>Price:</b>
                      </p>
                      <p className={styles.price}>{`GHS${prod?.price}`}</p>
                    </div>
                    <div className={styles.property}>
                      <p>
                        <b>SKU:</b>
                      </p>
                      <p>{prod?.sku}</p>
                    </div>
                    <div className={styles.property}>
                      <p>
                        <b>Category: </b>
                      </p>
                      <p>{prod?.category}</p>
                    </div>
                    <div className={styles.property}>
                      <p>
                        <b>Brand: </b>
                      </p>
                      <p>{prod?.brand}</p>
                    </div>
                    <div className={styles.property}>
                      <p>
                        <b>Color: </b>
                      </p>
                      <p>{prod?.color}</p>
                    </div>
                    <div className={styles.property}>
                      <p>
                        <b>Quantity in stock: </b>
                      </p>
                      {/* <p>{prod?.quantity}</p> */}
                      <p>{prod?.quantity === null ? 0 : prod?.quantity}</p>
                    </div>
                    <div className={styles.property}>
                      <p>
                        <b>Sold: </b>
                      </p>
                      <p>{prod?.sold === null ? 0 : prod?.sold}</p>
                    </div>

                    {/* <div className={styles.count}>
                        {isCartAdded < 0 ? null : (  
                        <>
                       
                          <button className="--btn"  

onClick={() =>
  updateCartHandler(item, item?.cartQuantity - 1)
}
                            >
                            -
                          </button>
                        
                          <p>
                            <b>{carts?.cartQuantity}</b>
                          </p>
                         
                          <button className="--btn" onClick={() =>
updateCartHandler(item, item?.cartQuantity + 1)
}>
                            +
                          </button>
                        
                        </>
                        )}    
                    </div> */}

                    <div className="--flex-start">
                      {prod?.quantity > 0 ? (
                        <button
                          className="--btn --btn-primary"
                          onClick={addToCartHandler}
                        >
                          ADD TO CART
                        </button>
                      ) : (
                        <button
                          className="--btn --btn-red"
                          onClick={() =>
                            toast.error('Sorry, Product is out of stock')
                          }
                        >
                          Out Of Stock
                        </button>
                      )}
                      <button
                        className="--btn --btn-danger"
                        // onClick={() => addWishlist(prodt)}
                      >
                        ADD TO WISHLIST
                      </button>
                    </div>
                    <div className="--underline"></div>
                    <p>
                      <b>Product Description:</b>
                    </p>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(prod?.description),
                      }}
                    ></div>
                    <div className="--underline"></div>
                  </div>
                </div>
              );
            })}
          </>
        )}
           <Card cardClass={'card'}>
        {/* <pre>{JSON.stringify(product)}</pre> */}
         <div>
         <form onSubmit={saveReviews}>
          <h2>Write a customer review</h2> 
         <div >
           
            <label className='form-group label'>Select Rating</label>
            <select
              aria-label="Star"
              value={star}
              onChange={(e) => setStar(parseInt(e.target.value, 0))}
            >
              <option value="">Select...</option>
              <option value="1">1- Poor</option>
              <option value="2">2- Fair</option>
              <option value="3">3- Good</option>
              <option value="4">4- Very good</option>
              <option value="5">5- Excelent</option>
            </select> 
         </div> 
         
         <label className='form-group label'>Leave a comment here</label>
              <ReactQuill
                theme="snow"
                value={review}
                 onChange={setReview}
                 modules={ProductDetails.modules}
                 formats={ProductDetails.formats}
              />

          <div className="mb-3">
            <button className="--btn --btn-primary mt-3"  type="submit">
              Submit
            </button>
            {/* {loadingCreateReview && <Loader></Loader>} */}
          </div>
        </form>
          </div>  
        </Card> 
        <Card cardClass={styles.card}>
        {/* <pre>{JSON.stringify(product)}</pre>  */}
        {product !== null && product[0]?.ratings?.length > 0 && (
          <h3>Product Reviews</h3>
          )}  
          <ProductRating
            averageRating={averageRating}
            noOfRatings={product[0]?.ratings?.length}
          /> 
          <div className="--underline"></div>
           <div className={styles?.ratings}>
           {product !== null && product[0]?.ratings?.length > 0 && (
              <ProductRatingSummary ratings={product[0]?.ratings} />
            )}  

            <div className="--m">
               {product[0]?.ratings?.length === 0 ? (
                <p>There are no reviews for this product yet.</p>
              ) : (
                <>
                  {product[0]?.ratings?.map((item, index) => {
                    const { star, review, review_date, name, user_id } = item;
                    const result = review.substring(3, review.length-4);
                    return (
                      <div key={index} className={styles.review}> 
                         <StarRating
                          starDimension="20px"
                          starSpacing="2px"
                          starRatedColor="#F6B01E"
                          rating={star}
                          editing={false}
                        /> 
                        <p>{result}</p>
                        <span>
                          <b>{review_date}</b>
                        </span>
                        <br />
                        <span>
                          <b>by: {name}</b>
                        </span>
                      </div>
                    );
                  })}  
                </>
              )}
            </div>
          </div>  
        </Card>
      </div>
    </section>
  );
};


ProductDetails.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
};
ProductDetails.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "video",
  "image",
  "code-block",
  "align",
];


export default ProductDetails;
