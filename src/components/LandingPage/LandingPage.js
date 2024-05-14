import React, { useEffect, useState } from 'react';
import './LandingPage.css';
import { Alert, Box, FormControl, InputLabel, LinearProgress, MenuItem, Select, Skeleton } from '@mui/material';
import citiesService from '../../services/CitiesService';
import { useNavigate } from 'react-router-dom';

function LandingPage() {

    const [city, setCity] = useState('');
    const [cities, setCities] = useState([]);
    const [popularCities, setPopularCities] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const getCities = async () => {
        setIsLoading(true);
        const response = await citiesService.getAllCities();
        if(response !== null) {
            response.sort((city1, city2) => (city1.City > city2.City) ? 1 : ((city2.City > city1.City) ? -1 : 0));
            const tempArr = [];
            tempArr.push(response[0]);
            tempArr.push(response[1]);
            tempArr.push(response[2]);
            tempArr.push(response[3]);
            setCities(response);
            setPopularCities(tempArr);
        }
        else {
            setShowAlert(true);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getCities();
    }, []);

    const handleChange = (event) => {
        setCity(event.target.value);
        navigate(`venues/${event.target.value}`);
    }

    const handleButtonClick = (cityId) => {
        setCity(cityId);
        navigate(`/venues/${cityId}`);
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
            <div id='landing-page-parent-div'>
                <div id='landing-page-header-text-field'>
                    Ready to play? Find Sports Complexes Around You...
                </div>
                <Box id='landing-page-city-dropdown-box'>
                    <FormControl fullWidth>
                        <InputLabel>Search for cities...</InputLabel>
                        <Select
                            value={city}
                            label="Cities search"
                            onChange={handleChange}
                        >
                            {
                                cities.map((city, key) => {
                                    return (
                                        <MenuItem key={key} value={city.$id}>{city.City}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </Box>
                <div id='landing-page-popular-city-div'>
                    <div id='landing-page-popular-city-div-label'>
                        Popular Cities
                    </div>
                    <div id='landing-page-popular-city-div-cities'>
                        {
                            isLoading && 
                            <Box sx={{width: '100%'}}>
                                <Skeleton animation='wave' />
                                <Skeleton animation={false} />
                            </Box>
                        }
                        {
                            !isLoading && 
                            popularCities.map((city, key) => {
                                return (
                                    <button key={key} onClick={() => handleButtonClick(city.$id)}>{city.City}</button>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default LandingPage;