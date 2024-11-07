import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";

export default function PaymentForm({ onSuccess, customerId }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/dashboard?customerId=${customerId}`,
      },
    })

    if (error) {
      // Handle error
      setMessage(error.message);
    } else {
      // Call the onSuccess function with relevant payment data
      onSuccess(setupIntent); // Pass the setupIntent or relevant data
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={isProcessing || !stripe || !elements} id="submit">
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Submit"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}