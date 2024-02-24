// import { useContext, useState, useReducer, useEffect } from 'react';
// import "./VerifyCoupon.scss";
// import { useDispatch, useSelector } from "react-redux";
// // import {
// //   REMOVE_COUPON,
// //   getCoupon,
// // } from "../../redux/features/coupon/couponSlice";
// import Card from "./../card/Card";
// import { Store } from '../../Store';
// import axios from 'axios';

// import { toast } from 'react-toastify';
// import Loader from '../../components/loader/Loader';
// import { getError } from '../../screens/utils';


// const reducer = (state, action) => {
//   switch (action.type) {
   
//     case 'FETCH_SUCCESS':
//       return { ...state,  loading: false };

//     case 'FETCH_FAIL':
//       return { ...state, loading: false, error: action.payload };
//     default:
//       return state;
//   }
// };




// const VerifyCoupon = () => {
//  // const dispatch = useDispatch();

//  const { state, dispatch: ctxDispatch } = useContext(Store);
//  const {
//   cart: { cartItems },
//   userInfo
// } = state;

//   const [couponName, setCouponName] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [coupon, setCoupon] = useState(null);
//   //  const { coupon, isLoadng } = useSelector((state) => state.coupon);
// //    const { cartTotalAmount, fixedCartTotalAmount } = useSelector(
// //     (state) => state.cart
// //  );

// //const initialCartTotalAmount = cartItems?.reduce((a, c) => a + c.price * c.cartQuantity, 0).toFixed(2);
// //const discountPercentage = '';
 
// const [{ error, loadingCreateReview }, dispatch] =
// useReducer(reducer, {
  
//   loading: true,
//   error: '',
// });


// //console.log(coupon);

//  let [loading, setLoading] = useState(false);

//    const verifyCoupon = async (e) => {
    
//     e.preventDefault();
    
//       try {
//         setLoading(true);
//         const { data } = await axios.get('http://localhost:4000/api/coupon/' + couponName
//         );
  
//         setCoupon(data);
  
//         console.log(JSON.stringify(data));
//         toast.success('Coupon fetch Successful');
     
//         setLoading(false);
    
//       } catch (err) {
//         toast.error(getError(err));
       
//         setLoading(false);
//       }
//     };

 

    
//  const CartDiscount = () => {
//   const { state,  dispatch: ctxDispatch } = useContext(Store);
//   const {
//    cart: { cartItems },
  
//    userInfo
//  } = state;

 
//  const [{ error, loadingCreateReview }, dispatch] =
//  useReducer(reducer, {
   
//    loading: true,
//    error: '',
//  });
 

 
//   let [loading, setLoading] = useState(false);
 
//   const initialCartTotalAmount = cartItems.reduce((a, c) => a + c.price * c.cartQuantity, 0)   

//  // Apply discoount to cart
// //  function applyDiscount() {
// //    var discountAmount = (discountPercentage / 100) * initialCartTotalAmount;
// //    var updatedTotal = initialCartTotalAmount - discountAmount;
// //    return updatedTotal;
// // }
 


//   return (
//     <>
//        {coupon != null && ( 
      
//         <Card cardClass={"coupon-msg"}>
        
//           <p className="--center-all">
//             Initial Total: GHS{initialCartTotalAmount} | Coupon: {coupon[0]?.name} |
//             Discount: {coupon[0]?.discount}%
//           </p>
       
//         </Card>
        
//       )} 
//     </>
//   );
// };

//   const removeCoupon = async () => {
//   //   // dispatch(REMOVE_COUPON());
//    };

//   return (
//     <>
//        <CartDiscount /> 

//       <div className="--flex-between">
//       {/* <pre>{JSON.stringify(coupon)}</pre> */}
//         <p>Have a coupon?</p>
//           {coupon === null ? ( 
//           <p
//             className="--cursor --color-primary"
//             onClick={() => setShowForm(true)}
//           >
//             <b>Add Coupon</b>
//           </p>
//         ) : ( 
//            <p className="--cursor --color-danger" onClick={removeCoupon}>
//             <b>Remove Coupon</b>
//           </p> 
//           )} 
//       </div>
//       {showForm && (
//         <form onSubmit={verifyCoupon} className="coupon-form --form-control">
//           <input
//             type="text"
//             placeholder="Coupon name"
//             name="name"
//             value={couponName}
//             onChange={(e) => setCouponName(e.target.value.toUpperCase())}
//             required
//           />
//           <button type="submit" className="--btn --btn-primary">
//             Verify
//           </button>
//         </form>
//       )}
//     </>
//   );
// };

// export default VerifyCoupon;
