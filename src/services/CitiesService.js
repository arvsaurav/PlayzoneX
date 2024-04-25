import { Client, Databases, Query } from 'appwrite';
import configuration from '../configuration/appwriteConfiguration';

export class CitiesService {
    client = new Client();
    database;

    constructor() {
        this.client
                .setEndpoint(configuration.appwriteUrl)
                .setProject(configuration.appwriteProjectId)
        this.database = new Databases(this.client);
    }

    async getAllCities() {
        try {
            const cities = await this.database.listDocuments(
                configuration.appwriteDatabaseId,
                configuration.appwriteCitiesCollectionId,
                [
                    Query.select(['$id', 'City'])
                ]
            )
            return cities.documents;
        }
        catch {
            return null;
        }
    }

    async getCityById(cityId) {
        try {
            const city = await this.database.listDocuments(
                configuration.appwriteDatabaseId,
                configuration.appwriteCitiesCollectionId,
                [
                    Query.equal('$id', cityId),
                    Query.select(['$id', 'City'])
                ]
            )
            return city.documents;
        }
        catch {
            return null;
        }
    }
}

const citiesService = new CitiesService();

export default citiesService;