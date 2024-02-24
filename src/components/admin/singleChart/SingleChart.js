import "./singleChart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dateFormat from 'dateformat';
import React, {
  
  useEffect,
  useReducer,

  useState,
} from 'react';

import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from "../../../screens/utils";




const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, sales: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };  
    default:
      return state;
  }
};



const SingleChart = ({ aspect, title }) => {

  const [{ error, sales }, dispatch] = useReducer(reducer, {
    sales: [],
    
    loading: true,
    error: '',
  });


  const url = process.env.REACT_APP_DEV_BASE_URL;

  const params = useParams();
  const { id } = params;
   console.log(id);

  
  let [loading, setLoading] = useState(false);

  const fetchProducts = async () => {

    
    
    try {
      setLoading(true);
      const { data } = await axios.get(`${url}/api/customer/purchaseByMonths/` + id, {
        
      });
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
      setLoading(false);
    } catch (err) {
      //console.log(err);
      toast.error(getError(error));
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const months5 = sales[0]?.month;
  const value5 = Number(sales[0]?.sum);
  const month5 = dateFormat(months5, "mmmm"); 
  const months4 = sales[1]?.month;
  const value4 = Number(sales[1]?.sum);
  const month4 = dateFormat(months4, "mmmm"); 
  const months3 = sales[2]?.month;
  const value3 = Number(sales[2]?.sum);
  const month3 = dateFormat(months3, "mmmm"); 
  const months2 = sales[3]?.month;
  const value2 = Number(sales[3]?.sum);
  const month2 = dateFormat(months2, "mmmm"); 
  const months1 = sales[4]?.month;
  const value1 = Number(sales[4]?.sum);
  const month1 = dateFormat(months1, "mmmm"); 
  const months = sales[5]?.month;
  const value = Number(sales[5]?.sum);
  const month = dateFormat(months, "mmmm"); 

  const data = [
    { name: month, Total: value },
    { name: month1, Total: value1 },
    { name: month2, Total: value2},
    { name: month3, Total: value3 },
    { name: month4, Total: value4 },
    { name: month5, Total: value5 },
  ];

  return (
    <div className="chart">
          {/* <pre>{JSON.stringify(id)}</pre>     */}
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SingleChart;
