import React from 'react';

const Invoice = ({ order }) => {
  if (!order) return null;
  // Company info
  const company = {
    name: 'Spice Bloom',
    address: 'Spice Bloom pvt nedumkandam,Idukki, Kerala, India',
    email: 'support@spicebloom.com',
    phone: '+91 98765 43210',
  };
  // Customer info
  const customer = order.shippingAddress || {};
  let paymentStatus = 'Paid';
  if (order.paymentMethod === 'cod') {
    paymentStatus = order.status?.toLowerCase() === 'delivered' ? 'Paid' : 'Pending';
  } else if (order.payment && order.payment.status) {
    paymentStatus = order.payment.status === 'paid' ? 'Paid' : 'Pending';
  }
  const invoiceNumber = order.orderNumber ? `#INV-${order.orderNumber}` : '';
  const invoiceDate = order.date ? new Date(order.date).toLocaleDateString() : '';
  const paymentMethod = order.paymentMethod || 'N/A';
  const discount = order.discount || 0;
  const wallet = order.walletApplied || 0;
  const subtotal = order.subtotal || 0;
  const shipping = order.shipping || 0;
  const tax = order.tax || 0;
  const grandTotal = subtotal + shipping + tax - discount - wallet;

  return (
    <div className="bg-white text-slate-900 max-w-2xl mx-auto p-8 rounded-lg shadow-lg print:shadow-none print:rounded-none print:p-0 print:bg-white print:max-w-full print:w-full print:text-black font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-6 print:mb-2">
        <div className="flex items-center gap-4">
          <span className="text-3xl font-extrabold tracking-tight text-emerald-600">{company.name}</span>
          <div className="hidden md:block">
            <p className="text-xs text-slate-600">{company.address}</p>
            <p className="text-xs text-slate-600">{company.email} | {company.phone}</p>
          </div>
        </div>
        <div className="text-right text-xs">
          <span className="font-bold text-lg text-emerald-700">INVOICE</span>
        </div>
      </div>

      {/* Invoice Info & Bill To */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 print:mb-2">
        <div>
          <h2 className="font-semibold text-slate-800 mb-1">Invoice Info</h2>
          <div className="text-xs space-y-1">
            <div><span className="font-medium">Invoice #:</span> {invoiceNumber}</div>
            <div><span className="font-medium">Invoice Date:</span> {invoiceDate}</div>
            <div><span className="font-medium">Purchase Date:</span> {order.date ? new Date(order.date).toLocaleDateString() : (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-')}</div>
            <div><span className="font-medium">Order ID:</span> {order.orderNumber}</div>
            <div><span className="font-medium">Payment Status:</span> <span className="text-green-600 font-bold">{paymentStatus}</span></div>
            <div><span className="font-medium">Payment Method:</span> {paymentMethod}</div>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-slate-800 mb-1">Bill To</h2>
          <div className="text-xs space-y-1">
            <div><span className="font-medium">Name:</span> {customer.name}</div>
            <div><span className="font-medium">Email:</span> {order.buyer?.email || '-'}</div>
            <div><span className="font-medium">Phone:</span> {order.buyer?.phone || '-'}</div>
            <div><span className="font-medium">Address:</span> {customer.street}, {customer.city}, {customer.state} {customer.zip}, {customer.country}</div>
          </div>
        </div>
      </div>

      {/* Order Summary Table */}
      <div className="mb-6 print:mb-2">
        <h2 className="font-semibold text-slate-800 mb-2">Order Summary</h2>
        <table className="w-full border text-xs print:text-xs">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items && order.items.map((item, idx) => (
              <tr key={idx} className="text-center">
                <td className="p-2 border">
                  <img src={item.image} alt={item.name} className="h-12 w-12 object-contain mx-auto rounded print:h-10 print:w-10" />
                </td>
                <td className="p-2 border text-left">{item.name}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">₹{item.price.toFixed(2)}</td>
                <td className="p-2 border">₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="flex flex-col items-end mb-6 print:mb-2">
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-sm mb-1">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Shipping Charges</span>
            <span>₹{shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Tax</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Discount</span>
            <span>- ₹{discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Wallet Applied</span>
            <span>- ₹{wallet.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold border-t pt-2 mt-2">
            <span>Grand Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t pt-4 text-xs text-slate-600 print:pt-2">
        <div className="mb-2">
          <span className="font-semibold text-emerald-700">Thank you for shopping with Spice Bloom!</span>
        </div>
        <div className="mb-2">
          <span className="font-medium">Return Policy:</span> Returns accepted within 7 days of delivery. Please contact support for assistance.
        </div>
        <div className="flex items-center justify-between mt-6 print:mt-2">
          <div className="italic text-slate-400">This is a computer generated invoice.</div>
          <div className="flex flex-col items-end">
            <span className="font-medium">Authorized Signature</span>
            <div className="w-32 h-8 border-b border-slate-400 mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice; 