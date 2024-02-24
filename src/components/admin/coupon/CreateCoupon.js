import Card from '../../card/Card';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Loader from '../../loader/Loader';
import { toast } from 'react-toastify';
import axios from 'axios';
import React, { useState, useReducer, useEffect, useContext } from 'react';
import { getError } from '../../../screens/utils';
import { Store } from '../../../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'COUPON_SUCCESS':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const CreateCoupon = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ error, successDelete, coupon }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: '',
    }
  );

  const url = process.env.REACT_APP_DEV_BASE_URL;

  const [name, setName] = useState('');
  const [discount, setDiscount] = useState('');
  const [expired_at, setExpiredAt] = useState(new Date());
 
  let [loading, setLoading] = useState(false);


  const saveCoupon = async (e) => {
    e.preventDefault();
    if (name.length < 6) {
      return toast.error('Coupon must be up to 6 characters');
    }
    try {
      setLoading(true);
      const { data } = await axios.post(`${url}/api/addCoupon`, {
        name,
        discount,
        expired_at,
      });
      setName('');
      setDiscount('');
      setLoading(false);
      toast.success('Brand Created Successful');
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
      //toast.error('Invalid username or password');
    }
  };

  return (
    <>
      {loading && <Loader />} 
      <div className="--underline"></div>
      <br />
      <div className="--mb2">
        <h3>Create Coupon</h3>
        <p>
          Use the form to <b>Create a Coupon.</b>
        </p>
        <Card cardClass={'card'}>
          <br />
          <form onSubmit={saveCoupon}>
            <label>Coupon Name:</label>
            <input
              type="text"
              placeholder="Coupon name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              required
            />
            <label>Discount %:</label>
            <input
              type="text"
              placeholder="Coupon Discount"
              name="discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              required
            />
            <label>Expiry date:</label>
            <DatePicker
              selected={expired_at}
              value={expired_at}
              onChange={(date) => setExpiredAt(date)}
              required
            />
            <div className="--my">
              <button type="submit" className="--btn --btn-primary">
                Save Coupon
              </button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export default CreateCoupon;
