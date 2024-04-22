import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/authenticationSlice';
import { useDispatch } from 'react-redux';
import authService from '../../services/AuthenticationService';
import { Alert, Stack } from '@mui/material';

export default function Logout() {

  	const [open, setOpen] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		navigate(-1); // go back to previous page
	};

	const handleLogout = async () => {
		try {
			const currentUser = await authService.getCurrentUser();
			await authService.logout(currentUser.$id);
			dispatch(logout());
			setOpen(false);
			navigate('/');
		}
		catch {
			setShowAlert(true);	
		}
	}

	useEffect(() => {
		handleClickOpen();
	}, []);

  	return (
		<>
			{ showAlert &&
				<Stack sx={{ width: '100%' }} spacing={2}>
					<Alert severity="error">Something went wrong.</Alert>
				</Stack>
			}
			<React.Fragment>
				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
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
						<Button onClick={handleClose}>Cancel</Button>
						<Button onClick={handleLogout}>Yes</Button>
					</DialogActions>
				</Dialog>
			</React.Fragment>
		</>
  	);
}
