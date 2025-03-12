'use client';

import { useState, useRef } from 'react';

export default function InvoiceGenerator() {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '001',
    date: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    notes: '',
    terms: 'Payment due within 30 days of invoice date.',
  });

  const [company, setCompany] = useState({
    name: 'Your Company',
    email: 'company@example.com',
    address: 'Company Address',
    phone: '+1 (123) 456-7890',
  });

  const printRef = useRef();

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((total, item) => total + item.amount, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax rate
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({ ...invoiceData, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...invoiceData.items];
    
    newItems[index] = {
      ...newItems[index],
      [name]: name === 'quantity' || name === 'rate' ? parseFloat(value) || 0 : value,
    };

    // Recalculate the amount
    if (name === 'quantity' || name === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, rate: 0, amount: 0 }],
    });
  };

  const removeItem = (index) => {
    const newItems = [...invoiceData.items];
    newItems.splice(index, 1);
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Invoice Editor */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-2xl font-bold mb-6 text-center">📄 Invoice Generator</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Your Company Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={company.name} 
                    onChange={handleCompanyChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={company.email} 
                    onChange={handleCompanyChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea 
                    name="address" 
                    value={company.address} 
                    onChange={handleCompanyChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                    rows="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    type="text" 
                    name="phone" 
                    value={company.phone} 
                    onChange={handleCompanyChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3">Invoice Details</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice #</label>
                    <input 
                      type="text" 
                      name="invoiceNumber" 
                      value={invoiceData.invoiceNumber} 
                      onChange={handleInvoiceChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input 
                      type="date" 
                      name="date" 
                      value={invoiceData.date} 
                      onChange={handleInvoiceChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    name="dueDate" 
                    value={invoiceData.dueDate} 
                    onChange={handleInvoiceChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  />
                </div>
              </div>
              
              <h2 className="text-lg font-semibold mt-6 mb-3">Customer Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input 
                    type="text" 
                    name="customerName" 
                    value={invoiceData.customerName} 
                    onChange={handleInvoiceChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="customerEmail" 
                    value={invoiceData.customerEmail} 
                    onChange={handleInvoiceChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea 
                    name="customerAddress" 
                    value={invoiceData.customerAddress} 
                    onChange={handleInvoiceChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                    rows="2"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-lg font-semibold mt-6 mb-3">Invoice Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full mb-4">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-right">Quantity</th>
                  <th className="px-4 py-2 text-right">Rate</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">
                      <input 
                        type="text" 
                        name="description" 
                        value={item.description} 
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md" 
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="number" 
                        name="quantity" 
                        value={item.quantity} 
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-right" 
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="number" 
                        name="rate" 
                        value={item.rate} 
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-right" 
                      />
                    </td>
                    <td className="px-4 py-2 text-right">
                      ${item.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {invoiceData.items.length > 1 && (
                        <button 
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ❌
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button 
            onClick={addItem}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-6"
          >
            ➕ Add Item
          </button>
          
          <div className="flex justify-end mb-6">
            <div className="w-64">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Tax (10%):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea 
                name="notes" 
                value={invoiceData.notes} 
                onChange={handleInvoiceChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                rows="3"
                placeholder="Any additional notes for the customer..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
              <textarea 
                name="terms" 
                value={invoiceData.terms} 
                onChange={handleInvoiceChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                rows="3"
              />
            </div>
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={handlePrint}
              className="px-6 py-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
            >
              🖨️ Print Invoice
            </button>
          </div>
        </div>
        
        {/* Invoice Preview (This will be visible when printing) */}
        <div ref={printRef} className="bg-white p-8 rounded-lg shadow-md hidden print:block">
          <div className="flex justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">{company.name}</h1>
              <p>{company.address}</p>
              <p>{company.email}</p>
              <p>{company.phone}</p>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold mb-2">INVOICE</h1>
              <p><strong>Invoice #:</strong> {invoiceData.invoiceNumber}</p>
              <p><strong>Date:</strong> {invoiceData.date}</p>
              <p><strong>Due Date:</strong> {invoiceData.dueDate}</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="font-bold text-gray-700 mb-2">Bill To:</h2>
            <p className="font-bold">{invoiceData.customerName}</p>
            <p>{invoiceData.customerAddress}</p>
            <p>{invoiceData.customerEmail}</p>
          </div>
          
          <table className="w-full mb-8">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left border">Description</th>
                <th className="px-4 py-2 text-right border">Quantity</th>
                <th className="px-4 py-2 text-right border">Rate</th>
                <th className="px-4 py-2 text-right border">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{item.description}</td>
                  <td className="px-4 py-2 text-right border">{item.quantity}</td>
                  <td className="px-4 py-2 text-right border">${item.rate.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right border">${item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="px-4 py-2 text-right border"><strong>Subtotal</strong></td>
                <td className="px-4 py-2 text-right border">${calculateSubtotal().toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="3" className="px-4 py-2 text-right border"><strong>Tax (10%)</strong></td>
                <td className="px-4 py-2 text-right border">${calculateTax().toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="3" className="px-4 py-2 text-right border"><strong>Total</strong></td>
                <td className="px-4 py-2 text-right border font-bold">${calculateTotal().toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-2">Notes</h3>
              <p>{invoiceData.notes}</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Terms & Conditions</h3>
              <p>{invoiceData.terms}</p>
            </div>
          </div>
          
          <div className="text-center mt-8 text-gray-500">
            <p>Thank you for your business!</p>
          </div>
        </div>
      </div>
    </div>
  );
}