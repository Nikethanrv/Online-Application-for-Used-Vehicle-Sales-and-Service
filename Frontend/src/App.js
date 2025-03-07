import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header/Header';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import CarForm from './pages/sell_cars';
import ServicePage from './pages/services'
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/sellcars" element={<CarForm />} />
        <Route path="/services" element={<ServicePage />} />
      </Routes>
    </Router>
  );
}
export default App;  