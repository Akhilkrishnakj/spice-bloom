import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
       if( existingItem.quantity < 10) { // Limit quantity to 10
          existingItem.quantity += 1; // Increment quantity if item already exists
        }
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      return state.filter(item => item.id !== action.payload.id);
    },
    decreaseQuantity: (state, action) => {
      const item = state.find(item => item.id === action.payload.id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        return state.filter(i => i.id !== action.payload.id);
      }
    }
  }
});

export const { addToCart, removeFromCart, decreaseQuantity } = cartSlice.actions;
export default cartSlice.reducer;
