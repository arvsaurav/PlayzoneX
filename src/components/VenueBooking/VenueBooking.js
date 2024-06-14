import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import venuesService from '../../services/VenuesService';
import bookingService from '../../services/BookingService';
import pricingService from '../../services/PricingService';
import { Alert, Backdrop, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, LinearProgress, MenuItem, Select, Skeleton } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import './VenueBooking.css';
import { useSelector } from 'react-redux';

function VenueBooking() {
    const { venueid } = useParams();
    const [venueName, setVenueName] = useState('');
    const [venueLandmark, setVenueLandmark] = useState('');
    const [sport, setSport] = useState('');
    const [date, setDate] = useState(dayjs().add(1, 'day'));
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [allSports, setAllSports] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // for page loading
    const [isNameLoading, setIsNameLoading] = useState(true);
    const [isSlotLoading, setIsSlotLoading] = useState(true);
    const [dateValidationError, setDateValidationError] = useState('');
    const [apiError, setApiError] = useState(false);
    const [isConfirmBookingValidationFailed, setIsConfirmBookingValidationFailed] = useState(false);
    const [confirmBookingValidationFailedMessage, setConfirmBookingValidationFailedMessage] = useState('');
    const [bookingDetails, setBookingDetails] = useState('');
    const [showAmountWindow, setShowAmountWindow] = useState(false);
    const [showBackdrop, setShowBackdrop] = useState(false);
    const [unauthorisedUser, setUnauthorisedUser] = useState(false);
    const [selectedSlotsNotAvailableWarning, setSelectedSlotsNotAvailableWarning] = useState(false);
    const navigate = useNavigate();
    const selector = useSelector((state) => state.authentication);

    const handleSportChange = (event) => {
        setSport(event.target.value);
        setSelectedSlots([]);
    }

    const handleDateChange = (newValue) => {
        setDate(newValue);
        setSelectedSlots([]);
    }

    const handleDateValidationError = (newError) => {
        switch(newError) {
            case 'maxDate':
                setDateValidationError('Please select a date within a range of 3 months starting from tomorrow.');
                break;
            case 'minDate':
                setDateValidationError('Please select a date within a range of 3 months starting from tomorrow.');
                break;
            case 'invalidDate':
                setDateValidationError('Please select a valid date.');
                break;
            default:
                setDateValidationError('');
        }
    }

    const handleSlotSelection = (id, slot) => {
        const btn = document.getElementById(id);
        if(btn.style.borderColor !== 'rgb(25, 118, 210)') {
            btn.style.border = '2px solid rgb(25, 118, 210)';
        }
        else {
            btn.style.border = '1px solid gray';
        }
        var isAlreadySelected = false;
        selectedSlots.forEach((slotArray) => {
            if(slotArray.id === id) {
                isAlreadySelected = true;
            }
        })
        if(!isAlreadySelected) {
            setSelectedSlots((prevState) => ([
                ...prevState,
                {
                    'id': id,
                    'slot': slot
                }
            ]))
        }
        else {
            const filteredSelection = selectedSlots.filter((slotArray) => {
                return (
                    slotArray.id !== id
                )
            })
            setSelectedSlots(filteredSelection);
        }
    }

    const handleConfirmBookingButton = async (event) => {
        if(dateValidationError !== '') {
            setIsConfirmBookingValidationFailed(true);
            setConfirmBookingValidationFailedMessage('Please select a valid date.');
        }
        else if(selectedSlots.length === 0) {
            setIsConfirmBookingValidationFailed(true);
            setConfirmBookingValidationFailedMessage('Please select atleast one slot.');
        }
        else if(apiError) {
            setIsConfirmBookingValidationFailed(true);
            setConfirmBookingValidationFailedMessage('Something went wrong. Please retry your booking.');
        }
        else {
            setIsConfirmBookingValidationFailed(false);
            setConfirmBookingValidationFailedMessage('');
            document.getElementById(event.target.id).disabled = true;
            document.getElementById(event.target.id).style.backgroundColor = 'rgb(191, 191, 191)';
            document.getElementById(event.target.id).style.color = 'rgb(102, 102, 102)';
            document.getElementById(event.target.id).style.transform = 'scale(1.05)';
            document.getElementById(event.target.id).style.cursor = 'not-allowed';
            const sportNameArray = allSports.filter((sportArray) => sportArray.id === sport);
            setShowBackdrop(true);
            const response = await pricingService.getPrice(venueid, sport, selectedSlots.length);
            setShowBackdrop(false);
            if(response === null) {
                setIsConfirmBookingValidationFailed(true);
                setConfirmBookingValidationFailedMessage('Something went wrong. Please retry your booking.');
                return;
            }
            // array of selected slot's id
            const slotsId = [];
            // array of selected slot's name
            const slotsName = [];
            selectedSlots.forEach((currentSlotArray) => {
                slotsId.push(currentSlotArray.id);
                slotsName.push(currentSlotArray.slot);
            })
            const bookingDetail = {
                'venueId': venueid,
                'venueName': venueName,
                'sportId': sport,
                'sportName': sportNameArray[0].sport,
                'slotsId': slotsId,
                'slotsName': slotsName,
                'date': date.format('DD-MM-YYYY'),
                'slots': selectedSlots,
                'amount': response
            }
            setBookingDetails(bookingDetail);
            setShowAmountWindow(true);
            setTimeout(() => {
                document.getElementById('scroll-to-div').scrollIntoView();
            }, 500);
        }
    }

    const handleProceedPaymentButton = async () => {
        if(selector.isUserAuthenticated) {
            setShowBackdrop(true);
            // check for current availability of selected slots
            const currentlyAvailableSlots = await bookingService.getAvailableSlots(bookingDetails.venueId, bookingDetails.sportId, bookingDetails.date);
            let areAllSelectedSlotsAvailable = true;
            bookingDetails.slotsId.forEach((slotId) => {
                let isCurrentSlotAvailable = false;
                currentlyAvailableSlots.forEach((slotObj) => {
                    if(slotObj.id === slotId) {
                        isCurrentSlotAvailable = true;
                    }
                })
                if(!isCurrentSlotAvailable) {
                    areAllSelectedSlotsAvailable = false;
                }
            })
            if(areAllSelectedSlotsAvailable) {
                const response = await bookingService.createBooking(bookingDetails, selector.userData.email);
                if(response) {
                    navigate('/payment', { state: response });
                }
                else {
                    setApiError(true);
                }
            }
            else {
                setSelectedSlotsNotAvailableWarning(true);
            }
            setShowBackdrop(false);
        }
        else {
            setUnauthorisedUser(true);
        }
    }

    useEffect(() => {
        const getVenueNameAndLandmark = async () => {
            const response = await venuesService.getVenueNameAndLandmarkByVenueId(venueid);
            if(response !== null) {
                setVenueName(response.name);
                setVenueLandmark(response.landmark);
                setIsNameLoading(false);
            }
            else {
                setApiError(true);
            }
        }
        const getAllSports = async () => {
            const response = await venuesService.getSportsByVenueId(venueid);
            if(response !== null) {
                setAllSports(response);
                setSport(response[0].id);
            }
            else {
                setApiError(true);
            }
        }
        getVenueNameAndLandmark();
        getAllSports();
    }, [venueid]);

    useEffect(() => {
        const getAvailableSlots = async () => {
            setIsSlotLoading(true);
            const response = await bookingService.getAvailableSlots(venueid, sport, date.format('DD-MM-YYYY'));
            if(response !== null) {
                setAvailableSlots(response);
                setIsSlotLoading(false);
            }
            else {
                setApiError(true);
            }
            setIsLoading(false);
        }
        getAvailableSlots();
    }, [venueid, sport, date]);

    return (
        <>
            {
                isLoading &&
                <Box sx={{width: '100%', minWidth: '350px'}}>
                    <LinearProgress />
                </Box>
            }  
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showBackdrop}
            >
                <CircularProgress color='inherit' />
            </Backdrop>
            {
                apiError && <Alert severity="error">Something went wrong.</Alert>
            }
            <div id='venue-booking-page-parent-div'>
                <div id='venue-booking-page-heading-section'>
                    {
                        isNameLoading && 
                        <Box sx={{marginLeft: '5px', marginRight: '5px'}}>
                            <Skeleton />
                            <Skeleton animation="wave" />
                        </Box>
                    }
                    {
                        !isNameLoading && 
                        <>
                            <div id='venue-booking-page-heading-section-venue-name'>{ venueName }</div>
                            <div id='venue-booking-page-heading-section-venue-landmark'>{ venueLandmark }</div>
                        </>
                    }
                </div>
                <div id='venue-booking-page-sports-section'>
                    <div id='venue-booking-page-sports-section-div1'>Sports</div>
                    <Box sx={{ minWidth: 220, width: 300 }}>
                        <FormControl fullWidth>
                            <InputLabel>Sports</InputLabel>
                            <Select
                                label='Sports'
                                value={sport}
                                onChange={handleSportChange}
                            >
                                {
                                    allSports.map((sportArray, key) => {
                                        return (
                                            <MenuItem key={key} value={sportArray.id}>{sportArray.sport}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Box>
                </div>
                <div id='venue-booking-page-date-section'>
                    <div>Date</div>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                        <DatePicker
                            sx={{ minWidth: 180, width: 300 }}
                            label="Date"
                            value={date}
                            onChange={(newValue) => handleDateChange(newValue)}
                            minDate={dayjs().add(1, 'day')}
                            maxDate={dayjs().add(3, 'month')}
                            onError={(newError) => handleDateValidationError(newError)}
                            slotProps={{
                                textField: {
                                  helperText: dateValidationError,
                                },
                            }}
                        />
                    </LocalizationProvider>
                </div>
                <div id='venue-booking-page-slots-section'>
                    <div>Slots</div>
                    <div>
                        {
                            isSlotLoading && 
                            <Box sx={{width: '90%'}}>
                                <Skeleton />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                            </Box>
                        }
                        {
                            !isSlotLoading &&
                            availableSlots.map((slotArray, key) => {
                                return (
                                    <button key={key} id={slotArray.id} onClick={() => handleSlotSelection(slotArray.id, slotArray.slot)}>{slotArray.slot}</button>
                                )
                            })
                        }
                    </div>  
                </div>
                {
                    isConfirmBookingValidationFailed &&
                    <Alert sx={{marginBottom: '10px'}} severity="warning"> { confirmBookingValidationFailedMessage }</Alert>
                }
                <div id='venue-booking-page-confirm-booking-div'>
                    <button id='venue-booking-page-confirm-booking-button' onClick={(event) => handleConfirmBookingButton(event)}>Confirm Booking</button>
                </div>
            </div>
            <div id='scroll-to-div'></div>
            {
                showAmountWindow && 
                <div id='venue-booking-page-amount-confirmation-window'>
                    <div id='amount-confirmation-window-venue-name-section'>
                        <div>Venue</div>
                        <div>{bookingDetails.venueName}</div>
                    </div>
                    <div id='amount-confirmation-window-sport-section'>
                        <div>Sport</div>
                        <div>{bookingDetails.sportName}</div>
                    </div>
                    <div id='amount-confirmation-window-date-section'>
                        <div>Date <p style={{fontSize: '12px'}}>(dd-mm-yyyy)</p></div>
                        <div>{bookingDetails.date}</div>
                    </div>
                    <div id='amount-confirmation-window-slots-section'>
                        <div>Slots</div>
                        <div id='amount-confirmation-window-slots-section-parent-box'>
                            {
                                bookingDetails.slots.map((slotArray, key) => {
                                    return (
                                        <div key={key} id='amount-confirmation-window-slots-section-slots'> {slotArray.slot} </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div id='amount-confirmation-window-amount-section'>
                        <div>Amount</div>
                        <div>INR {bookingDetails.amount}</div>
                    </div>
                    {
                        selectedSlotsNotAvailableWarning && <Alert severity="warning" sx={{mt: '10px', mb: '-15px'}}>Selected slots are not available at the moment.</Alert>
                    }
                    <div id='amount-confirmation-window-proceed-payment-section'>
                        <button id='proceed-payment-button' onClick={handleProceedPaymentButton}>Proceed Payment</button>
                    </div>
                </div>
            }
            <Dialog
                open={unauthorisedUser}
                onClose={() => setUnauthorisedUser(false)}
            >
                <DialogTitle>
                    {"Unauthorized User"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please login to continue...
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUnauthorisedUser(false)}>Cancel</Button>
                    <Button onClick={() => {navigate('/login')}}>Login</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default VenueBooking;