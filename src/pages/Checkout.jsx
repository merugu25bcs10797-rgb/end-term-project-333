import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import './Checkout.css';

const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  zipCode: yup.string().required('Zip code is required'),
  cardNumber: yup.string().required('Card number is required').matches(/^[0-9]{16}$/, 'Must be 16 digits'),
  expiry: yup.string().required('Expiry date is required').matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Format MM/YY'),
  cvv: yup.string().required('CVV is required').matches(/^[0-9]{3,4}$/, 'Invalid CVV'),
});

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCartContext();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const tax = cartTotal * 0.08; // 8% fake tax
  const total = cartTotal + tax;

  const onSubmit = (data) => {
    setIsProcessing(true);
    // Simulate API delay
    setTimeout(() => {
      clearCart();
      toast.success('🎉 Order placed successfully!');
      setIsProcessing(false);
      navigate('/');
    }, 2000);
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      
      <div className="checkout-container">
        <div className="checkout-form-container">
          <form onSubmit={handleSubmit(onSubmit)} className="checkout-form">
            <div className="form-section">
              <h2>Shipping Information</h2>
              <div className="form-group">
                <label>Full Name</label>
                <input {...register('fullName')} className={errors.fullName ? 'error' : ''} />
                {errors.fullName && <span className="error-message">{errors.fullName.message}</span>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" {...register('email')} className={errors.email ? 'error' : ''} />
                {errors.email && <span className="error-message">{errors.email.message}</span>}
              </div>
              <div className="form-group">
                <label>Address</label>
                <input {...register('address')} className={errors.address ? 'error' : ''} />
                {errors.address && <span className="error-message">{errors.address.message}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input {...register('city')} className={errors.city ? 'error' : ''} />
                  {errors.city && <span className="error-message">{errors.city.message}</span>}
                </div>
                <div className="form-group">
                  <label>Zip Code</label>
                  <input {...register('zipCode')} className={errors.zipCode ? 'error' : ''} />
                  {errors.zipCode && <span className="error-message">{errors.zipCode.message}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Payment Details</h2>
              <div className="form-group">
                <label>Card Number</label>
                <input {...register('cardNumber')} placeholder="1234123412341234" maxLength="16" className={errors.cardNumber ? 'error' : ''} />
                {errors.cardNumber && <span className="error-message">{errors.cardNumber.message}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry (MM/YY)</label>
                  <input {...register('expiry')} placeholder="MM/YY" className={errors.expiry ? 'error' : ''} />
                  {errors.expiry && <span className="error-message">{errors.expiry.message}</span>}
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input {...register('cvv')} placeholder="123" maxLength="4" className={errors.cvv ? 'error' : ''} />
                  {errors.cvv && <span className="error-message">{errors.cvv.message}</span>}
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary submit-btn" disabled={isProcessing}>
              {isProcessing ? 'Processing Order...' : `Pay $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cartItems.map(item => (
              <div key={item.id} className="summary-item">
                <img src={item.image} alt={item.title} />
                <div className="summary-item-details">
                  <h4>{item.title}</h4>
                  <p>Qty: {item.quantity}</p>
                </div>
                <div className="summary-item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="summary-totals">
            <div className="totals-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="totals-row">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="totals-row grand-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
