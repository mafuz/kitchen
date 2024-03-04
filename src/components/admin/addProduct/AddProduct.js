import "./AddProduct.scss";
import axios from 'axios';
import React, { useState, useReducer, useEffect, useContext } from 'react';
import { getError } from '../../../screens/utils';
import { Store } from '../../../Store';
import { useSelector } from 'react-redux';
import './ProductForm.scss';
import Card from '../../card/Card';
import UploadWidget from './UploadWidget';
import { BsTrash } from "react-icons/bs";

import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Loader from '../../loader/Loader';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
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

function AddProduct() {
  const params = useParams(); // /product/:id
  const { id: productId } = params;
  const navigate = useNavigate();

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ error, successDelete, categories}, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: '',
    }
  );
const url = process.env.REACT_APP_DEV_BASE_URL;
  
  let [loading, setLoading] = useState(false);

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
  //const { name, category, brand, price, quantity, color, regularPrice } = product;

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

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        
        const { data } = await axios.get(
          `${url}/api/brands`
        );
        setBrands(data);
      
      } catch (err) {
        toast.error(getError(err));

      }
    };
    fetchBrands();
  }, []);

//-----Gennetating SKU------

const generateKSKU = (category) => {
    const letter = category.slice(0, 3).toUpperCase();
    const number = Date.now();
    const sku = letter + "-" + number;
    return sku;
  };

  const removeImage = (image) => {
    console.log(image);
    setFiles(files.filter((img, index) => img !== image));
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

  const saveProduct = async (e) => {
    e.preventDefault();

    if (files.length < 1) {
        return toast.info("Please add an image");
    }
      
     if (!Number(quantity)) {
 return toast.info("Please add Quantity");;
 }

    if (!Number(price)) {
 return toast.info("Please add Price");;
 }

    try {
        setLoading(true);
      const { data } = await axios.post(`http://localhost:4000/api/newproduct`, {
        p_name,
        sku: generateKSKU(category),
        price,
        images: files,
        brand,
        description,
        quantity,
        category,
        color,
        regular_price,
        
      });
      dispatch({ type: 'PRODUCT_SUCCESS', payload: data });

      toast.success('Product created successful');
      setLoading(false);
      navigate('/admin/all-products');
    } catch (err) {
      toast.error(getError(err));
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {};

  return (
    <section>
        {/* <pre>{JSON.stringify(files)}</pre>  */}
      <div className="container">
        {loading && <Loader />}
        <h3 className="--mt">Add New Product</h3>
        <div className="add-product">
          <UploadWidget files={files} setFiles={setFiles} />

          <Card cardClass={'card'}>
            <br />
            <form onSubmit={saveProduct}>
                <label>Product Images:</label>
              <div className="slide-container">
               <aside>
              {files.length > 0 &&
                files.map((image) => (
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
                 {files.length < 1 && (
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
                <option>Select Category</option>

                {categories?.length > 0 &&
                  categories?.map((cat) => (
                    <option key={cat.category_id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
              </select>

              {/* <input
            type="text"
            placeholder="Product Category"
            name="category"
            value={product?.category}
            onChange={handleInputChange}
          /> */}

              <label>Product Brand:</label>
              <select
                name="brand"
                value={brand}
                className="form-control"
                onChange={(e) => setBrand(e.target.value)}
              >
             
              <option>Select Brand</option>
            
                {filteredBrands?.length > 0 &&
                  filteredBrands?.map((bran) => (
                    <option key={bran.brand_id} value={bran.name}>
                      {bran.name}
                    </option>
                  ))}
              </select>
              {/*  <select
                name="brand"
                value={brand}
                className="form-control"
                onChange={handleInputChange}
              >
                 {isEditing ? (
              <option>{product?.brand}</option>
            ) : (
              <option>Select Brand</option>
            )}

            {filteredBrands.length > 0 &&
              filteredBrands.map((brand) => (
                <option key={brand._id} value={brand.name}>
                  {brand.name}
                </option>
              ))} 
              </select>*/}
              {/* <input
            type="text"
            placeholder="Brand"
            name="brand"
            value={product?.brand}
            onChange={handleInputChange}
          /> */}
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
                 modules={AddProduct.modules}
                 formats={AddProduct.formats}
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
    </section>
  );
}


AddProduct.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
};
AddProduct.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "video",
  "image",
  "code-block",
  "align",
];

export default AddProduct;
