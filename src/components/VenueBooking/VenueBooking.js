import React from 'react';
import { useParams } from 'react-router-dom';

function VenueBooking() {

    const { venueid } = useParams();

    return (
        <div>VenueBooking: {venueid}</div>
    )
}

export default VenueBooking;