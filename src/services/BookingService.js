import { Client, Databases, Query } from 'appwrite';
import configuration from '../configuration/appwriteConfiguration';
import venuesService from './VenuesService';

export class BookingService {
    client = new Client();
    database;

    constructor() {
        this.client
                .setEndpoint(configuration.appwriteUrl)
                .setProject(configuration.appwriteProjectId)
        this.database = new Databases(this.client);
    }

    // get list of unbooked slots of a particular venue, for a particular sport, on a particular date
    async getAvailableSlots(venueId, sport, date) {
        try {
            // get booked slots
            const response1 = await this.database.listDocuments(
                configuration.appwriteDatabaseId,
                configuration.appwriteBookingsCollectionId,
                [
                    Query.select(['Slots']),
                    Query.equal('Venue-Id', venueId),
                    Query.equal('Sport', sport),
                    Query.equal('Date', date),
                    Query.equal('isActive', true)
                ]
            )
            const bookedSlots = new Map();
            response1.documents.forEach((slotObj) => {
                slotObj.Slots.forEach((slot) => {
                    if(!bookedSlots.has(slot)) {
                        bookedSlots.set(slot, true)
                    }
                })
            })
            // get all slots
            const response2 = await venuesService.getSlotsByVenueId(venueId);
            // availableSlots = allSlots - bookedSlots
            const availableSlots = [];
            response2.forEach((slotArray) => {
                if(!bookedSlots.has(slotArray.id)) {
                    availableSlots.push({
                        'id': slotArray.id,
                        'slot': slotArray.slot
                    })
                }
            })
            return availableSlots;
        }
        catch {
            return null;
        }
    }
}

const bookingService = new BookingService();

export default bookingService;