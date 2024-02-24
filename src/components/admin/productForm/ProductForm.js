// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import Card from "../../card/Card";
// import "./ProductForm.scss";
//  import UploadWidget from "./UploadWidget";
// import { BsTrash } from "react-icons/bs";
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import React, { useState, useReducer, useEffect, useContext } from 'react';
// import { getError } from '../../../screens/utils';
// import Loader from '../../loader/Loader';

// import { Store } from '../../../Store';

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'FETCH_REQUEST':
//       return { ...state, loading: true };
//     case 'FETCH_SUCCESS':
//       return { ...state, categories: action.payload, loading: false };
//     case 'FETCH_FAIL':
//       return { ...state, loading: false, error: action.payload };
//     default:
//       return state;
//   }
// };


// function ProductForm() {




  
//   const { state } = useContext(Store);
//   const { userInfo } = state;

  

 

 
//   return (
//     <div className="add-product">
      
//       <UploadWidget files={files} setFiles={setFiles} /> 

//       <Card cardClass={"card"}>
//         <br />
//         <form onSubmit={saveProduct}>
//           <label>Product Images:</label>
//           <div className="slide-container">
//             {/* <aside>
//               {files.length > 0 &&
//                 files.map((image) => (
//                   <div key={image} className="thumbnail">
//                     <img src={image} alt="productImage" height={100} />
//                     <div>
//                       <BsTrash
//                         size={15}
//                         className="thumbnailIcon"
//                         // onClick={() => removeImage(image)}
//                       />
//                     </div>
//                   </div>
//                 ))} */}
//               {/* {files.length < 1 && (
//                 <p className="--m">No image set for this poduct.</p>
//               )} 
//             </aside>*/}
//           </div>
//           <br />
//           <hr />
//           <label>Product Name:</label>
//           <input
//             type="text"
//             placeholder="Product name"
//             name="name"
//             value={product?.name}
//             onChange={handleInputChange}
//           />

//           <label>Product Category:</label>
//           <select
//             name="category"
//             value={product?.category}
//             className="form-control"
//             onChange={handleInputChange}
//           >
//              {isEditing ? (
//               <option>{product?.category}</option>
//             ) : (
//               <option>Select Category</option>
//             )}
//             {categories?.length > 0 &&
//               categories?.map((cat) => (
//                 <option key={cat.category_id} value={cat.name}>
//                   {cat.name}
//                 </option>
//               ))}  
//           </select>

//           {/* <input
//             type="text"
//             placeholder="Product Category"
//             name="category"
//             value={product?.category}
//             onChange={handleInputChange}
//           /> */}

//           <label>Product Brand:</label>
//           <select
//             name="brand"
//             value={product?.brand}
//             className="form-control"
//             onChange={handleInputChange}
//           >
//             {/* {isEditing ? (
//               <option>{product?.brand}</option>
//             ) : (
//               <option>Select Brand</option>
//             )}

//             {filteredBrands.length > 0 &&
//               filteredBrands.map((brand) => (
//                 <option key={brand._id} value={brand.name}>
//                   {brand.name}
//                 </option>
//               ))} */}
//           </select>
//           {/* <input
//             type="text"
//             placeholder="Brand"
//             name="brand"
//             value={product?.brand}
//             onChange={handleInputChange}
//           /> */}
//           <label>Product Color:</label>
//           <input
//             type="text"
//             placeholder="Color"
//             name="color"
//             value={product?.color}
//             onChange={handleInputChange}
//           />

//           <label>Regular Price:</label>
//           <input
//             type="text"
//             placeholder="Regular Price"
//             name="regularPrice"
//             value={product?.regularPrice}
//             onChange={handleInputChange}
//           />
//           <label>Product Price:</label>
//           <input
//             type="text"
//             placeholder="Product Price"
//             name="price"
//             value={product?.price}
//             onChange={handleInputChange}
//           />

//           <label>Product Quantity:</label>
//           <input
//             type="text"
//             placeholder="Product Quantity"
//             name="quantity"
//             value={product?.quantity}
//             onChange={handleInputChange}
//           />

//           <label>Product Description:</label>
//           <ReactQuill
//             theme="snow"
//             value={description}
//             onChange={setDescription}
//             modules={ProductForm.modules}
//             formats={ProductForm.formats}
//           /> 

//           <div className="--my">
//             <button type="submit" className="--btn --btn-primary">
//               Save Product
//             </button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// };
// export default ProductForm

