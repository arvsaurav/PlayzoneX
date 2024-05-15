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
import { Alert, Backdrop, CircularProgress } from '@mui/material';
import { useState } from 'react';
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

export default function Login() {

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertMessageSeverity, setAlertMessageSeverity] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showBackdrop, setShowBackdrop] = useState(false);

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
            return;
        }
        const credentials = {
            email,
            password
        }
        setShowBackdrop(true);
        const { userAccount, message } = await authService.login(credentials);
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
            dispatch(login(userAccount));
            navigate('/');
        }
        setEmail('');
        setPassword('');
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showBackdrop}
            >
                <CircularProgress color='inherit' />
            </Backdrop>
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    { showAlert && <Alert  sx={{mt: 1, position: 'sticky', top: '105px', zIndex: '100'}} severity={alertMessageSeverity}> {alertMessage} </Alert>}
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
                            Sign in
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoFocus
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label={<span style={{ fontSize: '16px' }}>Remember me</span>}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                {/* <Grid item xs={12}>
                                    <Link component={NavLink} to="" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid> */}
                                {/* <br /> */}
                                <Grid item xs={12}>
                                    <Link component={NavLink} to="../signup" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Copyright sx={{ mt: 8, mb: 4 }} />
                </Container>
            </ThemeProvider>
        </>
    );
}