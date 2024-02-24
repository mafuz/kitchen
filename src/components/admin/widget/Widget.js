import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { Link, useNavigate } from 'react-router-dom';
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState, 
  
} from 'react';

const Widget = ({ type }) => {
  let data;
  const url = process.env.REACT_APP_DEV_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [userCount, setUserCount] = useState([]);
   const [productCount, setProductCount] = useState([]);
   const [ordersSum, setOrdersSum] = useState([]);
   const [ordersSales, setOrdersSales] = useState([]);
   //const [dailySales, setDailySales] = useState([]);
  //temporary
   //const amount = [userCount[0]?.count, productCount[0]?.count];
  const diff = 20;


   useEffect(() => {
   getData();
   }, []);

  const urls = [`${url}/api/users/count`, 
  `${url}/api/products/count`,
  `${url}/api/orders/sum`,
  `${url}/api/products/sum`];

  // 
  const getData = async () => {
    setLoading(true);
    const [result1, result2, result3, result4, result5] = await Promise.all(
      urls.map((url) => fetch(url).then((res) => res.json()))
   );
    setLoading(false);
    setUserCount(result1);
    setProductCount(result2);
    setOrdersSum(result3);
    setOrdersSales(result4);
   
    
   };

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        amount:  userCount[0]?.count,
        link: <Link to="/admin/usertable">
        <div className="viewButton">All Users</div>
      </Link>,
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "ORDERS",
         amount: "GHS " + ordersSum[0]?.sum,
        link: <Link to="/admin/orders">
        <div className="viewButton">View all orders</div>
      </Link>,
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: "SALES",
        amount: "GHS " + ordersSales[0]?.sum,
        link: <Link to="/admin/sales">
        <div className="viewButton">View sales</div>
      </Link>,
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "balance":
      data = {
        title: "PRODUCT QTY",
        amount: productCount[0]?.sum,
        link: <Link to="/admin/quantity">
        <div className="viewButton">See details</div>
      </Link>,
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      {/* <pre>{JSON.stringify(ordersSales)}</pre>     */}
      <div className="left">
         <span className="title">{data.title}</span> 
        <span className="counter">
           {data?.amount === null ? 0 : data?.amount}  
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;

