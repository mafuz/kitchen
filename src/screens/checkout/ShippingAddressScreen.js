import { useEffect, useState, useContext, useReducer } from 'react';
import { CountryDropdown } from 'react-country-region-selector';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/card/Card';
import styles from './CheckoutDetails.module.scss';
import { Store } from '../../Store';

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

const ShippingAddressScreen = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    if (!userInfo.token) {
      navigate('/login?redirect=/shipping');
    }
  }, [userInfo.token, navigate]);

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
    navigate('/payment');
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
                
                name="city"
                value={shippingAddress?.city}
                onChange={(e) => setCity(e.target.value)}
              />
              <label>State</label>
              <input
                type="text"
                placeholder="State"
               
                name="states"
                value={shippingAddress?.states}
                onChange={(e) => setState(e.target.value)}
              />
              <label>Postal code</label>
              <input
                type="text"
                placeholder="Postal code"
                
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
          
          </div>
          <div>
             <Card cardClass={styles.card}>
               {/* BILLING ADDRESS */}
            {/* <Card cardClass={styles.card}> */}
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
               
                name="bcity"
                value={billingAddress?.bcity}
                onChange={(e) => setBcity(e.target.value)}
              />
              <label>State</label>
              <input
                type="text"
                placeholder="State"
               
                name="bstates"
                value={billingAddress?.bstates}
                onChange={(e) => setBstates(e.target.value)}
              />
              <label>Postal code</label>
              <input
                type="text"
                placeholder="Postal code"
               
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
              <button type="submit" className="--btn --btn-primary">
                Continue
              </button>
            {/* </Card> */}
            </Card> 
          </div>
        </form>
      </div>
    </section>
  );
};

export default ShippingAddressScreen;
