import React, { useContext, useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import { FaShoppingCart, FaTimes, FaUserCircle } from 'react-icons/fa';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { Store } from '../../Store';
import { useDispatch, useSelector } from 'react-redux';
import { CALCULATE_TOTAL_QUANTITY } from '../../redux/features/product/cartSlice';

import NavDropdown from 'react-bootstrap/NavDropdown';

import { LinkContainer } from 'react-router-bootstrap';
import { shortenText } from '../../utils';
import {
  selectCartItems,
  selectCartTotalQuantity,
} from '../../redux/features/product/cartSlice';

export const logo = (
  <div className={styles.logo}>
    <Link to="/" style={{ textDecoration: 'none' }}>
      <h2>
        MAFUZ<span>DYNAMICS</span>
      </h2>
    </Link>
  </div>
);

const activeLink = ({ isActive }) => (isActive ? `${styles.active}` : '');

function Header() {
  // const cartTotalQuantity = useSelector(selectCartTotalQuantity);
  // const cartItems = useSelector(selectCartItems);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const dispatch = useDispatch();

  const { userInfo } = state;
  const myname = userInfo?.username || {};
  const navigate = useNavigate();
console.log(userInfo);
  const [showMenu, setShowMenu] = useState(false);
  const [scrollPage, setScrollPage] = useState(false);

  
  //  useEffect(() => {
  //     dispatch(CALCULATE_SUBTOTAL({ coupon }));
  //      dispatch(CALCULATE_TOTAL_QUANTITY());
  //    }, [dispatch]);

  const name = <span> Hi, {shortenText(myname, 9)} | </span>;

  const fixedNavbar = () => {
    if (window.scrollY > 50) {
      setScrollPage(true);
    } else {
      setScrollPage(false);
    }
  };
  window.addEventListener('scroll', fixedNavbar);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const hideMenu = () => {
    setShowMenu(false);
  };

  //{cartTotalQuantity}
  const cart = (
    <span className={styles.cart}>
      <Link to="/cart" style={{ textDecoration: 'none' }}>
        Cart
        <FaShoppingCart size={20} />
        <p>{cartItems.reduce((a, c) => a + c.cartQuantity, 0)}</p>
      </Link>
    </span>
  );
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('billingAddress');
    localStorage.removeItem('paymentMethod');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('couponItem');
    navigate('/login');
   // window.location.href = '/login';
  };

  return (
    <header className={scrollPage ? `${styles.fixed}` : null}>
      <div className={styles.header}>
        {logo}
        <nav
          className={
            showMenu ? `${styles['show-nav']}` : `${styles['hide-nav']}`
          }
        >
          <div
            className={
              showMenu
                ? `${styles['nav-wrapper']} 
           ${styles['show-nav-wrapper']}`
                : `${styles['nav-wrapper']}`
            }
            onClick={hideMenu}
          ></div>

          <ul>
            <li className={styles['logo-mobile']}>
              {logo}
              <FaTimes size={22} color="#fff" onClick={hideMenu} />
            </li>
            <li>
              <NavLink
                to="/shop"
                className={activeLink}
                style={{ textDecoration: 'none' }}
              >
                Shop
              </NavLink>
            </li>
            {userInfo?.roles === 'Admin' ? (
              <li>
                <NavLink
                  to="/admin/home"
                  className={activeLink}
                  style={{ textDecoration: 'none' }}
                >
                  | Admin
                </NavLink>
              </li>
            ) : (
              ''
            )}
          </ul>
          <div className={styles['header-right']}>
            <span className={styles.links}>
           
          {userInfo ? ( 

            <Link 
         
             style={{color: "#ff7722", textDecoration: 'none'}} 
             to="/profile" 
              > 
              <FaUserCircle size={16} color="#ff7722" />   {name}      
              </Link>   
                  
                   
                  ) : (
                    <NavLink className="nav-link" to="/login">
                      Login
                    </NavLink>
                  )}
                 </span>  

            <span className={styles.links}>
              {userInfo ? (
                <NavLink
                  to="/order-history"
                  className={activeLink}
                  style={{ textDecoration: 'none' }}
                >
                  My Order
                </NavLink>
              ) : (
                ''
              )}
            </span>

            <span className={styles.links}>
              {userInfo ? (
                <Link
                  className="dropdown-item"
                  to="/login"
                  onClick={signoutHandler}
                >
                  Logout
                </Link>
              ) : (
                ''
              )}

              {/* <NavLink to="/login" className={activeLink} style={{ textDecoration: 'none' }}>Login</NavLink> */}
            </span>
            <span className={styles.links}>
              {!userInfo ? (
                <NavLink
                  to="/register"
                  className={activeLink}
                  style={{ textDecoration: 'none' }}
                >
                  Register
                </NavLink>
              ) : (
                ''
              )}
            </span>
            {cart}
          </div>
        </nav>
        <div className={styles['menu-icon']}>
          {cart}
          <HiOutlineMenuAlt3 size={28} onClick={toggleMenu} />
        </div>
      </div>
    </header>
  );
}

export default Header;
