import React from 'react';
import  "./Category.scss";
import CreateCategory from './CreateCategory';
import CategoryList from './CategoryList';


function Category() {


  return (
    <section>
        <div className="container coupon">
            <CreateCategory  />
            <CategoryList />
        </div>
    </section>
  )
}

export default Category