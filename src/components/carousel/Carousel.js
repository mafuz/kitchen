import React, { useContext, useEffect, useReducer, useState } from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { responsive } from './data';
import { Store } from '../../Store';
import axios from 'axios';
import { getError } from '../../screens/utils';



function ProductCarousel({products}) {



  return (
    <div>
    
        <Carousel 
         showDots={false}
         responsive={responsive}
         infinite={true}
         autoPlay={ true }
         autoPlaySpeed={3000}
         customTransition="all 500ms ease"
         transitionDuration={1000}
        >
        {products}
        </Carousel>

    </div>
  )
}

export default ProductCarousel