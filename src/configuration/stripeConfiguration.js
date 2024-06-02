const stripeConfiguration = {
    stripeKey: String(process.env.REACT_APP_STRIPE_KEY),
    stripeSignature: String(process.env.REACT_APP_STRIPE_SIGNATURE),
    stripePublishableKey : String(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
}

export default stripeConfiguration;