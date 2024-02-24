import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import './Usertable.scss';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { AiOutlineEye } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getError } from '../../screens/utils';
import { Store } from '../../Store';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// import {
//   deleteProduct,
//   getProducts,
// } from "../../../redux/features/product/productSlice";
import Search from '../search/Search';
// import { Spinner } from "../../loader/Loader";
import { shortenText } from '../../utils';
import Loader, { Spinner } from '../loader/Loader';
import MessageBox from '../MessageBox';
// import { selectIsLoggedIn } from "../../../redux/features/auth/authSlice";
// import {
//   FILTER_BY_SEARCH,
//   selectFilteredProducts,
// } from "../../../redux/features/product/filterSlice";

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, users: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, users: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

      return { ...state, loadingCreateReview: false };
     
    default:
      return state;
  }
};

const UserTable = (props) => {
  const { user } = props;
  const navigate = useNavigate();

  const [{ error, users, customer }, dispatch] = useReducer(reducer, {
    users: [],
    
    loading: true,
    error: '',
  });

  const url = process.env.REACT_APP_DEV_BASE_URL;

  const { state } = useContext(Store);
  const { userInfo } = state;

  // const id = userInfo.id;

  let [loading, setLoading] = useState(false);

  const [instocks, setInstock] = useState([]);
  // const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  // const isLoggedIn = useSelector(selectIsLoggedIn);
  // const { products, isLoading, isError, message } = useSelector(
  //   (state) => state.product
  // );
  // const filteredProducts = useSelector(selectFilteredProducts);
  // console.log(filteredProducts);

  // useEffect(() => {
  //   if (isLoggedIn === true) {
  //     dispatch(getProducts());
  //   }

  //   if (isError) {
  //     console.log(message);
  //   }
  // }, [isLoggedIn, isError, message, dispatch]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${url}/api/users`, {
        headers: { authorization: 'Bearer ' + userInfo.token },
      });
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
      setLoading(false);
    } catch (err) {
      //console.log(err);
      toast.error(getError(error));
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [userInfo]);

  // const delProduct = async (id) => {
  //   console.log(id);
  //   await dispatch(deleteProduct(id));
  //   await dispatch(getProducts());
  // };

 

  const confirmDelete = (product_id) => {
    confirmAlert({
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product.',
      buttons: [
        {
          label: 'Delete',
          // onClick: () => delProduct(product_id),
        },
        {
          label: 'Cancel',
          // onClick: () => alert('Click No')
        },
      ],
    });
  };

  // Begin Pagination
  const itemsPerPage = 10;
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = users.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(users.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % users.length;
    setItemOffset(newOffset);
  };
  // End Pagination

  // useEffect(() => {
  //   dispatch(FILTER_BY_SEARCH({ products, search }));
  // }, [products, search, dispatch]);

  return (
    <div className="product-list">
       <pre>{JSON.stringify()}</pre> 
      {/* {loading && <Loader />} */}
      <div className="table">
        <div className="--flex-between --flex-dir-column">
          <span>
            <h3>All Userss</h3>
            <p>
              {' '}
              ~ <b>{users.length} Customer(s) Found</b>{' '}
            </p>
          </span>
          <span>
            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </span>
        </div>

        {/* {loading && <Loader />} */}

        <div className="table">
          {/* {!loading && products.length === 0 ? (
            <p>-- No product found...</p>
          ) : ( */}
          {loading ? (
            <Loader></Loader>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentItems?.map((user, index) => {
                  const { id, username, phone, email, address, roles } = user;
                  return (
                    <tr key={id}>
                      <td>{itemOffset + index + 1}</td>
                      <td>{shortenText(username, 16)}</td>
                      <td>{phone}</td>
                      <td>{email}</td>
                      <td>{address}</td>
                      <td>{roles}</td>

                      <td className="icons">
                        <span>
                          <Link to={`/admin/single-user/${id}`}>
                            <AiOutlineEye size={25} color={'purple'} />
                          </Link>
                        </span>
                        {/* <span>
                          <Link to={`/admin/edit-product/${product_id}`}>
                            <FaEdit size={20} color={'green'} />
                          </Link>
                        </span> */}
                        <span>
                          <FaTrashAlt
                            size={20}
                            color={'red'}
                            onClick={() => confirmDelete(id)}
                          />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel="Prev"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="activePage"
        />
      </div>
    </div>
  );
};

export default UserTable;
