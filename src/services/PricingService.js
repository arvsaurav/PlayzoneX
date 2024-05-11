import { Client, Databases, Query } from 'appwrite';
import configuration from '../configuration/appwriteConfiguration';

export class PricingService {
    client = new Client();
    database;

    constructor() {
        this.client
                .setEndpoint(configuration.appwriteUrl)
                .setProject(configuration.appwriteProjectId)
        this.database = new Databases(this.client);
    }

    async getPrice(venueId, sportId, totalSlot) {
        try {
            const response = await this.database.listDocuments(
                configuration.appwriteDatabaseId,
                configuration.appwritePricingCollectionId,
                [
                    Query.select(['Price']),
                    Query.equal('Venue-Id', venueId),
                    Query.equal('Sport', sportId)
                ]
            )
            return response.documents[0].Price * totalSlot;
        }
        catch {
            return null;
        }
    }
}

const pricingService = new PricingService();

export default pricingService;