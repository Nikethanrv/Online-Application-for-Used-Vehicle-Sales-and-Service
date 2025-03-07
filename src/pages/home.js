import { useEffect, useState } from 'react';
import Header from '../Header/Header';

import './home.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const brands = ['bmw', 'audi', 'mercedes', 'toyota', 'ford', 'honda'];
  const services = [
    { title: 'Car Financing', desc: 'Flexible payment options' },
    { title: '24/7 Support', desc: 'Round the clock assistance' },
    { title: 'Free Test Drive', desc: 'Try before you buy' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      <Header />
      
      {/* Car Slider */}
      <div className="car-slider">
        <div className="slider-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {[1, 2, 3].map((num) => (
            <div key={num} className="slide">
              <img 
                src={`/images/car${num}.jpg`} 
                alt={`Luxury Car ${num}`} 
                className="slide-image"
              />
              <div className="slide-overlay">
                <h2>Find Your Dream Car</h2>
                <button className="explore-button">Explore Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Brands */}
      <section className="top-brands">
        <h2>Top Brands</h2>
        <div className="brands-grid">
          {brands.map((brand) => (
            <div key={brand} className="brand-card">
              <img 
                src={`/images/brands/${brand}-logo.png`} 
                alt={brand} 
                className="brand-logo"
              />
              <h3>{brand.toUpperCase()}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="services-section">
        <h2>Our Services</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">
                <i className="fas fa-car"></i>
              </div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="reviews-section">
        <h2>Customer Reviews</h2>
        <div className="reviews-grid">
          <div className="review-card">
            <div className="quote-icon">“</div>
            <p>"Best car buying experience! Luci Cars made everything seamless."</p>
            <div className="review-author">- John D.</div>
          </div>
          <div className="review-card">
            <div className="quote-icon">“</div>
            <p>"Excellent service quality and transparent pricing."</p>
            <div className="review-author">- Sarah M.</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;