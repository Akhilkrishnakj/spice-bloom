import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.find(item => item._id === newItem._id || item.id === newItem.id);
      
      if (existingItem) {
        // If item already exists, increase quantity (respecting max limit)
        const newQuantity = existingItem.quantity + (newItem.quantity || 1);
        if (newQuantity <= 10) {
          existingItem.quantity = newQuantity;
        }
        // If quantity exceeds 10, don't add more
      } else {
        // Add new item with quantity
        state.push({ 
          ...newItem, 
          quantity: newItem.quantity || 1 
        });
      }
    },
    removeFromCart: (state, action) => {
      return state.filter(item => item._id !== action.payload._id && item.id !== action.payload.id);
    },
    decreaseQuantity: (state, action) => {
      const item = state.find(item => item._id === action.payload._id || item.id === action.payload.id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        return state.filter(i => i._id !== action.payload._id && i.id !== action.payload.id);
      }
    },
    updateQuantity: (state, action) => {
      const { _id, quantity } = action.payload;
      const item = state.find(item => item._id === _id || item.id === _id);
      if (item) {
        if (quantity <= 0) {
          return state.filter(i => i._id !== _id && i.id !== _id);
        } else if (quantity <= 10) {
          item.quantity = quantity;
        }
      }
    },
    clearCart: () => {
      return [];
    }
  }
});

export const { addToCart, removeFromCart, decreaseQuantity, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
