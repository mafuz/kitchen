import axios from 'axios';
import React, {
  useContext,
  useState,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

import { Link } from 'react-router-dom';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import styles from './PlaceOrder.module.scss';
import Alert from 'react-bootstrap/Alert';

import { PaystackButton } from 'react-paystack';
import { Store } from '../../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import Card1 from '../../components/card/Card1';
import Card from '../../components/card/Card';
import Loader from '../../components/loader/Loader';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };

    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    default:
      return state;
  }
}

const OrderScreen = () => {
  const pdfRef = useRef();
  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const [
    {
      loading,
      error,
      //orders,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    //orders: [],

    loading: true,
    error: '',
    order: [],
    error: '',
    successPay: false,
    loadingPay: false,
  });
  const {
    fullBox,
    loginInfo,
    userInfo,
    cart: { shippingAddress, billingAddress, paymentMethod },
  } = state;

  const publicKey = process.env.REACT_APP_API_KEY;
    const url = process.env.REACT_APP_DEV_BASE_URL;
  
  
  const amount = order[0]?.totalprice * 100;
  const currency = 'GHS';
  const email = userInfo?.email;
  const name = userInfo?.username;
  const phone = '0501399430';

  const componentProps = {
    email,
    amount,
    currency,
    metadata: {
      name,
      phone,
    },
    publicKey,
    text: 'YOU MAY PAY NOW!!',

    onSuccess: () => onApprove(),
    // alert("Thanks for doing business with us! Come back soon!!"),
    onClose: () => alert("Wait! Don't leave :("),
  };

  async function onApprove(data, actions) {
    try {
      dispatch({ type: 'PAY_REQUEST' });
      const { data } = await axios.put(
        `${url}/api/orders/payment/` + orderId,

        {},
        {
          headers: {
            //'Content-Type': 'application/json',
            authorization: 'Bearer ' + userInfo.token,
          },
        }
      );
      dispatch({ type: 'PAY_SUCCESS', payload: data });
      toast.success('Order is paid');
      // <Document onLoadSuccess={onDocumentLoadSuccess}></Document>;
      // <Page height="600" pageNumber={pageNumber} ></Page>
    } catch (err) {
      toast.error(getError(err));
    }
  }
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        // setState({ ...state, loading: true });
        dispatch({ type: 'FETCH_REQUEST' });
        fetch(`${url}/api/order/` + orderId, {
          method: 'GET',
          //headers: new Headers({
          headers: { authorization: 'Bearer ' + userInfo.token },
          //}),
        })
          .then(function (res) {
            return res.json();
          })

          .then(function (data) {
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
            // console.log(data);
          });

        //setState({ ...state, loading: false });
        //dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        //setState({ ...state, loading: false });
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) {
      return Navigate('/SIGNIN');
    }

    if (
      !order.id ||
      successPay ||
      successDeliver ||
      (order.id && order.id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    }
  }, [successPay, successDeliver]);

  const deliverOrderHandler = async () => {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `${url}/api/orders/update/` + orderId,
        {
          order_id: orderId,
          isdelivered: 'true',
          users: userInfo.id,
        },
        {
          headers: {
            authorization: 'Bearer ' + userInfo.token,
          },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Order is delivered');
      navigate(`/admin/orders`);
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  };

  const cashDeliverOrderHandler = async () => {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `${url}/api/orders/cash/update/` + orderId,
        {
          order_id: orderId,
          ispaid: 'true',
          isdelivered: 'true',
          users: userInfo.id,
        },
        {
          headers: {
            authorization: 'Bearer ' + userInfo.token,
          },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Order is delivered');
      navigate(`/admin/orders`);
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  };

  const CheckoutSummary = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
      cart: { cartItems, paymentMethod },
    } = state;
    const { couponItem } = state;

    return (
      <div>
        <>
          {/* <pre>{JSON.stringify(orderId)}</pre>  */}
          <h3>Order Summary</h3>
          {order?.map((orders) => (
            <div key={orders?.order_id}>
              {cartItems.lenght === 0 ? (
                <>
                  {/* <p>No item in your cart.</p>
                  <button className="--btn">
                    <Link to="/#products">Back To Shop</Link>
                  </button> */}
                </>
              ) : (
                <div>
                  {/* {orders?.orderitems?.map((items) => (
                    <p key={items?.product_id}>
                      <b>{`Order item(s): ${items?.cartQuantity}`}
}`}</b>
                    </p>
                  ))} */}
                  <ListGroup.Item>
                    <Row style={{ fontSize: '17px' }}>
                      <Col>Item(s) price:</Col>
                      <Col>GHS {orders?.itemsprice?.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row style={{ fontSize: '17px' }}>
                      <Col>Shipping Price:</Col>
                      <Col>GHS {orders?.shippingprice?.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row style={{ fontSize: '17px' }}>
                      <Col>Tax Price:</Col>
                      <Col>GHS {orders?.taxprice?.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row style={{ fontSize: '17px' }}>
                      <Col>Order Total:</Col>
                      <Col>GHS {orders?.totalprice?.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                </div>
              )}

              <div>
                {orders?.coupon_name !== null ? (
                  <>
                    <Card1 cardClass={'coupon-msg'}>
                      <p>
                        Coupon: {orders?.coupon_name} | Discount:{' '}
                        {orders?.coupon_discount}%
                      </p>
                      {/* Initial Total: GHS{initialCartTotalAmount} | */}
                    </Card1>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          ))}
        </>
      </div>
    );
  };

  return (
    <div className="App">
      <section>
        <div className={`container ${styles.checkout}`}>
          <h2>Order {orderId}</h2>
          {/* <pre>{JSON.stringify(order)}</pre>   */}
          {order?.map((orders) => (
            <div key={orders?.order_id}>
              <div className={styles.colum}>
                <div className="table">
                  <Card cardClass={styles.card}>
                    <p>
                      <strong>Name: </strong>
                      {orders?.shippingaddress?.name} <br />
                      <strong>Phone Number: </strong>{' '}
                      {orders.shippingaddress.phone} <br />
                      <strong>Address: </strong> {orders.shippingaddress.line1},
                      {orders.shippingaddress.city},{' '}
                      {orders.shippingaddress.postal_code},
                      {orders.shippingaddress.country}
                    </p>

                    <br />
                    <div>
                      {orders.isdelivered === 'true' ? (
                        <Alert
                          style={{
                            background: '#28a745',
                            height: '50px',
                            paddingTop: '15px',
                            paddingLeft: '10px',
                          }}
                          variant="danger"
                        >
                          {' '}
                          <b style={{ color: '#006400' }}> Delivered </b>
                        </Alert>
                      ) : (
                        <Alert
                          style={{
                            background: '#F2D4D7',
                            height: '50px',
                            textColor: '#F2D4D7',
                            paddingTop: '15px',
                            paddingLeft: '10px',
                          }}
                          variant="danger"
                        >
                          {' '}
                          <b style={{ color: '#E75480' }}> Not Delivered </b>
                        </Alert>
                      )}
                    </div>
                  </Card>
                  <br />
                  <Card cardClass={styles.card}>
                    <p>
                      <b>Payment Method:</b>
                    </p>
                    <p>
                      <b>{orders?.paymentmethod}</b>
                    </p>

                    <br />
                    <div>
                      {orders?.ispaid === 'true' ? (
                        <Alert
                          style={{
                            background: '#28a745',
                            height: '50px',
                            paddingTop: '15px',
                            paddingLeft: '10px',
                          }}
                          variant="danger"
                        >
                          {' '}
                          <b style={{ color: '#006400' }}> Paid </b>
                        </Alert>
                      ) : (
                        <Alert
                          style={{
                            background: '#F2D4D7',
                            height: '50px',
                            textColor: '#F2D4D7',
                            paddingTop: '15px',
                            paddingLeft: '10px',
                          }}
                          variant="danger"
                        >
                          {' '}
                          <b style={{ color: '#E75480' }}> Not Paid </b>
                        </Alert>
                      )}
                    </div>
                  </Card>

                  <div className="table">
                    <table>
                      <thead>
                        <tr>
                          <th>s/n</th>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                        </tr>
                      </thead>

                      <tbody>
                        {orders?.orderitems?.map((orders, index) => {
                          const {
                            product_id,
                            p_name,
                            price,
                            images,
                            cartQuantity,
                          } = orders;
                          return (
                            <tr key={product_id}>
                              <td>
                                <b>{index + 1}</b>
                              </td>
                              <td>
                                <p>
                                  <b>{p_name}</b>
                                </p>
                                <img
                                  src={images[0]}
                                  alt={p_name}
                                  style={{ width: '100px' }}
                                />
                              </td>
                              <td>{price}</td>
                              <td>{cartQuantity}</td>
                              <td>{price * cartQuantity}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <Card1 cardClass={`coupon-msg ${styles.card1}`}>
                  <CheckoutSummary />{' '}
                  <ListGroup>
                    {orders?.ispaid === 'false' &&
                      orders.paymentmethod === 'paystack' && (
                        <ListGroup.Item>
                          {/* <div className="flex flex-grow  h-10 bg-blue-600 rounded-xl">
            <Button className="w-25"></Button> */}

                          <PaystackButton
                            {...componentProps}
                            className="my-button"
                          />
                          {/* <Button className=""></Button> */}
                          {/* </div> */}
                        </ListGroup.Item>
                      )}
                     {userInfo.roles === 'Admin' &&
                      orders.isdelivered === 'false' &&
                      orders?.ispaid === 'true' &&
                      orders.paymentmethod === 'paystack' && (
                        <ListGroup.Item>
                          {loadingDeliver && <Loader></Loader>}
                          <button
                            className="my-button"
                            // className="--btn --btn-primary"
                            onClick={deliverOrderHandler}
                          >
                            Deliver Order
                          </button>
                        </ListGroup.Item>
                      )} 
                     {userInfo.roles === 'Admin' &&
                      orders.isdelivered === 'false' &&
                      orders?.ispaid === 'false' &&
                      orders.paymentmethod === 'cash' && (
                        <ListGroup.Item>
                          {loadingDeliver && <Loader></Loader>}
                          <button
                            className="my-button"
                            // className="--btn --btn-primary"
                            onClick={cashDeliverOrderHandler}
                          >
                            Deliver Order
                          </button>
                        </ListGroup.Item>
                      )} 
                  </ListGroup>
                </Card1>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
export default OrderScreen;
