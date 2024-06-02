import { loadStripe } from '@stripe/stripe-js';
import React, { useState } from 'react';
import stripeConfiguration from '../../configuration/stripeConfiguration';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';

const stripePromise = await loadStripe(stripeConfiguration.stripePublishableKey);

const StripeCheckoutWrapper = () => {
    return (
        <Elements stripe={stripePromise}>
            <StripeCheckout />
        </Elements>
    )
}

export default StripeCheckoutWrapper;

function StripeCheckout() {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        const cardElement = elements.getElement(CardElement);



        const response = await fetch("https://6658c497b201f0f3fdbd.appwrite.global/", {
            mode: 'no-cors',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 1000, currency: 'usd' }),
        });
        
        const { clientSecret } = await response.json();


        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        setProcessing(false);

        if (result.error) {
            setError(result.error.message);
            setSuccess(false);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                setError(null);
                setSuccess(true);
                console.log("payment success");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button disabled={!stripe || processing}>Pay</button>
            {error && <div>{error}</div>}
            {success && <div>Payment successful!</div>}
        </form>
    );
}
