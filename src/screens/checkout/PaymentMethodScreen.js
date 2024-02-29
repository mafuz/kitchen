import React, { useState, useContext, useReducer, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { Store } from '../../Store';
import { toast } from 'react-toastify';

import './Radio.scss';

import { FaTrashAlt } from 'react-icons/fa';






export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/checkout-details';
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'Cash'
  );


  useEffect(() => {
    if (!shippingAddress.line1) {
      //navigate('/shipping');
      window.location.href = redirect || '/shipping';
    }
  }, [shippingAddress, navigate]);

  const setPayment = (e) => {
    e.preventDefault();
    if (paymentMethodName === '') {
      return toast.error('Please select a payment method');
    }
    //console.log(paymentMethodName);
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    window.location.href = redirect || '/checkout-details';
    //navigate('/checkout-details');

    //ctxDispatch({ type: 'SAVE_COUPON_ITEM', payload: coupon });

    // localStorage.setItem('couponItem', JSON.stringify(coupon));

    //navigate('/checkout-details');
    

  
  };

  //const url = "https://automation-app.onrender.com"
  //http://localhost:4000



  return (
    <div>
      
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>
        

          <form className="--form-control" onSubmit={setPayment}>
                    <label htmlFor={'cash'} className="radio-label">
                      <input
                        className="radio-input"
                        type="radio"
                        name={'paymentMethod'}
                        id={'cash'}
                        value={'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span className="custom-radio" />
                      Cash
                    </label>
                
                    <label htmlFor={'paystack'} className="radio-label">
                      <input
                        className="radio-input"
                        type="radio"
                        name={'paymentMethod'}
                        id={'paystack'}
                        value={'paystack'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span className="custom-radio" />
                      Paystuck
                    </label>
                    <label htmlFor={'wallet'} className="radio-label">
                      <input
                        className="radio-input"
                        type="radio"
                        name={'paymentMethod'}
                        id={'wallet'}
                        value={'wallet'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span className="custom-radio" />
                      Wallet
                    </label>
                    <button
                      type="submit"
                      className="--btn --btn-primary --btn-block"
                    >
                      Continue
                    </button>
                  </form>
      </div>
    </div>
  );
}
