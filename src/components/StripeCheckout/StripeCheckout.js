import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import stripeConfiguration from '../../configuration/stripeConfiguration';
import "./StripeCheckout.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Backdrop, CircularProgress } from '@mui/material';
import bookingService from '../../services/BookingService';
import { useSelector } from 'react-redux';

function StripeCheckoutWrapper() {
    const location = useLocation();
    const bookingDetails = location.state;
    const [stripePromise] = useState(() => loadStripe(stripeConfiguration.stripePublishableKey));
    
    return (
        <Elements stripe={stripePromise}>
            <StripeCheckout bookingDetails={bookingDetails} />
        </Elements>
    );
}

export default StripeCheckoutWrapper;

function StripeCheckout({bookingDetails}) {
    const stripe = useStripe();
    const elements = useElements();
    const [payableAmount, setPayableAmount] = useState(0);
    const [initialTimestamp, setInitialTimestamp] = useState(new Date());
    const [bookingId, setBookingId] = useState('');
    const [bookedBy, setBookedBy] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [showBackdrop, setShowBackdrop] = useState(false);
    const [isTransactionTimedout, setIsTransactionTimedout] = useState(false);
    const [apiError, setApiError] = useState(false);
    const [invalidRedirect, setInvalidRedirect] = useState(false);
    const [isAlreadyBooked, setIsAlreadyBooked] = useState(false);
    const selector = useSelector((state) => state.authentication);
    const navigate = useNavigate();

    useEffect(() => {
        if(bookingDetails) {
            setPayableAmount(bookingDetails.amount);
            setInitialTimestamp(new Date(bookingDetails.bookingTimestamp));
            setBookingId(bookingDetails.bookingId);
            setBookedBy(bookingDetails.bookedBy);
        }
    }, [bookingDetails, navigate])

    const handleSubmit = async (event) => {
        event.preventDefault();
        // if user moves to some other page and then again comes back to payment page using browser back button
        // in the above scenario bookingDetails will be null
        if(!bookingDetails) {
            setShowBackdrop(true);
            setInvalidRedirect(true);
            setTimeout(() => {
                navigate('/');
            }, 3000);
            return;
        }
        const currentTimestamp = new Date();
        // time difference in seconds
        const timestampDifference = ((currentTimestamp.getTime()-initialTimestamp.getTime())/1000);
        // if time exceeds 4 minutes and 30 seconds, mark transaction as expired and don't proceed for payment
        if(timestampDifference > 270) {
            setIsTransactionTimedout(true);
            setShowBackdrop(true);
            const payload = {
                'documentId': bookingId,
                'status': 'expired'
            }
            const response = await bookingService.updateBooking(payload);
            if(response) {
                setTimeout(() => {
                   navigate('/');
                }, 3000);
            }
            else {
                setApiError(true);
            }
            return;
        }
        setShowBackdrop(true);
        const status = await bookingService.getBookingStatus(bookingId);
        if(!status) {
            setApiError(true);
            setShowBackdrop(false);
            return;
        }
        if(status.bookingStatus === 'booked') {
            setIsAlreadyBooked(true);
            setTimeout(() => {
                navigate(`/dashboard/${selector.userData.id}`);
            }, 3000);
            return;
        }
        setProcessing(true);
        const cardElement = elements.getElement(CardElement);
        const payload = {
            amount: payableAmount,
            name: bookedBy
        }
        const response = await fetch(stripeConfiguration.stripePaymentUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        const clientSecret = data.clientSecret;
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: bookedBy,
                },
            },
        });
        setProcessing(false);
        setShowBackdrop(false);
        if(result.error) {
            setError(result.error.message);
            setSuccess(false);
        }
        else {
            if(result.paymentIntent.status === 'succeeded') {
                setError(null);
                setSuccess(true);
                setShowBackdrop(true);
                const payload = {
                    'documentId': bookingId,
                    'status': 'booked'
                }
                const response = await bookingService.updateBooking(payload);
                if(response) {
                    setTimeout(() => {
                       navigate(`/dashboard/${selector.userData.id}`);
                    }, 3000);
                }
                else {
                    setApiError(true);
                    setShowBackdrop(false);
                }
            }
        }
    };

    const cardStyle = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: 'Arial, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#aab7c4"
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        }
    };

    return (
        <>
            {
                apiError && <Alert severity="error">Something went wrong.</Alert>
            }
            <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={showBackdrop}
                >
                    <CircularProgress color='inherit' />
            </Backdrop>
            <form onSubmit={handleSubmit} className='payment-form'>
                <div className='gateway-name'>
                    Stripe Test Mode
                </div>
                <CardElement options={cardStyle} className='card-element' />
                <button disabled={ !stripe || processing || success } className='pay-button'>
                    { processing ? "Processing..." : `Pay INR ${payableAmount}` }
                </button>
                {
                    processing && <div className='processing-message'> Please don't refresh the page. </div>
                }
                {
                    error && <div className='card-error' role='alert'>{ error }</div>
                }
                {
                    success && 
                    <>
                        <Alert severity='success' sx={{mt: '10px'}}> Payment successful! </Alert>
                        <div className='processing-message'> Redirecting to dashboard... </div>
                    </>
                }
                {
                    isAlreadyBooked && 
                    <>
                        <Alert severity='warning' sx={{mt: '10px'}}> Already booked! </Alert>
                        <div className='processing-message'> Redirecting to dashboard... </div>
                    </>
                }
                {
                    isTransactionTimedout && 
                    <>
                        <Alert severity='error' sx={{mt: '10px'}}> Transaction timed out! </Alert>
                        <div className='processing-message'> Redirecting to homepage... </div>
                    </>
                }
                {
                    invalidRedirect &&
                    <>
                        <Alert severity='error' sx={{mt: '10px'}}> Invalid redirect! </Alert>
                        <div className='processing-message'> Redirecting to homepage... </div>
                    </>
                }
            </form>
        </>
    );
}
