import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function PaymentModal({ onClose, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      // Send paymentMethod.id to your server
      const response = await fetch('/api/create-payment-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess({
          last4: paymentMethod.card.last4,
          apiKey: result.apiKey,
        });
      } else {
        setError(result.error);
      }
      setProcessing(false);
    }
  };

  return (
    <div className="payment-modal">
      <h2>Add Payment Method</h2>
      <p>We charge $0.01 per API request.</p>
      <form onSubmit={handleSubmit}>
        <CardElement />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={!stripe || processing}>
          {processing ? 'Processing...' : 'Add Payment Method'}
        </button>
      </form>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default PaymentModal;
