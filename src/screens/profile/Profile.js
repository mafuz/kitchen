import PageMenu from '../../components/pageMenu/PageMenu';
import axios from 'axios';
import React, {
  useContext,
  useState,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { Store } from '../../Store';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import Card from '../../components/card/Card';

import './Profile.scss';
import Loader from '../../components/loader/Loader';

// import { AiOutlineCloudUpload } from 'react-icons/ai';

//import PdfDownload from '../components/PdfDownload';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, profile: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false };

    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    case 'UPLOAD_REQUEST':
      return {
        ...state,
        selectedFile: null,
        loadingUpload: true,
        errorUpload: '',
      };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        selectedFile: null,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

function Profile() {
  const [state1, setState] = useState({
    loading: false,
    loadingUpload: false,
    profile: [],
    errorMessage: '',
    groups: {},
  });

  const [{ profile, error }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const upload_preset = process.env.REACT_APP_UPLOAD_PRESET;

  const url = process.env.REACT_APP_DEV_BASE_URL;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [id, setId] = useState(userInfo?.id) || '';
  const [username, setUsername] = useState(userInfo?.username) || '';
  const [email, setEmail] = useState(userInfo?.email) || '';
  const [address, setAddress] = useState(userInfo?.address) || '';
  const [region, setRegion] = useState(userInfo?.region) || '';
  const [country, setCountry] = useState(userInfo?.country) || '';
  const [photo, setPhoto] = useState(null);
  const [phone, setPhone] = useState(userInfo?.phone) || '';

  //const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  let [loading, setLoading] = useState(false);

  const uploadFileHandler = async (e) => {
    setPhoto(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));

    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('upload_preset', upload_preset);
    try {
      setState({ ...state, loadingUpload: true });
      const { data } = await axios.post(
        'https://api.cloudinary.com/v1_1/mafuz-enterprise/image/upload',
        bodyFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setPhoto(data.secure_url);

      toast.success('Image uploaded successfully. click Create to apply it');

      //enqueueSnackbar('File uploaded successfully', { variant: 'success' });
    } catch (err) {
      setState({
        ...state,
        loadingUpload: false,
        errorMessage: err.message,
      });
      //dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      // enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(
          `${url}/api/user/` + userInfo.id
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        // console.log(result.data);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }

      //setProducts(result.data);
    };
    fetchData();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.put(
        `${url}/api/user/` + userInfo.id,
        {
          id,
          username,
          email,
          photo,
          phone,
          address,
          region,
          country,
        },
        {
          'Content-Type': 'application/json',
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      ctxDispatch({ type: 'UPDATE_REQUEST', payload: data });
      // localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully');
      setLoading(false);
    } catch (err) {
      dispatch({
        type: 'UPDATE_FAIL',
      });
      toast.error(getError(err));
      setLoading(false);
    }
  };

            //  {profile?.map((pro) => {
            //  const {id, username, email, firstname, lastname, roles, usertype, phone, photo, address, region, country, cartitems, balance, created_at, updated_at} = pro; 
            //  return(
            //   <>
            //   <div></div>
            //   </>
            //  )
            // })}

  return (
      
    <>
      <section>
        {/* {loadingDelete && <LoadingBox></LoadingBox>} */}
        {loading && <Loader />}
        {/*(
        <Loader></Loader>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : ( */}
    
        <div className="container">
         
          <PageMenu />
          <h2>Profile</h2>
         
          <div className="--flex-start profile">


            <Card cardClass={'card'}>
              <>
              
                <div className="profile-photo">
                  <div>
                    <img
                      src={
                        imagePreview === null ? userInfo?.photo : imagePreview
                      }
                      alt="profile"
                    />
                    {/* <h3>Role: {roles}</h3> */}
                    {/* {imagePreview !== null && (
                      <div className="--center-all">

                      <button className="--btn --btn-secondary">
                        <AiOutlineCloudUpload size={20} /> Upload Photo
                      </button>
                      </div>
                    )} */}
                  </div>
                </div>
                <form onSubmit={submitHandler}>
                {/* <pre>{JSON.stringify(username)}</pre> */}
                  <p>
                    <label>Change photo:</label>
                    <input
                      type="file"
                      accept="image/*"
                      name="image"
                      onChange={uploadFileHandler}
                    />
                  </p>

                  <p>
                    <label>Username:</label>
                    <input
                      type="text"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </p>
                  <p>
                    <label>Email:</label>
                    <input
                      type="text"
                      name="email"
                      value={email}
                      disabled
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </p>
                  <p>
                    <label>Phone:</label>
                    <input
                      type="text"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </p>
                  <p>
                    <label>Address:</label>
                    <input
                      type="text"
                      name="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </p>
                  <p>
                    <label>Region:</label>
                    <input
                      type="text"
                      name="region"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    />
                  </p>
                  <p>
                    <label>Country:</label>
                    <input
                      type="text"
                      name="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </p>
                  <button
                    type="submit"
                    className="--btn --btn-primary --btn-block"
                  >
                    Update Profile
                  </button>
                </form>
              </>
            </Card>
          {/* })} */}
          </div>
         
        </div>
       
        {/* )} */}
      </section>
    </>
  
  );
                 
}

export default Profile;
