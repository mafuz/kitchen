import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import styles from './PlaceOrder.module.scss';

//import CheckoutSteps from '../components/CheckoutSteps';

import Loader from '../../components/loader/Loader';
import { Store } from '../../Store';
import { getError } from '../utils';

import Card from '../../components/card/Card';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };

    default:
      return state;
  }
};

function PlaceOrder() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    cart: { cartItems, shippingAddress, paymentMethod },
    userInfo,
    couponItem,
  } = state;

  const url = process.env.REACT_APP_DEV_BASE_URL;

  const unique_id = Date.now();

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  const shippingPrice = itemsPrice > 100 ? round2(0) : round2(5);
  const taxPrice = round2(0.0 * itemsPrice);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  let myitems = [];
  myitems = cartItems;

  // const showdate = new Date();
  // const date =
  //   showdate.getDate() +
  //   '-' +
  //   showdate.getMonth() +
  //   '-' +
  //   showdate.getFullYear();

  //const url = "https://automation-app.onrender.com"
  //http://localhost:4000

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await axios.post(
        `${url}/api/orders`,
        {
          orderitems: myitems,
          shippingaddress: shippingAddress,
          paymentmethod: paymentMethod,
          itemsprice: itemsPrice,
          shippingprice: shippingPrice,
          taxprice: taxPrice,
          totalprice: totalPrice,
          ispaid: 'false',
          isdelivered: 'false',
          users: userInfo.id,
        },
        {
          headers: {
            authorization: 'Bearer ' + userInfo.token,
          },
        }
      );
      
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });

      localStorage.removeItem('cartItems');
      toast.success('Order send successfully');
      const id = data;
     
      // navigate(`/checkout-success`);
      //navigate(`/order/${id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError('Oder Placement Failed'));
    }
  };
  useEffect(() => {
    if (!paymentMethod) {
      navigate('/payment');
    }
  }, [paymentMethod, navigate]);

 
  return (
    <section>
      <div className={`container ${styles.checkout}`}>
        {/* <pre>{JSON.stringify(cartItems)}</pre> */}

        <h2>Checkout Details</h2>

        <form onSubmit={placeOrderHandler}>
          {/* <div>
          <Card cardClass={styles.card}><CheckoutSummary /> </Card>
        </div> */}
          <div>
            <Card cardClass={styles.card}>
              <h3>Shipping Address</h3>

              <label>Recipient Name</label>
              <input
                type="text"
                placeholder="Recipient Name"
                required
                name="name"
                value={shippingAddress?.name}
              />
              <label>Address line 1</label>
              <input
                type="text"
                placeholder="Address line 1"
                required
                name="line1"
                value={shippingAddress?.line1}
              />
              <label>Address line 2</label>
              <input
                type="text"
                placeholder="Address line 2"
                name="line2"
                value={shippingAddress?.line2}
              />
              <label>City</label>
              <input
                type="text"
                placeholder="City"
                required
                name="city"
                value={shippingAddress?.city}
              />
              <label>State</label>
              <input
                type="text"
                placeholder="State"
                required
                name="states"
                value={shippingAddress?.states}
              />
              <label>Postal code</label>
              <input
                type="text"
                placeholder="Postal code"
                required
                name="postal_code"
                value={shippingAddress?.postal_code}
              />

              <label>Phone</label>
              <input
                type="text"
                placeholder="Phone"
                required
                name="phone"
                value={shippingAddress?.phone}
              />
              <button type="submit" className="--btn --btn-primary">
                Proceed To Checkout
              </button>
            </Card>
          </div>
        </form>
      </div>
    </section>
  );
}

export default PlaceOrder;
