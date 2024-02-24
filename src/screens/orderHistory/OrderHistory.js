import React, { useEffect, useReducer, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderHistory.scss";
// import {
//   getOrders,
//   selectOrders,
// } from "../../redux/features/product/orderSlice";

import axios from 'axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { getError } from "../utils";
import Loader from "../../components/loader/Loader";
import { Store } from "../../Store";


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const OrderHistory = () => {

  const navigate = useNavigate();

   
  const { state } = useContext(Store);
  const { userInfo } = state; 
  const [{ orders }, dispatch] = useReducer(
      reducer,
      {
          
        loading: true,
        error: '',
      }
    );

    const url = process.env.REACT_APP_DEV_BASE_URL;

    let [loading, setLoading] = useState(false);

  useEffect(() => {      
      const fetchBrands = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          setLoading(true);
          const { data } = await axios.get(
            `${url}/api/orders/history/` + userInfo.id,
            {
              headers: { authorization: 'Bearer ' + userInfo.token },
            }
          );
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
          setLoading(false);
        } catch (err) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
          setLoading(false);
        }
      };
      
      fetchBrands();
      // forceUpdate();
    }, []);

  const handleClick = (id) => {
    navigate(`/order-details/${id}`);
  };
//const myId = userInfo.id;
//const param = (myId).toString();
    // Begin Pagination
    const itemsPerPage = 10;
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + itemsPerPage;
    const orderItems = orders?.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(orders?.length / itemsPerPage);
  
    const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % orders?.length;
      setItemOffset(newOffset);
    };
    // End Pagination

  return (
    <section>
      <div className={`container order`}>
      {/* <pre>{JSON.stringify(param)}</pre> */}
        <h2>Your Order History</h2>
        <p>
          Open an order to leave a <b>Product Review</b>
        </p>
        <br />
        <>
          {loading && <Loader />}
          <div className={"table"}>
            {orders?.length === 0 ? (
              <p>No order found</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>s/n</th>
                    <th>Date</th>
                    <th>Order ID</th>
                    <th>Order Amount</th>
                    <th>Order Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems?.map((order, index) => {
                    const {
                     order_id,
                      created_at,
                     
                      totalprice,
                      isdelivered,
                    } = order;
                    return (
                      <tr key={order_id} onClick={() => handleClick(order_id)}>
                        <td>{index + 1}</td>
                        <td>
                          {created_at}
                        </td>
                        <td>{order_id}</td>
                        <td>
                          {"GHS"}
                          {totalprice.toFixed(2)}
                        </td>
                        <td>
                          <p
                            className={
                              isdelivered !== "true"
                                ? `${"pending"}`
                                : `${"delivered"}`
                            }
                          >
                            {
                              isdelivered !== "true"
                                ? `${"pending"}`
                                : `${"delivered"}`
                            }
                          </p>
                        </td>
                        <td>
                   <button
                   className="--btn --btn-success"
                     type="button"
                     variant="light"
                     onClick={() => {
                       navigate(`/order/${order.id}`);
                   }}
                   >
                     Details
                   </button>
                </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel="Prev"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="activePage"
        />
        </>
      </div>
    </section>
  );
};

export default OrderHistory;
