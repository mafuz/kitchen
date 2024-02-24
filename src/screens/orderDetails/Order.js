import React, { useEffect, useRef, useReducer } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
//import { getOrder } from "../../redux/features/product/orderSlice";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Spinner } from '../../components/loader/Loader';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, order: action.payload };
    case 'FETCH_SUCCESS':
      return { ...state, order: action.payload, loading: false };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Order = () => {
  const pdfRef = useRef();
  const { id } = useParams();
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { isLoading, isError, message, order } = useSelector(
  //   (state) => state.order
  // );
  const [{ loading, error, order, loadingCreateReview }, dispatch] = useReducer(
    reducer,
    {
      order: [],
      item: [],
      loading: true,
      error: '',
    }
  );

//const ordern = order[0];

const url = process.env.REACT_APP_DEV_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`${url}/api/order/` + id);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        // console.log(result.data);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }

      //setProducts(result.data);
    };
    fetchData();
  }, []);

  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imageWidth = canvas.width;
      const imageHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imageWidth, pdfHeight / imageHeight);
      const imgX = (pdfWidth - imageWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(
        imgData,
        'PNG',
        imgX,
        imgY,
        imageWidth * ratio,
        imageHeight * ratio
      );
      pdf.save(`mafuzdynamicsInvoice.pdf`);
    });
  };
 

  return (
    <section>
      <div className="container" ref={pdfRef}>
         {/* <pre>{JSON.stringify(ordern)}</pre>  */}
        <h2>Order Details</h2>
        <div>
          <Link to="/order-history">&larr; Back To Orders</Link>
        </div>
        <br />
        <div className="table">
          {loading && order === null ? (
            // <img src={spinnerImg} alt="Loading..." style={{ width: "50px" }} />
            <Spinner />
          ) : (
            <>
          {order?.map((ordern) => {
              return (
            <div key={ordern?.order_id}>
              
            {/* <pre>{JSON.stringify(ordern)}</pre>  */}
               <div >
              <p>
                <b>Ship to</b> {ordern?.shippingaddress?.name}
              </p>
              <p>
                <b>Order ID</b> {ordern?.order_id}
              </p>
              <p>
                <b>Order Amount</b> GHS{ordern?.totalprice}
              </p>
              <p>
                <b>Coupon</b> {ordern?.coupon_name} | {ordern?.coupon_discount}%
              </p>
              <p>
                <b>Payment Method</b> {ordern?.paymentmethod}
              </p>
              <p>
                <b>Order Status</b>  {
                              ordern?.isdelivered === "false"
                                ? `${"pending"}`
                                : `${"delivered"}`
                            }
              </p>
              <p>
                <b>Shipping Address</b>
                <br />
                Address: {ordern?.shippingaddress?.line1},
                 {ordern?.shippingaddress?.city}
                <br />
                State: {ordern?.shippingaddress?.states}
                <br />
                Country: {ordern?.shippingaddress?.country}
              </p>
              </div>
            
              <br />
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
                  {ordern?.orderitems?.map((order, index) => {
                    const { product_id, title, price, images, cartQuantity } =
                      order;
                    return (
                      <tr key={product_id}>
                        <td>
                          <b>{index + 1}</b>
                        </td>
                        <td>
                          <p>
                            <b>{title}</b>
                          </p>
                          <img
                            src={images[0]}
                            alt={title}
                            style={{ width: '100px' }}
                          />
                        </td>
                        <td>{price}</td>
                        <td>{cartQuantity}</td>
                        <td>{(price * cartQuantity).toFixed(2)}</td>
                        <td className={'icons'}>
                          <Link to={`/review-product/${product_id}`}>
                            <button className="--btn --btn-primary">
                              Review Product
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              </div>
            );
          })}
            </>
           
          )}
        </div>
      </div>
      <div className="--center-all --my">
        <button className="--btn --btn-primary --btn-lg" onClick={downloadPDF}>
          Download as PDF
        </button>
      </div>
    </section>
  );
};

export default Order;
