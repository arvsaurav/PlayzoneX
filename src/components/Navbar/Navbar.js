import React, { useEffect, useState } from 'react';
import './Navbar.css';
import logo from '../../images/PlayzoneX.jpg';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import authService from '../../services/AuthenticationService';
import { logout } from '../../features/authenticationSlice';

function Navbar() {

    const navigate = useNavigate();
    const selector = useSelector((state) => state.authentication);
    const [isOpen, setIsOpen] = useState(false);
    const [showBackdrop, setShowBackdrop] = useState(false);
    const [userId, setUserId] = useState('');
	const dispatch = useDispatch();

    useEffect(() => {
        if(selector.isUserAuthenticated) {
            setUserId(selector.userData.id);
        }
    }, [selector]);

    const showDialogBox = () => {
		setIsOpen(true);
	};

	const hideDialogBox = () => {
		setIsOpen(false);
	};

    const handleLogout = async () => {
		try {
			setIsOpen(false);
            setShowBackdrop(true);
			const currentUser = await authService.getCurrentUser();
			await authService.logout(currentUser.$id);
            setShowBackdrop(false);
			dispatch(logout());
			navigate('/');
		}
		catch {
			alert("Something went wrong.");
		}
	}

    return (
        <div className='navbar'>
            <img src={logo} alt='PlayzoneX'></img>
            <ul>
                <li><NavLink to="">HOME</NavLink></li>
                <li><NavLink to="about">ABOUT</NavLink></li>
                {
                    selector.isUserAuthenticated && <li><NavLink to={{pathname: `dashboard/${userId}`}}>DASHBOARD</NavLink></li>
                }
                {
                    !selector.isUserAuthenticated && <li><NavLink to="login">LOGIN / SIGNUP</NavLink></li>
                }
                {
                    selector.isUserAuthenticated && <li><NavLink onClick={showDialogBox} to="#">LOGOUT</NavLink></li>
                }
            </ul>
            <div className='hamburger'>
                <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                        <React.Fragment>
                        <Button {...bindTrigger(popupState)}>
                            <MenuRoundedIcon sx={{color: 'black'}} fontSize='large' style={{width: '50px', height: '50px'}}/>
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                            <MenuItem onClick={() => {
                                popupState.close();
                                navigate('');
                            }}>Home</MenuItem>
                            <MenuItem onClick={() => {
                                popupState.close();
                                navigate('about');
                            }}>About Us</MenuItem>
                            {
                                selector.isUserAuthenticated &&
                                    <MenuItem onClick={() => {
                                        popupState.close();
                                        navigate(`dashboard/${userId}`);
                                    }}>Dashboard</MenuItem>
                            }
                            {
                                !selector.isUserAuthenticated &&
                                    <MenuItem onClick={() => {
                                        popupState.close();
                                        navigate('login');
                                    }}>Login / Signup</MenuItem>
                            }
                            {
                                selector.isUserAuthenticated &&
                                    <MenuItem onClick={() => {
                                        popupState.close();
                                        showDialogBox();
                                    }}>Logout</MenuItem>
                            }
                        </Menu>
                        </React.Fragment>
                    )}
                </PopupState>
            </div>
            <Dialog
                open={isOpen}
                onClose={hideDialogBox}
            >
                <DialogTitle>
                    {"Confirm logout"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to logout?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={hideDialogBox}>Cancel</Button>
                    <Button onClick={handleLogout}>Yes</Button>
                </DialogActions>
            </Dialog>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showBackdrop}
            >
                <CircularProgress color='inherit' />
            </Backdrop>
        </div>
    )
}

export default Navbar;