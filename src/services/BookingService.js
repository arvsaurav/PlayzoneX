import { Client, Databases, ID, Query } from 'appwrite';
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
            // get pending and booked slots
            // on hold / pending slots -> which is on pending state for less than 5 minutes
            // if hold time exceeds by 5 minutes, then that slot will not be in hold state, it will be available
            const response1 = await this.database.listDocuments(
                configuration.appwriteDatabaseId,
                configuration.appwriteBookingsCollectionId,
                [
                    Query.select(['Slots', 'Booking-Status', 'Booking-Timestamp']),
                    Query.equal('Venue-Id', venueId),
                    Query.equal('Sport', sport),
                    Query.equal('Date', date),
                    Query.equal('Booking-Status', ['pending', 'booked']),
                    Query.limit(2000)
                ]
            )
            // currentlyOccupiedSlots = bookedSlots + pendingSlots
            const currentlyOccupiedSlots = new Map();
            response1.documents.forEach((resObj) => {
                if(resObj['Booking-Status'] === 'booked') {
                    resObj.Slots.forEach((slot) => {
                        if(!currentlyOccupiedSlots.has(slot)) {
                            currentlyOccupiedSlots.set(slot, true)
                        }
                    })
                }
                else if(resObj['Booking-Status'] === 'pending') {
                    // new Date().getTime() -> returns the number of milliseconds for this date since the epoch, which is defined as the midnight at the beginning of January 1, 1970, UTC.
                    const currentTimestamp = new Date();
                    const pendingTimestamp = new Date(resObj['Booking-Timestamp']);
                    // timestamp difference in minutes
                    const timestampDifference = ((currentTimestamp.getTime()-pendingTimestamp.getTime())/1000)/60;
                    // if timestamp difference is less than 5 minutes, then this slot is temprorarly occupied by someone
                    if(timestampDifference < 5) {
                        resObj.Slots.forEach((slot) => {
                            if(!currentlyOccupiedSlots.has(slot)) {
                                currentlyOccupiedSlots.set(slot, true)
                            }
                        })
                    }
                }
            })

            // get all slots
            const response2 = await venuesService.getSlotsByVenueId(venueId);
            // availableSlots = allSlots - currentlyOccupiedSlots
            const availableSlots = [];
            response2.forEach((slotArray) => {
                if(!currentlyOccupiedSlots.has(slotArray.id)) {
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

    async createBooking({venueId, sportId, slotsId, venueName, sportName, slotsName, date, amount}, userEmail) {
        try {
            const response = await this.database.createDocument(
                configuration.appwriteDatabaseId,
                configuration.appwriteBookingsCollectionId,
                ID.unique(),
                {
                    'Venue-Id': venueId,
                    'Sport': sportId,
                    'Slots': slotsId,
                    'Venue-Display-Name': venueName,
                    'Sport-Display-Name': sportName,
                    'Slots-Display-Name': slotsName,
                    'Date': date,
                    'Booked-By': userEmail,
                    'Booking-Amount': amount,
                    'Booking-Timestamp': new Date().toISOString(),
                    'Booking-Status': 'pending'
                }
            )
            return {
                bookingId: response['$id'],
                bookingTimestamp: response['Booking-Timestamp'],
                bookedBy: response['Booked-By'],
                amount: response['Booking-Amount']
            }
        }
        catch {
            return null;
        }
    }

    async updateBooking({ documentId, status }) {
        try {
            const response = await this.database.updateDocument(
                configuration.appwriteDatabaseId,
                configuration.appwriteBookingsCollectionId,
                documentId,
                {
                    'Booking-Status': status
                }
            )
            return {
                bookingId: response['$id']
            }
        }
        catch {
            return null;
        }
    }

    async getBookingStatus(bookingId) {
        try {
            const response = await this.database.getDocument(
                configuration.appwriteDatabaseId,
                configuration.appwriteBookingsCollectionId,
                bookingId,
                [
                    Query.select(['Booking-Status'])
                ]
            )
            return {
                bookingStatus: response['Booking-Status']
            }
        }
        catch {
            return null;
        }
    }

    async getAllTransactionsOfUser(userEmail) {
        try {
            const response = await this.database.listDocuments(
                configuration.appwriteDatabaseId,
                configuration.appwriteBookingsCollectionId,
                [
                    Query.select(['Venue-Display-Name', 'Sport-Display-Name', 'Slots-Display-Name', 'Date', 'Booking-Amount', 'Booking-Status']),
                    Query.equal('Booked-By', userEmail),
                    Query.orderDesc('Date'),
                    Query.limit(200)
                ]
            )
            return response.documents;
        }
        catch {
            return null;
        }
    }
}

const bookingService = new BookingService();

export default bookingService;