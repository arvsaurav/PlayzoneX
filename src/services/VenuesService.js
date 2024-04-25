import { Client, Databases, Query } from 'appwrite';
import configuration from '../configuration/appwriteConfiguration';

export class VenuesService {
    client = new Client();
    database;

    constructor() {
        this.client
                .setEndpoint(configuration.appwriteUrl)
                .setProject(configuration.appwriteProjectId)
        this.database = new Databases(this.client);
    }

    async getAllVenuesOfCity(cityId) {
        try {
            const response = await this.database.listDocuments(
                configuration.appwriteDatabaseId,
                configuration.appwriteVenuesCollectionId,
                [
                    Query.equal('City', cityId)
                ]
            )
            if(response.documents.length === 0) {
                return {};
            }
            var venues = [];
            // only storing the requied data, skipping sensitive data
            for(var i = 0; i < response.documents.length; i++) {
                const sports = response.documents[i].Sports.map((sport) => {
                    return (
                        {
                            'id': sport.$id,
                            'sport': sport.Sport
                        }
                    )
                })
                const amenities = response.documents[i].Amenities.map((amenity) => {
                    return (
                        {
                            'id': amenity.$id,
                            'amenity': amenity.Amenitiy 
                        }
                    )
                })
                const venue = {
                    'id': response.documents[i].$id,
                    'name': response.documents[i].Name,
                    'details': response.documents[i].Details,
                    'address': response.documents[i].Address,
                    'landmark': response.documents[i].Landmark,
                    'timing': response.documents[i].Timing,
                    'image-url': response.documents[i]['Image-Url'],
                    'sports': sports,
                    'amenities': amenities
                }
                venues.push(venue);
            }
            return venues;
        }
        catch {
            return null;
        }
    }

    async getVenueOfCityByVenueId(cityId, venueId) {
        try {
            const response = await this.database.listDocuments(
                configuration.appwriteDatabaseId,
                configuration.appwriteVenuesCollectionId,
                [
                    Query.equal('City', cityId),
                    Query.equal('$id', venueId)
                ]
            )
            if(response.documents.length === 0) {
                return {};
            }
            const sports = response.documents[0].Sports.map((sport) => {
                return (
                    {
                        'id': sport.$id,
                        'sport': sport.Sport
                    }
                )
            })
            const amenities = response.documents[0].Amenities.map((amenity) => {
                return (
                    {
                        'id': amenity.$id,
                        'amenity': amenity.Amenitiy 
                    }
                )
            })
            const venue = {
                'id': response.documents[0].$id,
                'name': response.documents[0].Name,
                'details': response.documents[0].Details,
                'address': response.documents[0].Address,
                'landmark': response.documents[0].Landmark,
                'timing': response.documents[0].Timing,
                'image-url': response.documents[0]['Image-Url'],
                'sports': sports,
                'amenities': amenities
            }
            return venue;
        }
        catch {
            return null;
        }
    }
}

const venuesService = new VenuesService();

export default venuesService;
