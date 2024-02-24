import './table.scss';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, { useEffect, useReducer, useContext, useState } from 'react';
import dateFormat from 'dateformat';

import axios from 'axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

import { Store } from '../../../Store';
import Loader from '../../loader/Loader';
import { getError } from '../../../screens/utils';

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

const List = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ orders }, dispatch] = useReducer(reducer, {
    orders: [],
    loading: true,
    error: '',
  });

  const url = process.env.REACT_APP_DEV_BASE_URL;

  let [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        setLoading(true);
        const { data } = await axios.get(
          `${url}/api/orders/history/`,
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

  // const rows = [
  //   {
  //     id: 1143155,
  //     product: 'Acer Nitro 5',
  //     img: 'https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg',
  //     customer: 'John Smith',
  //     date: '1 March',
  //     amount: 785,
  //     method: 'Cash on Delivery',
  //     status: 'Approved',
  //   },
  //   {
  //     id: 2235235,
  //     product: 'Playstation 5',
  //     img: 'https://m.media-amazon.com/images/I/31JaiPXYI8L._AC_UY327_FMwebp_QL65_.jpg',
  //     customer: 'Michael Doe',
  //     date: '1 March',
  //     amount: 900,
  //     method: 'Online Payment',
  //     status: 'Pending',
  //   },
  //   {
  //     id: 2342353,
  //     product: 'Redragon S101',
  //     img: 'https://m.media-amazon.com/images/I/71kr3WAj1FL._AC_UY327_FMwebp_QL65_.jpg',
  //     customer: 'John Smith',
  //     date: '1 March',
  //     amount: 35,
  //     method: 'Cash on Delivery',
  //     status: 'Pending',
  //   },
  //   {
  //     id: 2357741,
  //     product: 'Razer Blade 15',
  //     img: 'https://m.media-amazon.com/images/I/71wF7YDIQkL._AC_UY327_FMwebp_QL65_.jpg',
  //     customer: 'Jane Smith',
  //     date: '1 March',
  //     amount: 920,
  //     method: 'Online',
  //     status: 'Approved',
  //   },
  //   {
  //     id: 2342355,
  //     product: 'ASUS ROG Strix',
  //     img: 'https://m.media-amazon.com/images/I/81hH5vK-MCL._AC_UY327_FMwebp_QL65_.jpg',
  //     customer: 'Harold Carol',
  //     date: '1 March',
  //     amount: 2000,
  //     method: 'Online',
  //     status: 'Pending',
  //   },
  // ];
console.log(orders);
  const date = dateFormat(orders[0]?.orderitems[0]?.created_at, "dd-mm-yy")
  return (
    <> 
    {/* <pre>{JSON.stringify(orders)}</pre>   */}
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">Tracking ID</TableCell>
              <TableCell className="tableCell">Product</TableCell>
              <TableCell className="tableCell">Customer</TableCell>
              <TableCell className="tableCell">Date</TableCell>
              <TableCell className="tableCell">Amount</TableCell>
              <TableCell className="tableCell">Payment Method</TableCell>
              <TableCell className="tableCell">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((row) => (
              <TableRow key={row?.order_id}>
                <TableCell className="tableCell">{row?.order_id}</TableCell>
                <TableCell className="tableCell">
                  <div className="cellWrapper">
                    <img
                      src={row?.orderitems[0]?.images[0]}
                      alt=""
                      className="image"
                    />
                    {row?.orderitems[0]?.p_name}
                  </div>
                </TableCell>

                <TableCell className="tableCell">
                  {row?.shippingaddress?.name}
                </TableCell>
                <TableCell className="tableCell">{date}</TableCell>
                <TableCell className="tableCell">{row?.totalprice}</TableCell>
                <TableCell className="tableCell">{row?.paymentmethod}</TableCell>
                <TableCell className="tableCell">
                   <span className={
                              row?.isdelivered !== 'true'
                                ? `${'pending'}`
                                : `${'delivered'}`
                            }>
                  <TableCell className="tableCell">
                   {row?.isdelivered !== "true"
                    ? `${'pending'}`
                    : `${'delivered'}`} 
                </TableCell>
                  </span> 
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default List;
