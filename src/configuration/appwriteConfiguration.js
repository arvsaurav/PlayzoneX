const appwriteConfiguration = {
    appwriteUrl: String(process.env.REACT_APP_APPWRITE_URL),
    appwriteProjectId: String(process.env.REACT_APP_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(process.env.REACT_APP_DATABASE_ID),
    appwriteCitiesCollectionId: String(process.env.REACT_APP_CITIES_COLLECTION_ID),
    appwriteVenuesCollectionId: String(process.env.REACT_APP_VENUES_COLLECTION_ID),
    appwriteSportsCollectionId: String(process.env.REACT_APP_SPORTS_COLLECTION_ID),
    appwriteAmenitiesCollectionId: String(process.env.REACT_APP_AMENITIES_COLLECTION_ID)
}

export default appwriteConfiguration;