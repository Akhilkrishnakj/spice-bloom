import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from './wishlistSlice';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});

export default store;
