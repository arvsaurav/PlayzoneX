import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import authService from '../../services/AuthenticationService';
import { useState } from 'react';
import { Alert, Backdrop, CircularProgress } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../features/authenticationSlice';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © PlayzoneX '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const defaultTheme = createTheme({
    typography: {
        fontFamily: 'Montserrat'
    }
})

export default function Signup() {

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertMessageSeverity, setAlertMessageSeverity] = useState('');
    const [showBackdrop, setShowBackdrop] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isValidEmail = (email) => {
        // Regular expression for a simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // validate email format
        if(!isValidEmail(email)) {
            setShowAlert(true);
            setAlertMessage('Invalid email address.');
            setAlertMessageSeverity('warning');
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            return;
        }
        // validate password length
        if(password.length < 8) {
            setShowAlert(true);
            setAlertMessage('Password must be at least 8 characters.');
            setAlertMessageSeverity('warning');
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
            setPassword('');
            setConfirmPassword('');
            return;
        }
        if(password !== confirmPassword) {
            setShowAlert(true);
            setAlertMessage('Password mismatch.');
            setAlertMessageSeverity('warning');
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
            setPassword('');
            setConfirmPassword('');
            return;
        }
        const name = firstName + ' ' + lastName;
        const user = {
            name,
            email,
            password
        }
        setShowBackdrop(true);
        const { userAccount, message } = await authService.createAccount(user);
        setShowBackdrop(false);
        if(userAccount === null) {
            setShowAlert(true);
            setAlertMessage(message);
            setAlertMessageSeverity('error');
        }
        else {
            setShowAlert(true);
            setAlertMessage(message);
            setAlertMessageSeverity('success');
            setTimeout(() => {
                dispatch(login(userAccount));
                navigate('/');
            }, 3000);
        }
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showBackdrop}
            >
                <CircularProgress color='inherit' />
            </Backdrop>
            <Container component="main" maxWidth="xs">
                { showAlert && <Alert sx={{mt: 1, position: 'sticky', top: '105px', zIndex: '100'}} severity={alertMessageSeverity}> {alertMessage} </Alert> }
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    value={firstName}
                                    onChange={(event) => setFirstName(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    value={lastName}
                                    onChange={(event) => setLastName(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    id="confirmPassword"
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                                    label={<span style={{ fontSize: '16px' }}>I want to receive marketing promotions and updates via email.</span>}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link component={NavLink} to="../login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}
