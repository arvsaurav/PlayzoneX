const appwriteConfiguration = {
    appwriteUrl: String(process.env.REACT_APP_APPWRITE_URL),
    appwriteProjectId: String(process.env.REACT_APP_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(process.env.REACT_APP_DATABASE_ID),
    appwriteCitiesCollectionId: String(process.env.REACT_APP_CITIES_COLLECTION_ID),
    appwriteVenuesCollectionId: String(process.env.REACT_APP_VENUES_COLLECTION_ID),
    appwriteBookingsCollectionId: String(process.env.REACT_APP_BOOKINGS_COLLECTION_ID),
    appwritePricingCollectionId: String(process.env.REACT_APP_PRICING_COLLECTION_ID),
    appwriteFunctionCreatePaymentApiKey: String(process.env.REACT_APP_APPWRITE_FUNCTION_CREATE_PAYMENT_API_KEY),
    appwriteFunctionUpdatePaymentApiKey: String(process.env.REACT_APP_APPWRITE_FUNCTION_UPDATE_PAYMENT_API_KEY)
}

export default appwriteConfiguration;