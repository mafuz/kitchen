import React from 'react'
import "./Brand.scss";
import CreateBrand from './CreateBrand'
import BrandList from './BrandList'

function Brand() {
  return (
    <section>
    <div className="container coupon">
        <CreateBrand  />
        <BrandList />
    </div>
</section>
  )
}

export default Brand