import React from 'react';
import './Navbar.css';
import logo from '../../images/PlayzoneX.jpg';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

function Navbar() {

    let navigate = useNavigate();

    return (
        <div className='navbar'>
            <img src={logo} alt='PlayzoneX'></img>
            <ul>
                <li><NavLink to=""> HOME</NavLink></li>
                <li><NavLink to="about">ABOUT</NavLink></li>
                <li><NavLink to="login">LOGIN / SIGNUP</NavLink></li>
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
                            }}>About</MenuItem>
                            <MenuItem onClick={() => {
                                popupState.close();
                                navigate('login');
                            }}>Login / Signup</MenuItem>
                        </Menu>
                        </React.Fragment>
                    )}
                </PopupState>
            </div>
        </div>
    )
}

export default Navbar;