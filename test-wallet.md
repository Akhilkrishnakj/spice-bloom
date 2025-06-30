# Wallet Functionality Test Guide

## Prerequisites
1. Make sure your environment variables are set:
   ```
   RAZORPAY_KEY_ID=your_test_key_id
   RAZORPAY_KEY_SECRET=your_test_secret_key
   REACT_APP_RAZORPAY_KEY_ID=your_test_key_id
   ```

2. Start both backend and frontend servers

## Test Scenarios

### 1. Wallet Balance Check
- Navigate to `/wallet` page
- Verify wallet balance is displayed correctly
- Check if transaction history loads

### 2. Add Money to Wallet
- Click "Add Money" button
- Select an amount (e.g., ₹100)
- Complete Razorpay payment with test credentials
- Verify wallet balance updates
- Check transaction history

### 3. Wallet Payment for Orders
- Add items to cart
- Proceed to checkout
- Select "Spice Bloom Wallet" as payment method
- Verify balance check works
- Complete order with wallet payment
- Verify amount is deducted from wallet

### 4. Order Cancellation with Refund
- Create an order using wallet payment
- Cancel the order
- Verify refund is processed to wallet
- Check transaction history

### 5. Razorpay Order Cancellation
- Create an order using Razorpay payment
- Cancel the order
- Check if refund error is resolved

## Debug Information

### Backend Logs to Check
Look for these log messages in your backend console:

1. **Order Creation:**
   ```
   🔍 Payment Method: wallet/razorpay
   🔍 Payment Data: { ... }
   🔍 Order Payment Details: { ... }
   ```

2. **Order Cancellation:**
   ```
   🔍 Cancelling order with payment method: wallet/razorpay
   🔍 Order payment details: { ... }
   🔍 Refund amount: 1000
   ```

3. **Razorpay Refund:**
   ```
   🔍 Processing Razorpay refund for payment ID: pay_xxx
   ✅ Razorpay refund successful: rfnd_xxx
   ```

### Common Issues and Solutions

1. **"Failed to process payment refund"**
   - Check if Razorpay credentials are correct
   - Verify payment ID exists in order
   - Check if payment was actually made

2. **"Insufficient wallet balance"**
   - Add money to wallet first
   - Check wallet balance display

3. **"Invalid payment signature"**
   - Verify Razorpay webhook secret
   - Check payment verification logic

## Test Data

### Razorpay Test Credentials
- **Card Number:** 4111 1111 1111 1111
- **Expiry:** Any future date
- **CVV:** Any 3 digits
- **Name:** Any name

### Test Amounts
- Small: ₹100
- Medium: ₹500
- Large: ₹1000

## Expected Behavior

1. **Wallet Topup:**
   - Payment modal opens
   - Payment completes successfully
   - Wallet balance updates immediately
   - Transaction appears in history

2. **Wallet Payment:**
   - Balance check prevents overspending
   - Order created successfully
   - Amount deducted from wallet
   - Transaction recorded

3. **Order Cancellation:**
   - Order status changes to cancelled
   - Appropriate refund message shown
   - Wallet refund processed (if applicable)
   - Transaction recorded

## Troubleshooting

If you encounter issues:

1. **Check Browser Console** for frontend errors
2. **Check Backend Logs** for detailed error messages
3. **Verify Environment Variables** are set correctly
4. **Test with Different Payment Methods** to isolate issues
5. **Check Database** for transaction records

## Support

If issues persist, provide:
- Backend console logs
- Frontend console logs
- Steps to reproduce
- Payment method used
- Order details 