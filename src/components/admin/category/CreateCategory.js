import React from 'react';
import Card from '../../card/Card';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState, useReducer } from 'react';
import { getError } from '../../../screens/utils';
import Loader from '../../loader/Loader';

function CreateCategory({ reloadCategory }) {
  const app_url = process.env.BACKEND_APP_URL;
  const url = process.env.REACT_APP_DEV_BASE_URL;

  const [name, setName] = useState('');

  let [loading, setLoading] = useState(false);

  const saveCategory = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${url}/api/addCategory`,
        {
          name,
        }
      );
      setName('');
      toast.success('Category Created Successful');
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
        <h3>Create Category</h3>
        <p>
          Use this form to <b>Create a Category.</b>
        </p>
        <Card cardClass={'card'}>
          <br />
          <form onSubmit={saveCategory}>
            <label>Category Name:</label>
            <input
              type="text"
              placeholder="Category name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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

export default CreateCategory;
