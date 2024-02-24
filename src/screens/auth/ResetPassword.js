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


function ResetPassword() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/login';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const url = process.env.REACT_APP_DEV_BASE_URL;

  const location = useLocation();
  const {id, OTP, email} = location?.state
//console.log(location?.state);


  let [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!password) {
        toast.error('All fields are required');
        return;
      }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6 ) {
    //   getError('Passwords must be up to 6 characters');
    toast.error('Passwords must be up to 6 characters');
        return;
      }
    try {
      setLoading(true);
      const { data } = await axios.put(`${url}/authentication/user/resetpassword`, {
        id,
         email,
        password
      });
     // ctxDispatch({ type: 'USER_UPDATE', payload: data });
     // localStorage.setItem('userInfo', JSON.stringify(data));
      
      toast.success('User updated successful');
      navigate(redirect || '/login');
      setLoading(false);
    } catch (err) {
      toast.error(getError(err));
      setLoading(false);
    }
  };


  return (
    <section className={`container ${styles.auth}`}>
      { loading && <Loader />}
        <div className={styles.img}>
          <pre>{JSON.stringify(id)}</pre>  
        <img src={loaderImage} alt="img" width={500} />
        </div>

         <Card>
         <div className={styles.form}>
            <h2>Reset Password</h2>
            <form onSubmit={submitHandler}>

            <input
            type="password"
            placeholder="Password" required
            value={password}
            name={password}
            onChange={(e) => setPassword(e.target.value)}

            />

        <input
            type="password"
            placeholder="Confirm Password" required
            value={confirmPassword}
            name={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}

            />
            
           <button
           type="submit" className="--btn --btn-primary --btn-block"
           >Reset</button>
          
           
           </form>
           
         </div>
         </Card>
        
        </section>
  )
}

export default ResetPassword