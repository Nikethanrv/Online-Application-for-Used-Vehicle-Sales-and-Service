import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import './styles/Contact.css';
import { FaPaperPlane, FaCalendarAlt, FaClock } from 'react-icons/fa';

export const Contact = () => {
  const form = useRef();
  const [isSent, setIsSent] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_6u9zokt', 'template_ej7arr9', form.current, {
        publicKey: 'EZ6WU7yPOHJ37XC_H',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          setIsSent(true);
          form.current.reset();
        },
        (error) => {
          console.log('FAILED...', error.text);
          setIsSent(false);
        }
      );
  };

  return (
    <div className="contact-container">
      <h2 className="contact-heading">Appointment Booking</h2>
      <form ref={form} onSubmit={sendEmail} className="contact-form">
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="from_name" required className="form-input" />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="from_email" required className="form-input" />
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea name="message" rows="4" required className="form-input"></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label><FaCalendarAlt /> Appointment Date</label>
            <input type="date" name="appoint_date" required className="form-input" />
          </div>
          <div className="form-group">
            <label><FaClock /> Appointment Time</label>
            <input type="time" name="slot" required className="form-input" />
          </div>
        </div>

        <button type="submit" className="submit-btn">
          <FaPaperPlane /> Send Request
        </button>
      </form>

      {isSent && (
        <div className="success-message">
          Your appointment request has been sent successfully!
        </div>
      )}
    </div>
  );
};

export default Contact;