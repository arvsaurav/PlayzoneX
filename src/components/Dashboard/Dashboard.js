import { Box, Tab, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Paper, Tabs, LinearProgress, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import "./Dashboard.css";
import bookingService from "../../services/BookingService";
import Row from "./Row";
import dayjs from "dayjs";

// mui custom tab panel
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
  
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

// create data for booking details table
function createData(venueName, sport, date, status, amount, slots) {
    return {
        venueName,
        sport,
        date,
        status,
        details: {
            amount,
            slots
        }
    }
}

function Dashboard() {
    const selector = useSelector((state) => state.authentication);
    const location = useLocation();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [value, setValue] = useState(0);
    const [allTransactions, setAllTransactions] = useState([]);
    const [transactionRows, setTransactionRows] = useState([]);
    const [upcomingBookingRows, setUpcomingBookingRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(false);

    // mui tab panel handleChange
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if(selector.isLoading) {
            return;
        }
        const idViaState = selector.userData.id;
        const splitArray = location.pathname.split('/');
        const idViaLocation = splitArray[2];
        // this means, logged in user is trying to access dashboard of different user
        if(idViaState !== idViaLocation) {
            // show error in path, below path doesn't exist
            navigate('/error');
        }
        setFirstName(selector.userData.name.split(' ')[0]);
        setIsLoading(true);
        async function fetchApi() {
            const response = await bookingService.getAllTransactionsOfUser(selector.userData.email);
            if(response) {
                setAllTransactions(response);
            }
            else {
                setApiError(true);
                setIsLoading(false);
            }
        }
        fetchApi();
    }, [selector, location, navigate])

    useEffect(() => {
        let rows = [];
        allTransactions.forEach((transaction) => {
            let status;
            if(transaction['Booking-Status'] === 'booked') {
                status = 'Booked';
            }
            else {
                status = 'Not Booked';
            }
            const data = createData(transaction['Venue-Display-Name'], transaction['Sport-Display-Name'], transaction['Date'], status, transaction['Booking-Amount'], transaction['Slots-Display-Name']);
            rows.push(data);
        })
        setTransactionRows(rows);
    }, [allTransactions])

    useEffect(() => {
        let rows = [];
        const currentDate = dayjs().format('DD-MM-YYYY');
        allTransactions.forEach((transaction) => {
            if(currentDate <= transaction['Date'] && transaction['Booking-Status'] === 'booked') {
                const data = createData(transaction['Venue-Display-Name'], transaction['Sport-Display-Name'], transaction['Date'], 'Booked', transaction['Booking-Amount'], transaction['Slots-Display-Name']);
                rows.push(data);
            }
        })
        rows.reverse();
        setUpcomingBookingRows(rows);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000)
    }, [allTransactions])

    return (
        <>
        {
            isLoading &&
            <Box sx={{width: '100%', minWidth: '350px'}}>
                <LinearProgress />
            </Box>
        }
        { apiError && <Alert severity="error"> Something went wrong. </Alert> }
        <div id="dashboard-parent-div">
            <div id="dashboard-display-name-div">Welcome back, { firstName } !</div>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Upcoming Bookings" {...a11yProps(0)} />
                        <Tab label="All Transactions" {...a11yProps(1)} />
                    </Tabs>
                </Box>

                {/* show upcoming bookings */}
                <CustomTabPanel value={value} index={0}>
                    { !isLoading && upcomingBookingRows.length === 0 && <div> No upcoming bookings. </div> }
                    { !isLoading && upcomingBookingRows.length !== 0 && 
                        <TableContainer component={Paper}>
                            <Table aria-label="collapsible table">
                                <TableHead style={{backgroundColor: '#f5f5f5'}}>
                                    <TableRow>
                                        <TableCell />
                                        <TableCell>Turf Name</TableCell>
                                        <TableCell align="right">Sport</TableCell>
                                        <TableCell align="right">Date</TableCell>
                                        <TableCell align="right">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={{backgroundColor: '#fcfcfc'}}>
                                    {upcomingBookingRows.map((row, index) => (
                                        <Row key={index} row={row} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                </CustomTabPanel>

                {/* show all transactions */}
                <CustomTabPanel value={value} index={1}>
                    { !isLoading && transactionRows.length === 0 && <div> No transactions available. </div> }
                    { !isLoading && transactionRows.length !== 0 &&
                        <TableContainer component={Paper}>
                            <Table aria-label="collapsible table">
                                <TableHead style={{backgroundColor: '#f5f5f5'}}>
                                    <TableRow>
                                        <TableCell />
                                        <TableCell>Turf Name</TableCell>
                                        <TableCell align="right">Sport</TableCell>
                                        <TableCell align="right">Date</TableCell>
                                        <TableCell align="right">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={{backgroundColor: '#fcfcfc'}}>
                                    {transactionRows.map((row, index) => (
                                        <Row key={index} row={row} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                </CustomTabPanel>
            </Box>
        </div>
        </>
    )
}

export default Dashboard;