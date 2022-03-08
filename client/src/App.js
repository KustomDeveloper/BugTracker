import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Routes,  Route } from 'react-router-dom';

import Home from './pages/Home';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';



class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} exact />
            <Route path="/register" element={<Register />} exact />
            <Route path="/dashboard" element={<Dashboard />} exact />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;