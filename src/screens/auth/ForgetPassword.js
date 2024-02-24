import { useContext, useState, useEffect } from 'react';
import styles from "./auth.module.scss"
import loaderImage from "../../assets/login.png"
import Card from '../../components/card/Card'
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Store } from '../../Store';
import axios from 'axios';
import { getError } from "../utils";
import { toast } from 'react-toastify';
import Loader from '../../components/loader/Loader';


function ForgetPassword() {
    const navigate = useNavigate();
    const { search } = useLocation();
   // const redirectInUrl = new URLSearchParams(search).get('redirect');
    //const redirect = redirectInUrl ? redirectInUrl : '/otp-input';
    const url = process.env.REACT_APP_DEV_BASE_URL;
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState();
  //const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  let [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {

      if (email) {
        const OTP = Math.floor(Math.random() * 9000 + 1000);
       // console.log(OTP);
     
      setLoading(true);
      const { data } = await axios.post(`${url}/send_recovery_email`, {
        OTP,
        recipient_email: email,
      
      });

      // console.log(data);
    

    
      toast.success('A new OTP has succesfully been sent to your email');

    
      navigate('/otp-input', {state:{data}});
      // helps refresh
      // window.location.href = redirect || '/otp-input';
      setLoading(false);
   }
    } catch (err) {
      toast.error(getError(err));
      //toast.error('Please enter your email');
      setLoading(false);
    }
  };




  // function nagigateToOtp() {
  //   if (email) {
  //     const OTP = Math.floor(Math.random() * 9000 + 1000);
  //     console.log(OTP);
  //     setOTP(OTP);

  //     axios.post("http://localhost:4000/send_recovery_email", {
  //         OTP,
  //         recipient_email: email,
  //       });
  //       ctxDispatch({ type: 'USER_SIGNIN', payload: data });
        
  //       .catch(console.log);
  //     return;
  //   }
  //   return alert("Please enter your email");
  // }

  return (
    <section className={`container ${styles.auth}`}>
      { loading && <Loader />}
        <div className={styles.img}>
        <img src={loaderImage} alt="img" width={500} />
        </div>

         <Card>
         <div className={styles.form}>
            <h2>Forget Password</h2>
            <form onSubmit={submitHandler}>

              
            <input
            type="text"
            placeholder="Enter email" required
            value={email}
            onChange={(e) => setEmail(e.target.value)}

            />


            
           <button
         type='submit' className="--btn --btn-primary --btn-block"
          // onClick={() => nagigateToOtp()}
           >Submit</button>
           

{/* <div className="mb-3 mt-3 links text-black form-label">
            Forget password?{' '}
            
            <Link to={`/forgotpassword`} style={{ color: '#FF6347' }}>
              Reset password
            </Link>
          </div>
          <div className="mb-3 links text-black form-label">
            New User?{' '}
            <Link to={'/register'} style={{ color: '#FF6347' }}>
              Create your account
            </Link>
          </div> */}
           </form>
           
         </div>
         </Card>
        
        </section>
  )
}

export default ForgetPassword