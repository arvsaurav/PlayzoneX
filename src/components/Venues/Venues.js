import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import venuesService from '../../services/VenuesService';
import './Venues.css';
import { Alert, Box, LinearProgress } from '@mui/material';

function Venues() {

	const { cityid } = useParams();
	const [venues, setVenues] = useState([]);
	const [isFetched, setIsFetched] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	const venuesList = async (cityId) => {
		setIsLoading(true);
		const response = await venuesService.getAllVenuesOfCity(cityId);
		if(response !== null) {
			setVenues(response);
			setIsFetched(true);
		}
		else {
			setShowAlert(true);
		}
		setIsLoading(false);
	}

	useEffect(() => {
		venuesList(cityid);
	}, [cityid]);

	const openSelectedVenue = (venueId) => {
		navigate(`/venues/${cityid}/${venueId}`);
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
			<div id='venue-page-heading'>
				Discover the finest Sports Complexes in {cityid.charAt(0).toUpperCase() + cityid.slice(1)}
			</div>
			{
				isFetched &&
				venues.length === 0 ?
					<div id='venue-page-no-complexes-div'>
						Currently, there are no sports complexes in your locality.
					</div>
					:
					<div id='venue-page-grid-container'>
						{
							!isLoading &&
							venues.map((venue, key) => {
								return (
									<div id='venue-page-grid-container-venue-div' key={key} onClick={() => openSelectedVenue(venue['id'])}>
										<div id='venue-page-grid-container-venue-div-image'>
											<img 
												src={ venue['image-url'] }
												alt={ venue['name'] }
												key={key}
											/>
										</div>
										<div id='venue-page-grid-container-venue-div-name'>
											{ venue['name'] }
										</div>
										<div id='venue-page-grid-container-venue-div-landmark'>
											{ venue['landmark'] }
										</div>
										<div id='venue-page-grid-container-venue-div-sports'>
											<div>
												{ venue['sports'][0]['sport'] }
											</div>
											{
												venue['sports'].length > 1 ?
													<div>
														{ venue['sports'][1]['sport'] }
													</div> :
													<></>
											}
											{
												venue['sports'].length > 2 ?
													`+ ${venue['sports'].length - 2} more`:
													<></>
											}
										</div>
									</div>
								)
							})
						}
					</div>
			}
		</>
  	)
}

export default Venues;