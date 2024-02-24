import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import './ViewProducts.scss';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { AiOutlineEye } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getError } from '../../../screens/utils';
import { Store } from '../../../Store';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// import {
//   deleteProduct,
//   getProducts,
// } from "../../../redux/features/product/productSlice";
import Search from '../../search/Search';
// import { Spinner } from "../../loader/Loader";
import { shortenText } from '../../../utils';
import Loader, { Spinner } from '../../loader/Loader';
import MessageBox from '../../MessageBox';
// import { selectIsLoggedIn } from "../../../redux/features/auth/authSlice";
// import {
//   FILTER_BY_SEARCH,
//   selectFilteredProducts,
// } from "../../../redux/features/product/filterSlice";

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, products: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ViewProducts = (props) => {
  const { product } = props;
  const navigate = useNavigate();

  const [{ error, products }, dispatch] = useReducer(reducer, {
    products: [],

    loading: true,
    error: '',
  });

  const url = process.env.REACT_APP_DEV_BASE_URL;

  const { state } = useContext(Store);
  const { userInfo } = state;

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
      const { data } = await axios.get(`${url}/api/products`, {
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

  const delProduct = async (product_id) => {
    try {
      setLoading(true);
      await axios.delete(`${url}/api/product/` + product_id);
      toast.success('Product deleted successfully');
      dispatch({ type: 'DELETE_SUCCESS' });
      setLoading(false);
      navigate('/admin/all-products');
    } catch (err) {
      toast.error(getError(error));
      setLoading(false);
      dispatch({
        type: 'DELETE_FAIL',
      });
    }
  };

  const confirmDelete = (product_id) => {
    confirmAlert({
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product.',
      buttons: [
        {
          label: 'Delete',
          onClick: () => delProduct(product_id),
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
  const currentItems = products.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(products.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    setItemOffset(newOffset);
  };
  // End Pagination

  // useEffect(() => {
  //   dispatch(FILTER_BY_SEARCH({ products, search }));
  // }, [products, search, dispatch]);

  return (
    <div className="product-list">
      {/* <pre>{JSON.stringify(instocks)}</pre> */}
      {/* {loading && <Loader />} */}
      <div className="table">
        <div className="--flex-between --flex-dir-column">
          <span>
            <h3>All Products</h3>
            <p>
              {' '}
              ~ <b>{products.length} Product(s) Found</b>{' '}
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
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Value</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentItems?.map((product, index) => {
                  const { product_id, p_name, category, price, quantity } = product;
                  return (
                    <tr key={product_id}>
                      <td>{itemOffset + index + 1}</td>
                      <td>{shortenText(p_name, 16)}</td>
                      <td>{category}</td>
                      <td>
                        {'GHS'}
                        {price}
                      </td>
                      <td>{quantity}</td>
                      <td>
                        {'GHS'}
                        {price * quantity}
                      </td>
                      <td className="icons">
                        <span>
                          <Link to={`/product-details/${product_id}`}>
                            <AiOutlineEye size={25} color={'purple'} />
                          </Link>
                        </span>
                        <span>
                          <Link to={`/admin/edit-product/${product_id}`}>
                            <FaEdit size={20} color={'green'} />
                          </Link>
                        </span>
                        <span>
                          <FaTrashAlt
                            size={20}
                            color={'red'}
                            onClick={() => confirmDelete(product_id)}
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

export default ViewProducts;
