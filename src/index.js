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
import Account from './components/Account/Account';
import Logout from './components/Logout/Logout';
import Venues from './components/Venues/Venues';

const router = createBrowserRouter(
  	createRoutesFromElements(
		<Route path='/' element={<App />} errorElement={<PageNotFound />} >
			<Route path='' element={<LandingPage />} />
			<Route path='about' element={<About />} />
			<Route path='login' element={<Login />} />
			<Route path='signup' element={<Signup />} />
			<Route path='logout' element={<Logout />} />
			<Route path='account' element={<Account />} />
			<Route path='venues/:cityid' element={<Venues />} />
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
