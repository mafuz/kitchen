import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
// import { categoryList, ratingList } from '../../../constants';
// import CheckboxProton from '../../common/CheckboxProton';
// import FilterListToggle from '../../common/FilterListToggle';
// import SliderProton from '../../common/SliderProton';
// import './styles.css';

const FilterPanel = ({

  price,
 
  changePrice,
}) => (
  <div>
  
    <div className='input-group'>
      <p className='label-range'>Price Range</p>
      <Slider value={price} changePrice={changePrice} />
    </div>
  
  </div>
);

export default FilterPanel;