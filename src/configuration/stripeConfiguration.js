const stripeConfiguration = {
    stripePublishableKey: String(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY),
    stripePaymentUrl: String(process.env.REACT_APP_STRIPE_PAYMENT_URL)
}

export default stripeConfiguration;