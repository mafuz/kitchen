// import Sidebar from "../../components/sidebar/Sidebar";
// import Navbar from "../../components/navbar/Navbar";

import Widget from '../widget/Widget';
import Featured from '../featured/Featured ';
import './AdminHome.scss';
import Chart from '../chart/Chart';


// import Chart from "../../components/chart/Chart";
 import Table from "../table/Table";

const AdminHome = () => {
  return (
    <div className="home">
      {/* <Sidebar /> */}
      <div className="homeContainer">
        {/* <Navbar /> */}
        <div className="widgets">
          <Widget type="user" />
          <Widget type="order" />
          <Widget type="earning" />
          <Widget type="balance" />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
        </div>
        <div className="listContainer">
          <div className="listTitle">Latest Transactions</div>
           <Table /> 
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
