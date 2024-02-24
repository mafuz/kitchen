import './Brand.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import React, { useState, useReducer, useEffect, useContext } from 'react';
import { getError } from '../../../screens/utils';
import Loader from '../../loader/Loader';
import Card from '../../card/Card';
import { Store } from '../../../Store';


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

function CreateBrand() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{  error, successDelete, categories }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const url = process.env.REACT_APP_DEV_BASE_URL;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');

  let [loading, setLoading] = useState(false);

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

  const saveBrand = async (e) => {
    e.preventDefault();
    //console.log(name, category);
    // if(!category){
    //   return toast.error("Please add Parent Category")
    // }
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${url}/api/addBrand`,
        {
          name,
          category
        }
      );
      setName('');
      toast.success('Brand Created Successful');
      setLoading(false);
    } catch (err) {
      toast.error(getError(err));
      //toast.error('Invalid username or password');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="--mb2">
        {loading && <Loader />}
        <h3>Create Brand</h3>
        <p>
          Use this form to <b>Create a Brand.</b>
        </p>
        <Card cardClass={'card'}>
          <br />
          <form onSubmit={saveBrand}>
            <label>Brand Name:</label>
            <input
              type="text"
              placeholder="Category name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>Parent Category:</label>
            <select
              name="category"
              value={category}
              className="form-control"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Select category</option>
              {categories?.length > 0 &&
                categories?.map((cat) => (
                  <option key={cat?.category_id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
            </select>
            <div className="--my">
              <button type="submit" className="--btn --btn-primary">
                Save Button
              </button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

export default CreateBrand;
