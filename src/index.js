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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} errorElement={<PageNotFound />} >
      <Route path='' element={<LandingPage />} />
      <Route path='about' element={<About />} />
      <Route path='login' element={<Login />} />
      <Route path='signup' element={<Signup />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
