// import React, { useContext, useState, useReducer } from 'react';
// import { Link } from 'react-router-dom';
// import styles from './CheckoutSummary.module.scss';
// import Card from '../../card/Card';
// import { useDispatch } from 'react-redux';
// import { Store } from '../../../Store';
// //import { CartDiscount } from "../../verifyCoupon/VerifyCoupon";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'FETCH_SUCCESS':
//       return { ...state, loading: false };

//     case 'FETCH_FAIL':
//       return { ...state, loading: false, error: action.payload };
//     default:
//       return state;
//   }
// };

// const CheckoutSummary = () => {
//   const { state, dispatch: ctxDispatch } = useContext(Store);
//   const {
    
//     cart: { cartItems, paymentMethod },
//   } = state;
//   const { couponItem } = state;


//   //console.log(couponItem);
//  // const coupon = couponItem?.replace(/[\[\]']/g,'');
 

//  // const coupon = couponItem.substring(1, couponItem.length-1);
  
  

//   //const cartTotalAmount = initialCartTotalAmount - paymentCoupon;
   
 
//   const initialCartTotalAmount = cartItems?.reduce((a, c) => a + c.price * c.cartQuantity, 0).toFixed(2);
//   let discountPercentage = null
//   if (couponItem !== null) {
//     discountPercentage = couponItem[0]?.discount;
// }
//   const discountAmount = (discountPercentage / 100) * initialCartTotalAmount;
//   const updatedTotal = initialCartTotalAmount - discountAmount;

//   const unique_id = Date.now();

//    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
//   // const itemsPrice = round2(
//   //   cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
//   // );
//   const shippingPrice = updatedTotal > 100 ? round2(0) : round2(5);
//   const taxPrice = round2(0.0 * updatedTotal);
//   const totalPrice = updatedTotal + shippingPrice + taxPrice;
//   const myitems = JSON.stringify(cartItems);

//   const showdate = new Date();
//   const date =
//     showdate.getDate() +
//     '-' +
//     showdate.getMonth() +
//     '-' +
//     showdate.getFullYear();

//   const CartDiscount = () => {
//     const { state, dispatch: ctxDispatch } = useContext(Store);
//     const {
//       cart: { cartItems  },

   
//     } = state;

//     const [{ error, loadingCreateReview }, dispatch] = useReducer(reducer, {
//       loading: true,
//       error: '',
//     });

//     let [loading, setLoading] = useState(false);

//     // const initialCartTotalAmount = cartItems.reduce(
//     //   (a, c) => a + c.price * c.cartQuantity,
//     //   0
//     // );

//     return (
//       <>
        
//         {couponItem != null && ( 
//         <Card cardClass={"coupon-msg"}>
          
//           <p className="--center-all">
//             Initial Total: GHS{initialCartTotalAmount} | Coupon: {couponItem[0]?.name} |
//             Discount: {couponItem[0]?.discount}%
//           </p>
       
//         </Card>
        
//       )} 
//       </>
//     );
//   };

//   return (
//     <div>
//       <h3>Checkout Summary</h3>
//       {/* <pre>{JSON.stringify({ couponItem })}</pre>   */}
//       <div>
//         {cartItems.lenght === 0 ? (
//           <>
//             <p>No item in your cart.</p>
//             <button className="--btn">
//               <Link to="/#products">Back To Shop</Link>
//             </button>

//           </>
//         ) : (
//           <div>
//             <p>
//               <b>{`Cart item(s): ${cartItems.reduce(
//                 (a, c) => a + c.cartQuantity,
//                 0
//               )}`}</b>
//             </p>
//             <p>
//               <b>{`Payment Method:  ${paymentMethod}`}</b>
//             </p>
//             <div className={styles.text}>
//               <h4>Subtotal Price:</h4>
//               <h4>GHS{updatedTotal?.toFixed(2)}</h4>
//             </div>
//             <div className={styles.text}>
//               <h4>Shipping Price:</h4>
//               <h4>GHS{shippingPrice?.toFixed(2)}</h4>
//             </div>
//             <div className={styles.text}>
//               <h4>Tax Price:</h4>
//               <h4>GHS{taxPrice?.toFixed(2)}</h4>
//             </div>
//             <div className={styles.text}>
//               <h4>Product Price:</h4>
//               <h3>GHS{totalPrice?.toFixed(2)}</h3>
//             </div>
//             <CartDiscount />
//             {cartItems.map((item, index) => {
//               const { product_id, p_name, price, cartQuantity } = item;
//               return (
//                 <Card key={product_id} cardClass={styles.card}>
//                   <h4>Product: {p_name}</h4>
//                   <p>Quantity: {cartQuantity}</p>
//                   <p>Unit price: {price}</p>
//                   <p>Set price: {price * cartQuantity}</p>
//                 </Card>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CheckoutSummary;
