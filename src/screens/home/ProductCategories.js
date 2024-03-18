import React from "react";
import "./ProductCategory.scss";
import { useNavigate } from "react-router-dom";

// https://i.ibb.co/fNkBYgr/c3.jpg
// https://i.ibb.co/5GVkd3m/c1.jpg
// https://i.ibb.co/nQKLjrW/c2.jpg

const categories = [
  {
    id: 1,
    title: "Wrist Watch",
    image: "https://i.ibb.co/XYgQCQz/c1.jpg",
  },
  {
    id: 2,
    title: "Women Fashion",
    image: "https://i.ibb.co/zNSrLbJ/c2.jpg",
  },
  {
    id: 3,
    title: "Men Fashion",
    image: "https://i.ibb.co/DWTsk2W/c3.jpg",
  },
];

const Category = ({ title, image }) => {
  const navigate = useNavigate();
  return (
    <div className="category">
      <h3>{title}</h3>
      <img src={image} alt="img" />
      <button className="--btn" onClick={() => navigate("/shop")}>
        {"Shop Now >>>"}
      </button>
    </div>
  );
};

const ProductCategory = () => {
  return (
    <div className="categories">
      {categories.map((cat) => {
        return (
          <div key={cat.id} className="--flex-center">
            <Category title={cat.title} image={cat.image} />
          </div>
        );
      })}
    </div>
  );
};

export default ProductCategory;
