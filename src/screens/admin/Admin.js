import React from 'react';
import styles from './Admin.module.scss';
import Navbar from '../../components/admin/navbar/Navbar';
import AdminHome from '../../components/admin/adminHome/AdminHome';
import { Route, Routes } from 'react-router-dom';
import Category from '../../components/admin/category/Category';
import Brand from '../../components/admin/brand/Brand';
import AddProduct from '../../components/admin/addProduct/AddProduct';
import ViewProducts from '../../components/admin/viewProducts/ViewProducts';
import EditProduct from '../../components/admin/editProduct/EditProduct';
import ProductForm from '../../components/admin/productForm/ProductForm';
import Coupon from '../../components/admin/coupon/Coupon';
import Orders from '../../components/admin/orders/Orders';
import OrderDetails from '../../components/admin/orderDetails/OrderDetails';
import UserTable from '../../components/usertable/UserTable';
import SingleUser from '../../components/singleuser/SingleUser';
import Sales from '../../components/sales/Sales';
import ProductQty from '../../components/productQty/ProductQty';

function Admin() {
  return (
    <div className={styles.admin}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.content}>
        <Routes>
          <Route path="home" element={<AdminHome />} />
          <Route path="category" element={<Category />} />
          <Route path="brand" element={<Brand />} />
          <Route path="/usertable" element={<UserTable />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/quantity" element={<ProductQty />} />
          <Route path="all-products" element={<ViewProducts />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="single-user/:id" element={<SingleUser />} />
          <Route path="coupon" element={<Coupon />} />
          <Route path="orders" element={<Orders />} />
          <Route path="order-details/:id" element={<OrderDetails />} />
        </Routes>
      </div>
    </div>
  );
}

export default Admin;
