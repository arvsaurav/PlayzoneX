import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Login from './components//Login/Login';
import Signup from './components//Signup/Signup';
import LandingPage from './components/LandingPage/LandingPage';
import PageNotFound from './components/PageNotFound/PageNotFound';
import App from './App';
import About from './components/About/About';
import { Provider } from 'react-redux';
import store from './store/store';
import Venues from './components/Venues/Venues';
import Venue from './components/Venue/Venue';
import VenueBooking from './components/VenueBooking/VenueBooking';
import StripeCheckoutWrapper from './components/StripeCheckout/StripeCheckout';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoutes/ProtectedRoutes';

const router = createBrowserRouter(
  	createRoutesFromElements(
		<Route path='/' element={<App />} errorElement={<PageNotFound />} >
			<Route path='' element={<LandingPage />} />
			<Route path='about' element={<About />} />
			<Route path='login' element={<Login />} />
			<Route path='signup' element={<Signup />} />
			<Route path='venues/:cityid' element={<Venues />} />
			<Route path='venues/:cityid/:venueid' element={<Venue />} />
			<Route path='booking/:venueid' element={<VenueBooking />} />
			<Route path='dashboard/:userid' element={ <ProtectedRoute element={<Dashboard />}/> }/>
			<Route path='payment' element={ <ProtectedRoute element={<StripeCheckoutWrapper />}/> }/>
		</Route>
  	)
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</React.StrictMode>
);
