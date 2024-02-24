import React, { useContext, useEffect, useReducer, useState } from 'react';
import Slider from '../../components/slider/Slider';
import './Home.scss';
import HomeInfoBox from './HomeInfoBox';
import { productData } from '../../components/carousel/data';
import { CarouselItem } from '../../components/carousel/CarouselItem';
import { CarouseCategorylItem } from '../../components/carousel/CarouseCategorylItem';
import ProductCarousel from '../../components/carousel/Carousel';
import ProductCategories from './ProductCategories';
import FooterLinks from '../../components/footer/FooterLinks';
import axios from 'axios';
import { getError } from '../../screens/utils';
import { Store } from '../../Store';
import ProductCategoryCarousel from '../../components/carousel/CarouselCategory';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CATEGORY_REQUEST':
      return { ...state, loading: true };
    case 'CATEGORY_SUCCESS':
      return {
        ...state,
        categorys: action.payload,
        loading: false,
      };
    case 'CATEGORY_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const PageHeading = ({ heading, btnText }) => {
  return (
    <>
      <div className="--flex-between">
        <h2 className="--fw-thin">{heading}</h2>
        <button className="--btn">{btnText}</button>
      </div>
      <div className="--hr"></div>
    </>
  );
};

function HomeScreen() {
  const [{ loading, products, categorys, error }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      products: [],
      categorys: [],
      error: '',
    }
  );

  const { state } = useContext(Store);
  const { userInfo } = state;

  const url = process.env.REACT_APP_DEV_BASE_URL;
  // console.log('helloooo' + url);

  useEffect(() => {
    const fetchpieData = async () => {
      try {
        const { data } = await axios.get(
          `${url}/api/products/latest`,
          {
            // headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchpieData();
  }, []);
  const prods = products.map((item) => (
    <div key={item.product_id}>
      <CarouselItem
        product_id={item.product_id}
        name={item.p_name}
        url={item.images[0]}
        price={item.price}
        description={item.description.substring(3)}
        quantity={item.quantity}
      />
    </div>
  ));

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await axios.get(
          `${url}/api/products/cate`,
          {
            // headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'CATEGORY_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'CATEGORY_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchCategory();
  }, []);

  console.log(categorys);

  const category = categorys?.map((item) => (
    <div key={item.product_id}>
      <CarouseCategorylItem
        product_id={item.product_id}
        name={item.p_name}
        url={item.images[0]}
        price={item.price}
        description={item.description.substring(3)}
        quantity={item.quantity}
      />
    </div>
  ));
  return (
    <>
      <div>
        <Slider />
        <section>
          <div className="container">
            <HomeInfoBox />
            <PageHeading heading={'Latest Products'} btnText={'Shop Now>>>'} />
            <ProductCarousel products={prods} />
          </div>
        </section>
        <section className="--bg-gray">
          <div className="container">
            <h3>Categories</h3>
            <ProductCategories />
          </div>
        </section>
        <section>
          <div className="container">
            <HomeInfoBox />
            <PageHeading heading={'Shear Butter'} btnText={'Shop Now>>>'} />
            <ProductCategoryCarousel categorys={category} />
          </div>
        </section>
        <FooterLinks />
      </div>
    </>
  );
}

export default HomeScreen;
