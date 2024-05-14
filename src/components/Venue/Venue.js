import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import venuesService from '../../services/VenuesService';
import { Alert, Box, LinearProgress } from '@mui/material';
import './Venue.css';

function Venue() {

	const { cityid, venueid } = useParams();
	const [venue, setVenue] = useState([]);
	const [showAlert, setShowAlert] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	const getVenue = async (cityId, venueId) => {
		setIsLoading(true);
		const response = await venuesService.getVenueOfCityByVenueId(cityId, venueId);
		if(response !== null) {
			setVenue(response);
		}
		else {
			setShowAlert(true);
		}
		setIsLoading(false);
	}

	useEffect(() => {
		getVenue(cityid, venueid);
	}, [cityid, venueid]);

	const initiateBookingProcess = (venueId) => {
		navigate(`/booking/${venueId}`);
	}
	
  	return (
    	<>
			{
				isLoading &&
				<Box sx={{width: '100%', minWidth: '350px'}}>
					<LinearProgress />
				</Box>
			}
			{
                showAlert && <Alert sx={{mt: 1, minWidth: '320px'}} severity='error'> Something went wrong. </Alert>
            }
			{
				venue.length !== 0 && 
					<div id='venue-page-parent-div'>
						<div id='venue-page-header-div'>
							<div id='venue-page-header-div-child1'>
								<div id='venue-page-venue-name'> { venue.name } </div>
								<div id='venue-page-venue-landmark'> { venue.landmark } </div>
							</div>
							<div id='venue-page-header-div-child2'>
								<button id='venue-page-book-now-button' onClick={() => initiateBookingProcess(venue.id)}>Book Now</button>
							</div>
						</div>

						<div id='venue-page-body-div'>
							<div id='venue-page-venue-image'>
								<img src={ venue['image-url'] }
									 alt={ venue['name'] }
								/>
							</div>
							<div id='venue-page-venue-address-time-parent'>
								<div id='venue-page-venue-timing'> <b>Timing</b><div style={{paddingTop: '5px'}}>{ venue.timing }</div></div>
								<div id='venue-page-venue-address'> <b>Location</b><div style={{paddingTop: '5px'}}>{ venue.address }</div></div>
							</div>
						</div>

						<div id='venue-page-venue-sports'>
							<b>Sports Available</b>
							<div style={{paddingTop: '5px'}}>
								{
									venue.sports.map((item, key) => {
										return (
											<div key={key}> {item.sport} </div>
										)
									})
								}
							</div>
						</div>

						<div id='venue-page-venue-amenities'>
							<b>Amenities</b>
							<div style={{paddingTop: '5px'}}>
								{
									venue.amenities.map((item, key) => {
										return (
											<div key={key}> {item.amenity} </div>
										)
									})
								}
							</div>
						</div>

						<div id='venue-page-venue-about'>
							<b>About Venue</b>
							<div style={{paddingTop: '5px'}}>{ venue.details }</div>
						</div>
					</div>
			}
		</>
  	)
}

export default Venue;