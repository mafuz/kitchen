import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  fullBox: false,
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
    couponItem: localStorage.getItem('couponItem')
      ? JSON.parse(localStorage.getItem('couponItem'))
      : null,

  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : { location: {} },
      billingAddress: localStorage.getItem('billingAddress')
      ? JSON.parse(localStorage.getItem('billingAddress'))
      : { location: {} },
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
      // paymentCoupon: localStorage.getItem('paymentCoupon')
      // ? localStorage.getItem('paymentCoupon')
      // : '',
      
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};
function reducer(state, action) {
  switch (action.type) {
    case 'SET_FULLBOX_ON':
      return { ...state, fullBox: true };
    case 'SET_FULLBOX_OFF':
      return { ...state, fullBox: false };

    case 'CART_ADD_ITEM':
      // add to cart
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.product_id === newItem.product_id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.product_id === existItem.product_id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.product_id !== action.payload.product_id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        couponItem: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          billingAddress: {},
          paymentMethod: '',
          
          
        },
      };
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case 'SAVE_SHIPPING_ADDRESS_MAP_LOCATION':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            location: action.payload,
          },
        },
      };

      case 'SAVE_BILLING_ADDRESS':
        return {
          ...state,
          cart: {
            ...state.cart,
            billingAddress: action.payload,
          },
        };
      case 'SAVE_BILLING_ADDRESS_MAP_LOCATION':
        return {
          ...state,
          cart: {
            ...state.cart,
            billingAddress: {
              ...state.cart.billingAddress,
              location: action.payload,
            },
          },
        };

    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };

     
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
