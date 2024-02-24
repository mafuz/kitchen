import "./Brand.scss";
import React, {
  useContext,
  useEffect,
  useReducer,
  useState
} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Store } from '../../../Store';
import { getError } from '../../../screens/utils';
import { FaTrashAlt } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Loader from "../../loader/Loader";
import MessageBox from "../../MessageBox";


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, brands: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function BrandList() {


  
  const { state } = useContext(Store);
  const { userInfo } = state; 
  const [{  error, successDelete, brands}, dispatch] = useReducer(
      reducer,
      {
          
        loading: true,
        error: '',
      }
    );

    const url = process.env.REACT_APP_DEV_BASE_URL;

    let [loading, setLoading] = useState(false);

  useEffect(() => {      
      const fetchBrands = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          setLoading(true);
          const { data } = await axios.get(
            `${url}/api/brands`,
            {
              headers: { authorization: 'Bearer ' + userInfo.token },
            }
          );
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
          setLoading(false);
        } catch (err) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
          setLoading(false);
        }
      };
      
      fetchBrands();
      // forceUpdate();
    }, [brands]);


    
    const deleteBran = async (brand_id) => {
           
      try {
        await axios.delete(
           `${url}/api/brand/` + brand_id
        );
        toast.success('Brand deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      } 

  };



  const confirmDelete  = (brand_id) => {
    confirmAlert({
      title: 'Delete Brand',
      message: 'Are sure you want to delete Brand?.',
      buttons: [
        {
          label: 'Delete',
          onClick: () => deleteBran(brand_id)
        },
        {
          label: 'Cancel',
         // onClick: () => alert('Click No')
        }
      ]
    });
  };
 

return  (
<div className="--mb2">
{/* {loading && <Loader />} */}

    <h3>All Categories</h3>
    <div className="table">
        {brands?.length === 0 ? (
               <p>No Brand Found</p>
        ) : (
         <table>
            <thead>
                <tr>
                    <th>s/n</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
            {brands?.map((brand, index) => {
                const {brand_id, name, category, slug} = brand
            return(
                
                <tr key={brand_id}>
                      
                    <td>{index + 1}</td>
                    <td>{name}</td>
                    <td>{category}</td>
                    <td>
                        <span>
                            <FaTrashAlt size={20} color={"red"}
                            onClick={() => confirmDelete(brand_id)} />
                        </span>
                    </td>
                </tr>
            )
            }
            )}
            </tbody>
         </table>
        )} 

    </div>
</div>
)
}

export default BrandList