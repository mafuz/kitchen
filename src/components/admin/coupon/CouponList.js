import { FaTrashAlt } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import React, {
  useContext,
  useEffect,
  useReducer,
  useState
} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Store } from '../../../Store';
import { getError } from '../../../screens/utils';
import Loader from "../../loader/Loader";




const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, coupons: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};


const CouponList = () => {

   
  const { state } = useContext(Store);
  const { userInfo } = state; 
  const [{  error, successDelete, coupons}, dispatch] = useReducer(
      reducer,
      {
          
        loading: true,
        error: '',
      }
    );

    const url = process.env.REACT_APP_DEV_BASE_URL;

    let [loading, setLoading] = useState(false);
    useEffect(() => {      
      const fetchCoupons = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
         
          const { data } = await axios.get(
            `${url}/api/coupons`,
            {
              headers: { authorization: 'Bearer ' + userInfo.token },
            }
          );
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
          
        } catch (err) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        
        }
      };
      
      fetchCoupons();
      // forceUpdate();
    }, [coupons]);


    
    const delCoupon = async (coupon_id) => {
           
      try {
        setLoading(true);
        await axios.delete(
           `${url}/api/coupon/` + coupon_id
        );
        toast.success('Coupon deleted successfully');
        setLoading(false);
      } catch (err) {
        toast.error(getError(error));
        setLoading(false);
      } 

  };


  const confirmDelete = (coupon_id) => {
    confirmAlert({
      title: "Delete Coupon",
      message: "Are you sure you want to delete this coupon.",
      buttons: [
        {
          label: "Delete",
          onClick: () => delCoupon(coupon_id),
        },
        {
          label: "Cancel",
          // onClick: () => alert('Click No')
        },
      ],
    });
  };

  // const delCoupon = async (id) => {
  //   await dispatch(deleteCoupon(id));
  //   await dispatch(getCoupons());
  // };

  return (
    <div className="--mb2 ">
      <h3>All Coupons</h3>
      {loading && <Loader />} 
      <div className={"table"}>
        {coupons?.length === 0 ? (
          <p>No coupon found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>s/n</th>
                <th>Name</th>
                <th>Discount (%)</th>
                <th>Date Created</th>
                <th>Expiry Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons?.map((coupon, index) => {
                const { coupon_id, name, discount, expired_at, created_date } = coupon;
                return (
                  <tr key={coupon_id}>
                    <td>{index + 1}</td>
                    <td>{name}</td>
                    <td>{discount}% OFF</td>
                    <td>{created_date?.substring(0, 10)}</td>
                    <td>{expired_at?.substring(0, 10)}</td>
                    <td>
                      <span>
                        <FaTrashAlt
                          size={20}
                          color={"red"}
                          onClick={() => confirmDelete(coupon_id)}
                        />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CouponList;
