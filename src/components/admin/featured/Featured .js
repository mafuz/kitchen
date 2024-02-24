import './featured.scss';
import React, { useEffect, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

const Featured = () => {

  const url = process.env.REACT_APP_DEV_BASE_URL;

  const [loading, setLoading] = useState(false);
  const [userCount, setUserCount] = useState([]);
  const [productCount, setProductCount] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [weeklySales, setWeeklySales] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  //temporary
  //const amount = [userCount[0]?.count, productCount[0]?.count];
  const diff = 20;

  useEffect(() => {
    getData();
  }, []);

  const urls = [
    `${url}/api/users/count`,
    `${url}/api/products/count`,
    `${url}/api/products/monthlysales`,
    `${url}/api/products/weeklysales`,
    `${url}/api/products/dailysales`,
  ];

  //
  const getData = async () => {
    setLoading(true);
    const [result1, result2, result3, result4, result5] = await Promise.all(
      urls.map((url) => fetch(url).then((res) => res.json()))
    );
    setLoading(false);
    setUserCount(result1);
    setProductCount(result2);
    setMonthlySales(result3);
    setWeeklySales(result4);
    setDailySales(result5);
  };

  return (
    <div className="featured">
      {/* <pre>{JSON.stringify(weeklySales)}</pre>  */}
      <div className="top">
        <h1 className="title">Total Revenue</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar value={70} text={'70%'} strokeWidth={5} />
        </div>
        <p className="title">Total sales made today</p>
        <p className="amount">
          GHS{dailySales[0]?.sum === null ? 0 : dailySales[0]?.sum}
        </p>
        <p className="desc">
          Previous transactions processing. Last payments may not be included.
        </p>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Target</div>
            <div className="itemResult negative">
              <KeyboardArrowDownIcon fontSize="small" />
              <div className="resultAmount">GHS5K</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">This Week</div>
            <div className="itemResult positive">
              <KeyboardArrowUpOutlinedIcon fontSize="small" />
              <div className="resultAmount">
                GHS{weeklySales[0]?.sum === null ? 0 : weeklySales[0]?.sum}
              </div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">This Month</div>
            <div className="itemResult positive">
              <KeyboardArrowUpOutlinedIcon fontSize="small" />
              <div className="resultAmount">
                GHS
                {monthlySales[0]?.sum === null ? 0 : monthlySales[0]?.sum}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
