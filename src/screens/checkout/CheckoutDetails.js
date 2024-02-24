import { useEffect, useState, useContext, useReducer } from 'react';
import { CountryDropdown } from 'react-country-region-selector';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import Card from '../../components/card/Card';
import { Link } from 'react-router-dom';
import styles from './CheckoutDetails.module.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Store } from '../../Store';
import { getError } from '../utils';
import dateFormat from 'dateformat';

const initialAddressState = {
  name: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  phone: '',
  bname: '',
  bline1: '',
  bline2: '',
  bcity: '',
  bstate: '',
  bpostal_code: '',
  bcountry: '',
  bphone: '',

};

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };

    case 'UPDATE_REQUEST':
      return { ...state, loading: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loading: false };
    case 'UPDATE_FAIL':
      return { ...state, loading: false };

    case 'FETCH_SUCCESS':
      return { ...state, loading: false };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const CheckoutDetails = () => {
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : `/checkout-details`;

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
  });
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    fullBox,
    loginInfo,
    userInfo,
    cart: { shippingAddress, billingAddress, paymentMethod },
  } = state;

  const url = process.env.REACT_APP_DEV_BASE_URL;

  const [name, setName] = useState(shippingAddress.name || '');
  const [line1, setLine1] = useState(shippingAddress.line1 || '');
  const [line2, setLine2] = useState(shippingAddress.line2 || '');
  const [phone, setPhone] = useState(shippingAddress.phone || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [states, setState] = useState(shippingAddress.state || '');
  const [postal_code, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');
  console.log(country);

  const [bname, setBname] = useState(billingAddress.bname || '');
  const [bline1, setBline1] = useState(billingAddress.bline1 || '');
  const [bline2, setBline2] = useState(billingAddress.bline2 || '');
  const [bphone, setBphone] = useState(billingAddress.bphone || '');
  const [bcity, setBcity] = useState(billingAddress.bcity || '');
  const [bstates, setBstates] = useState(billingAddress.bstate || '');
  const [bpostal_code, setBpostalCode] = useState(
    billingAddress.bpostalCode || ''
  );
  const [bcountry, setBcountry] = useState(billingAddress.bcountry || '');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        name,
        line1,
        line2,
        states,
        phone,
        city,
        postal_code,
        country,
        // location: shippingAddress.location,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        name,
        line1,
        line2,
        states,
        phone,
        city,
        postal_code,
        country,
        // location: shippingAddress.location,
      })
    );
    ctxDispatch({
      type: 'SAVE_BILLING_ADDRESS',
      payload: {
        bname,
        bline1,
        bline2,
        bstates,
        bphone,
        bcity,
        bpostal_code,
        bcountry,
        // location: shippingAddress.location,
      },
    });
    localStorage.setItem(
      'billingAddress',
      JSON.stringify({
        bname,
        bline1,
        bline2,
        bstates,
        bphone,
        bcity,
        bpostal_code,
        bcountry,
        // location: shippingAddress.location,
      })
    );
    //   dispatch(SAVE_SHIPPING_ADDRESS(shippingAddress));
    //   dispatch(SAVE_BILLING_ADDRESS(billingAddress));
    // if (paymentMethod === "") {
    //   toast.info("Please select a payment method!!!")
    //   navigate("/cart");
    // }
    if (paymentMethod === 'cash') {
      window.location.href = redirect || '/checkout-details';
      //navigate('/checkout-details');
    }
    //   if (paymentMethod === "flutterwave") {
    //     navigate("/checkout-flutterwave");
    //   }
    //   if (paymentMethod === "paystuck") {
    //     navigate("/checkout-paystuck");
    //   }
    //   if (paymentMethod === "wallet") {
    //     navigate("/checkout-wallet");
    //   }
    //return toast.error("No payment method selected");
  };
 
  //  window.onload = function() {
  //   if(!window.location.hash) {
  //   window.location = window.location;
  //     window.location.reload();
  //    }
  // }
  const CheckoutSummary = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
      cart: { cartItems, paymentMethod },
    } = state;
    const { couponItem } = state;

    //console.log(couponItem);
    // const coupon = couponItem?.replace(/[\[\]']/g,'');

    // const coupon = couponItem.substring(1, couponItem.length-1);

    //const cartTotalAmount = initialCartTotalAmount - paymentCoupon;

    const initialCartTotalAmount = cartItems
      ?.reduce((a, c) => a + c.price * c.cartQuantity, 0)
      .toFixed(2);
    let discountPercentage = null;
    let discountName = null;
    if (couponItem !== null) {
      discountPercentage = parseInt(couponItem[0]?.discount);
      discountName = couponItem[0]?.name;
    }
    const discountAmount = (discountPercentage / 100) * initialCartTotalAmount;
    const updatedTotal = initialCartTotalAmount - discountAmount;

    const unique_id = Date.now();

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
    const itemsPrice = round2(
      cartItems.reduce((a, c) => a + c.cartQuantity * c.price, 0)
    );
    const shippingPrice = updatedTotal > 100 ? round2(0) : round2(5);
    const taxPrice = round2(0.0 * updatedTotal);
    const totalPrice = updatedTotal + shippingPrice + taxPrice;
    const myitems = JSON.stringify(cartItems);
    let productItems = {};
    let productItems1 = {};
    let productItems2 = {};
    let productItems3 = {};
    productItems = cartItems[0];
    productItems1 = cartItems[1];
    productItems2 = cartItems[2];
    productItems3 = cartItems[3];

    // const showdate = new Date();
    // const date =
    //   showdate.getDate() +
    //   '-' +
    //   showdate.getMonth() +
    //   '-' +
    //   showdate.getFullYear();

    
  // const date = dateFormat(created_at, "dd-mm-yy")

    const CartDiscount = () => {
      const { state, dispatch: ctxDispatch } = useContext(Store);
      const {
        cart: { cartItems },
      } = state;

      const [{ error, loadingCreateReview }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
      });

      let [loading, setLoading] = useState(false);

    


      // const initialCartTotalAmount = cartItems.reduce(
      //   (a, c) => a + c.price * c.cartQuantity,
      //   0
      // );

      return (
        <>
          {couponItem != null && (
            <Card cardClass={'coupon-msg'}>
              <p className="--center-all">
                Initial Total: GHS{initialCartTotalAmount} | Coupon:{' '}
                {couponItem[0]?.name} | Discount: {couponItem[0]?.discount}%
              </p>
            </Card>
          )}
        </>
      );
    };

    const placeOrderHandler = async () => {
      try {
        dispatch({ type: 'CREATE_REQUEST' });

        const { data } = await axios.post(
          `${url}/api/orders`,
          {
            orderitems: myitems,
            shippingaddress: shippingAddress,
            paymentmethod: paymentMethod,
            itemsprice: updatedTotal,
            coupon_name: discountName,
            coupon_discount: discountPercentage,
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
        // updateProduct();
        ctxDispatch({ type: 'CART_CLEAR' });
        dispatch({ type: 'CREATE_SUCCESS' });
        localStorage.removeItem('cartItems');
       // localStorage.removeItem('couponItems');
        toast.success('Order send successfully');
        const id = data;
        //console.log('ddddd' + data)
        if(paymentMethod === 'cash'){
          navigate('/checkout-success');
        }else{
          navigate(`/order/${id}`);
        }
        
        

        
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



    const updateProduct = async (e) => {
      e.preventDefault();

      try {
        Promise.all([
          placeOrderHandler(),
          axios.put(`${url}/api/stockUpdate`, {
            product_id: productItems?.product_id,
            sold: productItems?.cartQuantity,
            quantity: productItems?.cartQuantity,
          }),
          axios.put(`${url}/api/stockUpdate1`, {
            product_id: productItems1?.product_id,
            sold: productItems1?.cartQuantity,
            quantity: productItems1?.cartQuantity,
          }),
          axios.put(`${url}/api/stockUpdate2`, {
            product_id: productItems2?.product_id,
            sold: productItems2?.cartQuantity,
            quantity: productItems2?.cartQuantity,
          }),
          axios.put(`${url}/api/stockUpdate3`, {
            product_id: productItems3?.product_id,
            sold: productItems3?.cartQuantity,
            quantity: productItems3?.cartQuantity,
          }),
        ])
          .then(function (responses) {
            // Get a JSON object from each of the responses
            return Promise.all(
              responses.map(function (response) {
                return response.json();
              })
            );
          })
          .then(function (data) {
            // Log the data to the console
            // You would do something with both sets of data here
            console.log(data);
          })
          .catch(function (error) {
            // if there's an error, log it
            console.log(error);
          });
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'UPDATE_FAIL' });
      }
    };
    return (
      <div>
        {/* <pre>{JSON.stringify(productItems)}</pre> */}
        <h3>Checkout Summary</h3>

        <div>
          {cartItems.lenght === 0 ? (
            <>
              <p>No item in your cart.</p>
              <button className="--btn">
                <Link to="/#products">Back To Shop</Link>
              </button>
            </>
          ) : (
            <div>
              <p>
                <b>{`Cart item(s): ${cartItems.reduce(
                  (a, c) => a + c.cartQuantity,
                  0
                )}`}</b>
              </p>
              <p>
                <b>{`Payment Method:  ${paymentMethod}`}</b>
              </p>
              <div className={styles.text}>
                <h4>Subtotal Price:</h4>
                <h4>GHS{updatedTotal?.toFixed(2)}</h4>
              </div>
              <div className={styles.text}>
                <h4>Shipping Price:</h4>
                <h4>GHS{shippingPrice?.toFixed(2)}</h4>
              </div>
              <div className={styles.text}>
                <h4>Tax Price:</h4>
                <h4>GHS{taxPrice?.toFixed(2)}</h4>
              </div>
              <div className={styles.text}>
                <h4>Product Price:</h4>
                <h3>GHS{totalPrice?.toFixed(2)}</h3>
              </div>
              <CartDiscount />
              {cartItems.map((item, index) => {
                const { product_id, p_name, price, cartQuantity } = item;
                return (
                  <Card key={product_id} cardClass={styles.card}>
                    <h4>Product: {p_name}</h4>
                    <p>Quantity: {cartQuantity}</p>
                    <p>Unit price: {price}</p>
                    <p>Set price: {price * cartQuantity}</p>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
        <button 
        className="--btn --btn-primary"
        disabled={cartItems.length === 0}
         onClick={updateProduct}>
          Place Order
        </button>
      </div>
    );
  };

  return (
    <section>
      <div className={`container ${styles.checkout}`}>
        <h2>Checkout Details</h2>
       
       
        <form onSubmit={handleSubmit}>
       
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
                onChange={(e) => setName(e.target.value)}
              />
              <label>Address line 1</label>
              <input
                type="text"
                placeholder="Address line 1"
                required
                name="line1"
                value={shippingAddress?.line1}
                onChange={(e) => setLine1(e.target.value)}
              />
              <label>Address line 2</label>
              <input
                type="text"
                placeholder="Address line 2"
                name="line2"
                value={shippingAddress?.line2}
                onChange={(e) => setLine2(e.target.value)}
              />
              <label>City</label>
              <input
                type="text"
                placeholder="City"
                required
                name="city"
                value={shippingAddress?.city}
                onChange={(e) => setCity(e.target.value)}
              />
              <label>State</label>
              <input
                type="text"
                placeholder="State"
                required
                name="states"
                value={shippingAddress?.states}
                onChange={(e) => setState(e.target.value)}
              />
              <label>Postal code</label>
              <input
                type="text"
                placeholder="Postal code"
                required
                name="postal_code"
                value={shippingAddress?.postal_code}
                onChange={(e) => setPostalCode(e.target.value)}
              />
              {/* COUNTRY INPUT */}
              <CountryDropdown
                className={styles.select}
                valueType="short"
                value={country}
                onChange={(val) => setCountry(val)}
                // onChange={(e) =>
                //   e.target.value({
                //     target: {
                //       name: 'country',
                //       value: e,
                //     },
                //   })
                // }
              />
              <label>Phone</label>
              <input
                type="text"
                placeholder="Phone"
                required
                name="phone"
                value={shippingAddress?.phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Card>
            {/* BILLING ADDRESS */}
            <Card cardClass={styles.card}>
              <h3>Billing Address</h3>
              <label>Recipient Name</label>
              <input
                type="text"
                placeholder="Name"
                required
                name="bname"
                value={billingAddress?.bname}
                onChange={(e) => setBname(e.target.value)}
              />
              <label>Address line 1</label>
              <input
                type="text"
                placeholder="Address line 1"
                required
                name="bline1"
                value={billingAddress?.bline1}
                onChange={(e) => setBline1(e.target.value)}
              />
              <label>Address line 2</label>
              <input
                type="text"
                placeholder="Address line 2"
                name="bline2"
                value={billingAddress?.bline2}
                onChange={(e) => setBline2(e.target.value)}
              />
              <label>City</label>
              <input
                type="text"
                placeholder="City"
                required
                name="bcity"
                value={billingAddress?.bcity}
                onChange={(e) => setBcity(e.target.value)}
              />
              <label>State</label>
              <input
                type="text"
                placeholder="State"
                required
                name="bstates"
                value={billingAddress?.bstates}
                onChange={(e) => setBstates(e.target.value)}
              />
              <label>Postal code</label>
              <input
                type="text"
                placeholder="Postal code"
                required
                name="bpostal_code"
                value={billingAddress?.bpostal_code}
                onChange={(e) => setBpostalCode(e.target.value)}
              />
              {/* COUNTRY INPUT */}
              <CountryDropdown
                className={styles.select}
                valueType="short"
                value={bcountry}
                onChange={(val) => setBcountry(val)}
              />
              <label>Phone</label>
              <input
                type="text"
                placeholder="Phone"
                required
                name="bphone"
                value={billingAddress?.bphone}
                onChange={(e) => setBphone(e.target.value)}
              />
              {/* <button type="submit" className="--btn --btn-primary">
                Proceed To Checkout
              </button> */}
            </Card>
          </div>
          <div>
            <Card cardClass={styles.card}>
              <CheckoutSummary />{' '}
            </Card>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CheckoutDetails;
