import React, { useState, useContext, useReducer, useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import './Radio.scss';
import styles from './Cart.module.scss';
import Card from '../../components/card/Card';
import { FaTrashAlt } from 'react-icons/fa';

import axios from 'axios';
import { Store } from '../../Store';
import Loader from '../../components/loader/Loader';
import './VerifyCoupon.scss';
import { getError } from '../utils';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function Cart() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state;
  const url = process.env.REACT_APP_DEV_BASE_URL;
  const { userInfo } = state;

  // const [paymentMethodName, setPaymentMethod] = useState(
  //   paymentMethod || 'Cash'
  // );

  let [loading, setLoading] = useState(false);

  const [couponName, setCouponName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [paymentMethodName, setPaymentMethod] = useState('');

  const initialCartTotalAmount = cartItems
    ?.reduce((a, c) => a + c.price * c.cartQuantity, 0)
    .toFixed(2);
  let discountPercentage = null;
  if (coupon != null) {
    discountPercentage = coupon[0]?.discount;
  }
  const discountAmount = (discountPercentage / 100) * initialCartTotalAmount;
  const updatedTotal = initialCartTotalAmount - discountAmount;

  const clearCart = async () => {
     ctxDispatch({ type: 'CART_CLEAR' });
    localStorage.removeItem('cartItems');
  };

  // useEffect(() => {
  const verifyCoupon = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${url}/api/coupon/` + couponName
      );

      setCoupon(data);
      localStorage.setItem('couponItem', JSON.stringify(data));
      //localStorage.setItem('couponItem', JSON.stringify(data));
      // console.log(JSON.stringify(data));
      toast.success('Coupon fetch Successful');

      setLoading(false);
    } catch (err) {
      toast.error(getError(err));

      setLoading(false);
    }
  };
  // }, [ctxDispatch]);

  const removeCoupon = async () => {
    setCoupon(null);
    localStorage.removeItem('couponItem');

  };



  const updateCartHandler = async (item, cartQuantity) => {
    const { data } = await axios.get(
      `${url}/api/product/` + item.product_id
    );
    if (data.quantity < cartQuantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, cartQuantity },
    });
  };
  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const CartDiscount = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
      cart: { cartItems },

      userInfo,
    } = state;

    const [{ error, loadingCreateReview }, dispatch] = useReducer(reducer, {
      loading: true,
      error: '',
    });

    let [loading, setLoading] = useState(false);

    const initialCartTotalAmount = cartItems.reduce(
      (a, c) => a + c.price * c.cartQuantity,
      0
    );
  


    return (
      <>
        {coupon != null && (
          <Card cardClass={'coupon-msg'}>
            <p className="--center-all">
              Initial Total: GHS{initialCartTotalAmount} | Coupon:{' '}
              {coupon[0]?.name} | Discount: {coupon[0]?.discount}%
            </p>
          </Card>
        )}
      </>
    );
  };

  function refreshPage() {
    window.location.reload(false);
  }
  const setPayment = (e) => {
    e.preventDefault();
    if (paymentMethodName === '') {
      return toast.error('Please select a payment method');
    }
    //console.log(paymentMethodName);
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);

    ctxDispatch({ type: 'SAVE_PAYMENT_COUPON', payload: discountAmount });
    localStorage.setItem('paymentCoupon', discountAmount);

    //ctxDispatch({ type: 'SAVE_COUPON_ITEM', payload: coupon });

    // localStorage.setItem('couponItem', JSON.stringify(coupon));

    //navigate('/checkout-details');
    

    if (!userInfo?.token) {
      navigate('/login?redirect=/cart');
    } else {
      navigate('/shipping');
      refreshPage();
    }
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };


  return (
    <section>
      <div className={`container ${styles.table}`}>
        {/* <pre>{JSON.stringify(coupon)}</pre>  */}
        <h2>Shopping Cart</h2>
        {loading && <Loader />}
        {cartItems?.length === 0 ? (
          <>
            <p>Your cart is currently empty.</p>
            <br />
            <div>
              <Link to="/shop">&larr; Continue shopping</Link>
            </div>
          </>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems?.map((item, index) => {
                  //const { product_id, p_name, price, images, cartQuantity } = cart.cartitems;
                  //console.log(cart);
                  return (
                    <tr key={item?.product_id}>
                      <td>{index + 1}</td>
                      <td>
                        <p>
                          <b>{item?.p_name}</b>
                        </p>
                        <img
                          src={item?.images[0]}
                          alt={item?.p_name}
                          style={{ width: '100px' }}
                        />
                      </td>
                      <td>{item?.price}</td>
                      <td>
                        <div className={styles.count}>
                          <button
                            className="--btn"
                            disabled={item.cartQuantity === 1}
                            onClick={() =>
                              updateCartHandler(item, item?.cartQuantity - 1)
                            }
                          >
                            -
                          </button>
                          <p>
                            <b>{item?.cartQuantity}</b>
                          </p>
                          <button
                            className="--btn"
                            onClick={() =>
                              updateCartHandler(item, item?.cartQuantity + 1)
                            }
                            disabled={item.cartQuantity === item.quantity}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>{(item?.price * item?.cartQuantity).toFixed(2)}</td>
                      <td className={styles.icons}>
                        <FaTrashAlt
                          size={19}
                          color="red"
                          onClick={() => removeItemHandler(item)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className={styles.summary}>
              <button  onClick={clearCart} className="--btn --btn-danger">Clear Cart</button>
              <div className={styles.checkout}>
                <div>
                  <Link to="/shop">&larr; Continue shopping</Link>
                </div>
                <br />
                <Card cardClass={styles.card}>
                  <p>
                    <b>{`Cart item(s): ${cartItems.reduce(
                      (a, c) => a + c.cartQuantity,
                      0
                    )}`}</b>
                  </p>
                  <div className={styles.text}>
                    <h4>Subtotal:</h4>
                    <h3>
                      {coupon !== null
                        ? updatedTotal?.toFixed(2)
                        : initialCartTotalAmount}{' '}
                    </h3>
                  </div>
                  <>
                    <CartDiscount />

                    <div className="--flex-between">
                      {/* <pre>{JSON.stringify(coupon)}</pre> */}
                      <p>Have a coupon?</p>
                      {coupon === null ? (
                        <p
                          className="--cursor --color-primary"
                          onClick={() => setShowForm(true)}
                        >
                          <b>Add Coupon</b>
                        </p>
                      ) : (
                        <p
                          className="--cursor --color-danger"
                          onClick={removeCoupon}
                        >
                          <b>Remove Coupon</b>
                        </p>
                      )}
                    </div>
                    {showForm && (
                      <form
                        onSubmit={verifyCoupon}
                        className="coupon-form --form-control"
                      >
                        <input
                          type="text"
                          placeholder="Coupon name"
                          name="name"
                          value={couponName}
                          onChange={(e) =>
                            setCouponName(e.target.value.toUpperCase())
                          }
                          required
                        />
                        <button type="submit" className="--btn --btn-primary">
                          Verify
                        </button>
                      </form>
                    )}
                  </>
                  <div className="--underline --mb"></div>
                 
                  <form className="--form-control" onSubmit={setPayment}>
                    
                    <button
                      type="submit"
                      className="--btn --btn-primary --btn-block"
                      onClick={checkoutHandler}
                    >
                     Proceed to Checkout
                    </button>
                   
                  </form> 
                  <p>Tax an shipping calculated at checkout</p>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Cart;
