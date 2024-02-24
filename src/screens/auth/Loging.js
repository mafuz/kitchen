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


function Loging() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  let [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`http://localhost:4000/authentication/login`, {
        email,
        password,
      });

      // console.log(data);
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });

      //ctxDispatch({ type: 'MY_LOGIN', payload: data.jwtToken });
      // localStorage.setItem("cartItems", JSON.stringify(data));
      //  toast.success('User Login Successful');

       
      // if (data.length > 0) {
      //   window.location.href = redirect || "/cart";
      // } else{

      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User Login Successful');

      // localStorage.setItem('loginInfo', JSON.stringify(data.jwtToken));
      navigate(redirect || '/');
      // helps refresh
     // window.location.href = redirect || '/';
      setLoading(false);
   // }
    } catch (err) {
      //toast.error(getError(err));
      toast.error('Invalid username or password');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);


  return (
    <section className={`container ${styles.auth}`}>
      { loading && <Loader />}
        <div className={styles.img}>
        <img src={loaderImage} alt="img" width={500} />
        </div>

         <Card>
         <div className={styles.form}>
            <h2>Login</h2>
            <form onSubmit={submitHandler}>

              
            <input
            type="text"
            placeholder="Email" required
            value={email}
            onChange={(e) => setEmail(e.target.value)}

            />

<input
            type="password"
            placeholder="Password" required
            value={password}
            onChange={(e) => setPassword(e.target.value)}

            />
            
           <button
           type="submit" className="--btn --btn-primary --btn-block"
           >Login</button>
           

<div className="mb-3 mt-3 links text-black form-label">
            Forget password?{' '}
            
            <Link to={`/forgetpassword`} style={{ color: '#FF6347' }}>
              Reset password
            </Link>
          </div>
          <div className="mb-3 links text-black form-label">
            New User?{' '}
            <Link to={'/register'} style={{ color: '#FF6347' }}>
              Create your account
            </Link>
          </div>
           </form>
           
         </div>
         </Card>
        
        </section>
  )
}

export default Loging