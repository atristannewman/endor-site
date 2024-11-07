import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';


const PaymentPage = () => {
  // const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   // if (!stripe || !elements) {
  //   //   // Stripe.js hasn't yet loaded.
  //   //   return;
  //   // }

  //   // const { error } = await stripe.confirmPayment({
  //   //   elements,
  //   //   confirmParams: {
  //   //     return_url: `${window.location.origin}/completion`,
  //   //   },
  //   // });

  //   if (error) {
  //     setErrorMessage(error.message);
  //   } else {
  //     // Payment succeeded, handle accordingly
  //   }
  // };

  return (
    <form>
      <PaymentElement />
      <button>Submit</button>
    </form>
  );
};

export default PaymentPage;