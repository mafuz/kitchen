import React, { useState, useReducer, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../loader/Loader';
import axios from 'axios';

import { getError } from '../../../screens/utils';
import { Store } from '../../../Store';

//import './ProductForm.scss';
import Card from '../../card/Card';
import UploadWidget from '../addProduct/UploadWidget';
import { BsTrash } from 'react-icons/bs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import MessageBox from '../../MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        product: action.payload,
        categories: action.payload,
        brands: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function EditProduct() {
  const { id } = useParams();


  const navigate = useNavigate();

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, successDelete, product }, dispatch] = useReducer(
    reducer,
    {
      product: {},
      //loading: true,
      error: '',
    }
  );

  const url = process.env.REACT_APP_DEV_BASE_URL;

  const prodt = product[0];
  const imgs = prodt?.images;
 
  let  myImgs = []

  imgs?.forEach(element => {
    myImgs.push(element)
  });


  
  const [imagePreview, setImagePreview] = useState([]);

  //const { categories, brands } = useSelector((state) => state.category);

  const [product_id, setProductId] = useState('');
  const [p_name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [color, setColor] = useState('');
  const [regular_price, setRegularPrice] = useState('');
  const [files, setFiles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

 

	// useEffect(()=>{
  //   if (imgs?.length < 1) {
  //     setFiles(imgs);
  //   }
	// }, [imgs]);

  useEffect(()=>{

  if (prodt && myImgs) {
    setFiles(myImgs);
  }
}, [prodt]);


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
        setCategories(data);
        // dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchCategries();
    // forceUpdate();
  }, [categories]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data } = await axios.get(`${url}/api/brands`);
        setBrands(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `${url}/api/product/` + id,
          {
            headers: { authorization: 'Bearer ' + userInfo },
          }
        );
        const prod = data[0];

        dispatch({ type: 'FETCH_SUCCESS', payload: data });

        setProductId(prod.product_id);
        setName(prod.p_name);
        setSlug(prod?.slug);
        setDescription(prod.description);
        setPrice(prod.price);
        //setImages(imgs);
        setCategory(prod?.category);
        setBrand(prod?.brand);
        setQuantity(prod?.quantity);
        setColor(prod.color);
        setRegularPrice(prod.regular_price);

        // dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [id]);

  const updateProduct = async (e) => {
    e.preventDefault();
   
    if (files?.length < 1) {
      return toast.info("Please add an image");
    }

    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `${url}/api/productUpdate/` + id,
        {
          product_id,
          p_name,
          price,
          images: files,
          brand,
          description,
          quantity,
          category,
          color,
          regular_price,
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Product updated successfully');
      navigate('/admin/all-products');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  //---Filder brand base on Category-----

  const [filteredBrands, setFilteredBrands] = useState([]);
  function filterBrands(selectedCategoryName) {
    const newBrands = brands?.filter(
      (brand) => brand?.category === selectedCategoryName
    );
    setFilteredBrands(newBrands);
  }

  useEffect(() => {
    filterBrands(category);
    // console.log(filteredBrands);
  }, [category]);

  // const saveProduct = async (e) => {
  //   e.preventDefault();
  //   if (files.length < 1) {
  //     return toast.info('Please add an image');
  //   }
  // };
 
  const removeImage = (image) => {
    console.log(image);
    setFiles(files.filter((img, index) => img !== image));
  };

  return (
    <section>
      <div className="container">
        {/* <prev>{JSON.stringify(files)} </prev> */}

        {/* {loading && <Loader />}   */}

        <h3 className="--mt">Add New Product</h3>
        <div className="add-product">
          <UploadWidget files={files} setFiles={setFiles} />

          <Card cardClass={'card'}>
            <br />
            <form onSubmit={updateProduct}>
              <label>Product Images:</label>
              <div className="slide-container">
                <aside>
                  {files?.length > 0 &&
                    files?.map((image) => (
                      <div key={image} className="thumbnail">
                        <img src={image} alt="productImage" height={100} />
                        <div>
                          <BsTrash
                            size={15}
                            className="thumbnailIcon"
                            onClick={() => removeImage(image)}
                          />
                        </div>
                      </div>
                    ))}
                  {files?.length < 1 && (
                    <p className="--m">No image set for this poduct.</p>
                  )}
                </aside>
              </div>
              <br />
              {/* <hr />  */}
              <label>Product Name:</label>
              <input
                type="text"
                placeholder="Product name"
                name="p_name"
                value={p_name}
                onChange={(e) => setName(e.target.value)}
              />

              <label>Product Category:</label>
              <select
                name="category"
                value={category}
                className="form-control"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>{prodt?.category}</option>

                {categories?.length > 0 &&
                  categories?.map((cat) => (
                    <option key={cat.category_id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
              </select>

              <label>Product Brand:</label>
              <select
                name="brand"
                value={brand}
                className="form-control"
                onChange={(e) => setBrand(e.target.value)}
              >
                <option>{prodt?.brand}</option>

                {filteredBrands.length > 0 &&
                  filteredBrands.map((brand) => (
                    <option key={brand.brand_id} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
              </select>

              <label>Product Color:</label>
              <input
                type="text"
                placeholder="Color"
                name="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />

              <label>Regular Price:</label>
              <input
                type="number"
                placeholder="Regular Price"
                name="regular_price"
                value={regular_price}
                onChange={(e) => setRegularPrice(e.target.value)}
              />
              <label>Product Price:</label>
              <input
                type="number"
                placeholder="Product Price"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <label>Product Quantity:</label>
              <input
                type="number"
                placeholder="Product Quantity"
                name="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <label>Product Description:</label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                modules={EditProduct.modules}
                formats={EditProduct.formats}
              />

              <div className="--my">
                <button type="submit" className="--btn --btn-primary">
                  Save Product
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
      {/* )} */}
    </section>
  );
}

EditProduct.modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['clean'],
  ],
};
EditProduct.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'color',
  'background',
  'list',
  'bullet',
  'indent',
  'link',
  'video',
  'image',
  'code-block',
  'align',
];

export default EditProduct;
