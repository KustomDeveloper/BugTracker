import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Routes,  Route } from 'react-router-dom';

import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './pages/Home';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Bug from './components/Bug';
import Profile from './components/Profile';

class App extends Component {
  render() {
    return (
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home />} exact />
              <Route path="/register" element={<Register />} exact />
              <Route path="/dashboard" element={<Dashboard />} exact />
              <Route path='/bug/:id' element={<Bug />} />
              <Route path='/profile' element={<Profile/>} exact />
          </Routes>
        </BrowserRouter>
    );
  }
}

export default App;