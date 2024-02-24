import { useContext, useState, useEffect , useReducer} from 'react';
import styles from "./auth.module.scss"
import loaderImage from "../../assets/register.png"
import Card from '../../components/card/Card'
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Store } from '../../Store';
import axios from 'axios';
import { getError } from "../utils";
import { toast } from 'react-toastify';
import Loader from '../../components/loader/Loader';


const reducer = (state, action) => {
  switch (action.type) {
    case 'SAVE_REQUEST':
      return { ...state, loading: true };
    case 'SAVE_SUCCESS':
      return {
        ...state,
        register: action.payload,
        loading: false,
      };
    case 'SAVE_FAIL':
      return { ...state, loading: false, error: action.payload };
  
    default:
      return state;
  }
};
function Register() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';
    const [{  products, categorys, error }, dispatch] = useReducer(reducer, {
      loading: true,
      products: [],
      categorys: [],
      error: '',
    });

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

//     const [formData, setFormData] = useState(initialState);
//   const {username, email, password, confirmPassword } = formData;

//   const handleInputChange = (e) => {
//    const { name, value} = e.target
//    setFormData({...formData, [name]: value});

//   }

  const { state } = useContext(Store);
  const { userInfo } = state;

  let [loading, setLoading] = useState(false);

  const url = process.env.REACT_APP_DEV_BASE_URL;
  
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email || !password) {
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
      const { data } = await axios.post(`${url}/authentication/register`, {
        username,
        email,
        password
      });
      dispatch({ type: 'SAVE_SUCCESS', payload: data });
      // localStorage.setItem('userInfo', JSON.stringify(data));
      
      toast.success('User created successful');
      navigate(redirect || '/');
      setLoading(false);
    } catch (err) {
      toast.error(getError(err));
      setLoading(false);
    }
  };

  return (
    <section className={`container ${styles.auth}`}>
      
      { loading && <Loader />}
         <Card>
         <div className={styles.form}>
            <h2>Register</h2>
            <form onSubmit={submitHandler}>
            <input
            type="text"
            placeholder="Username" required
            value={username}
            name={username}
            onChange={(e) => setUsername(e.target.value)}

            />
              <input
            type="text"
            placeholder="Email" required
            value={email}
            name={email}
            onChange={(e) => setEmail(e.target.value)}

            />
          
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
           >Register</button>


          <div className="mb-3 links text-black form-label">
            Already have account?{' '}
            <Link to={'/login'} style={{ color: '#FF6347' }}>
              Login
            </Link>
          </div>
           </form>
           
         </div>
         </Card>

         <div className={styles.img}>
        <img src={loaderImage} alt="img" width={500} />
        </div>
        
        </section>
  )
}
export default Register