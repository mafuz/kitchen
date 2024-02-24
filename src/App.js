import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import HomeScreen from './screens/home/HomeScreen';
import Loging from './screens/auth/Loging';
import Register from './screens/auth/Register';
import Profile from './screens/profile/Profile';
import Admin from './screens/admin/Admin';
import NotFound from './screens/404/NotFound';
import Shop from './screens/shop/Shop';
import ProductDetails from './components/product/productDetails/ProductDetails';

import Cart from './screens/cart/Cart';
import CheckoutDetails from './screens/checkout/CheckoutDetails';
import PlaceOrder from './screens/checkout/PlaceOrder';
import CheckoutSuccess from './screens/checkout/CheckoutSuccess';
import OrderDetails from './screens/orderDetails/OrderDetails';
import OrderHistory from './screens/orderHistory/OrderHistory';
import ShippingAddressScreen from './screens/checkout/ShippingAddressScreen';
import PaymentMethodScreen from './screens/checkout/PaymentMethodScreen';
import OrderScreen from './screens/checkout/OrderScreen';
import Wallet from './screens/wallet/Wallet';
  import OTPInput from './screens/auth/OTPInput';
 import ForgetPassword from './screens/auth/ForgetPassword';
import ResetPassword from './screens/auth/ResetPassword';

function App() {
  return (
    <>
      <BrowserRouter>
         <div className="d-flex flex-column site-container">
           <ToastContainer position="top-center" limit={1} /> 
          <Header /> 

          <Routes>
            <Route path="/" element={<HomeScreen />} />
         <Route path="/login" element={<Loging />} />
         <Route path="/reset-password" element={<ResetPassword />} />
             <Route path="/forgetpassword" element={<ForgetPassword />} />
            <Route path="/otp-input" element={<OTPInput />} />  
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/product-details/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout-details" element={<CheckoutDetails />} />
            <Route path="/checkout-success" element={<CheckoutSuccess />} />
            <Route path="/shipping" element={<ShippingAddressScreen />} />
            <Route path="/payment" element={<PaymentMethodScreen />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/order-details/:id" element={<OrderDetails />} />
            <Route path="/placeorder" element={<PlaceOrder />} />
            <Route path="/order/:id" element={<OrderScreen />}></Route>
            <Route path="/wallet" element={<Wallet />} />
          

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div> 
      </BrowserRouter>
    </>
  );
}
export default App;
