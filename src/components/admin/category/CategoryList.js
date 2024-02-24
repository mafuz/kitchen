import React, {
    useContext,
    useEffect,
    useReducer,
  } from 'react';
  import axios from 'axios';
  import { toast } from 'react-toastify';
import { Store } from '../../../Store';
import { getError } from '../../../screens/utils';
import { FaTrashAlt } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

  
  const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return { ...state, categories: action.payload, loading: false };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  

function CategoryList() {

   

    const { state } = useContext(Store);
    const { userInfo } = state; 
    const [{ loading, error, successDelete, categories}, dispatch] = useReducer(
        reducer,
        {
            
          loading: true,
          error: '',
        }
      );
      const url = process.env.REACT_APP_DEV_BASE_URL;
      
    useEffect(() => {      
        const fetchCategries = async () => {
          try {
            dispatch({ type: 'FETCH_REQUEST' });
            const { data } = await axios.get(
              `${url}/api/categories`,
              {
                headers: { authorization: 'Bearer ' + userInfo.token },
              }
            );
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
          } catch (err) {
            dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
          }
        };
        
        fetchCategries();
        // forceUpdate();
      }, [categories]);


      const deleteCat = async (category_id) => {
           
          try {
            await axios.delete(
               `${url}/api/category/` + category_id
            );
            toast.success('Category deleted successfully');
            dispatch({ type: 'DELETE_SUCCESS' });
          } catch (err) {
            toast.error(getError(error));
            dispatch({
              type: 'DELETE_FAIL',
            });
          } 
    
      };


      const confirmDelete  = (category_id) => {
        confirmAlert({
          title: 'Delete Category',
          message: 'Are sure you want to delete Category?.',
          buttons: [
            {
              label: 'Delete',
              onClick: () => deleteCat(category_id)
            },
            {
              label: 'Cancel',
             // onClick: () => alert('Click No')
            }
          ]
        });
      };
     
  
  return (
    <div className="--mb2">
       
   
        <h3>All Categories</h3>
        <div className="table">
            {categories?.length === 0 ? (
                   <p>No Category Found</p>
            ) : (
             <table>
                <thead>
                    <tr>
                        <th>s/n</th>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {categories?.map((category, index) => {
                    const {category_id, name, slug} = category
                return(
                    
                    <tr key={category_id}>
                          
                        <td>{index + 1}</td>
                        <td>{name}</td>
                        <td>
                            <span>
                                <FaTrashAlt size={20} color={"red"}
                                onClick={() => confirmDelete(category_id)} />
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

export default CategoryList