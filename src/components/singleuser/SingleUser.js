import SingleChart from '../admin/singleChart/SingleChart';
import './single.scss';
import SingleTable from "../admin/singleTable/SingleTable";
import React, {
    useContext,
    useEffect,
    useReducer,
    useRef,
    useState, 
    
  } from 'react';
 

  import 'react-confirm-alert/src/react-confirm-alert.css';

  import { Store } from '../../Store';
  import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
  import axios from 'axios';
 
  

  
  const reducer = (state, action) => {
    switch (action.type) {
      case 'REFRESH_PRODUCT':
        return { ...state, users: action.payload };
      case 'CREATE_REQUEST':
        return { ...state, loadingCreateReview: true };
      case 'CREATE_SUCCESS':
        return { ...state, loadingCreateReview: false };
      case 'CREATE_FAIL':
        return { ...state, loadingCreateReview: false };
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return { ...state, users: action.payload, loading: false };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
  
        return { ...state, loadingCreateReview: false };
        case 'USER_REQUEST':
          return { ...state, loading: true };
        case 'USER_SUCCESS':
          return { ...state, customer: action.payload, loading: false };
        case 'USER_FAIL':
          return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };

const SingleUser = () => {

   // const { user } = props;
   let reviewsRef = useRef();
   // const { product } = props;
   const navigate = useNavigate();
   const { search } = useLocation();
   const redirectInUrl = new URLSearchParams(search).get('redirect');
   const redirect = redirectInUrl ? redirectInUrl : ``;
  
  
    const [{ error,  customer }, dispatch] = useReducer(reducer, {
      users: [],
      customer: [],
      loading: true,
      error: '',
    });
  
    const url = process.env.REACT_APP_DEV_BASE_URL;

    const { state } = useContext(Store);
    const { userInfo } = state;
  
    let [loading, setLoading] = useState(false);

    const params = useParams();
    const { id } = params;
    console.log(id);

    useEffect(() => {
        const fetchData = async () => {
          dispatch({ type: 'USER_REQUEST' });
          try {
            const result = await axios.get(
              `${url}/api/user/` + id
            );
            dispatch({ type: 'USER_SUCCESS', payload: result.data });
            // console.log(result.data);
          } catch (err) {
            dispatch({ type: 'USER_FAIL', payload: err.message });
          }
    
          //setProducts(result.data);
        };
        fetchData();
      }, []);
    
  return (
    <div className="single">
         {/* <pre>{JSON.stringify(customer[0])}</pre>    */}
      {/* <Sidebar /> */}
      
      <div className="singleContainer">
        {/* <Navbar /> */}
        <div className="top">
        {/* {customer?.map((cust) => {  */}
          <div className="left">
             
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
               <img
                src={customer[0]?.photo}
                alt=""
                className="itemImg"
              /> 
              <div className="details">
                <h4 className="itemTitle">{customer[0]?.firstname} {customer[0]?.lastname}</h4>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{customer[0]?.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{customer[0]?.phone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">
                  {customer[0]?.address === null ? "No Address Info" : customer[0]?.address}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Country:</span>
                  <span className="itemValue">{customer[0]?.country === null ? "No Country Info" : customer[0]?.country}</span>
                </div>
              </div>
            </div>
          </div>
          {/* })} */}
          <div className="right">
            <SingleChart aspect={3 / 1} title="User Spending ( Last 6 Months)" /> 
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Last Transactions</h1>
           <SingleTable /> 
        </div>
      </div>
     
    </div>

  );

};

export default SingleUser;
