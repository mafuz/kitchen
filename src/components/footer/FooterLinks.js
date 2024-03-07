import React from 'react';
import './FooterLinks.scss';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import logoImg from '../../assets/mafuz-logo.png';

function FooterLinks() {
  return (
    <>
      <section className="contact-section">
        <div className="container contact">
          <div className="container-icon">
            <FaFacebook className="i" />
            <FaTwitter className="i" />
            <FaInstagram className="i" />
            <FaYoutube className="i" />
          </div>
          <h2>Let's Talk?</h2>
          <a href="#home" className="btn btn-dark">
            Make an enquiry!
          </a>
        </div>
      </section>
      <section className="footer-section">
        <div className="container footer">
          <div className="container-logo">
            <img src={logoImg} alt="logo" width={150} />
           
          </div>
          <div className="footer-menu">
            <p className="link-heading">Links</p>
            <ul className="nav-ul footer-links">
              <li>
                <a href="#home">About us</a>
              </li>
              <li>
                <a href="#home">Products and Services</a>
              </li>
          
              <li>
                <a href="#home">Contact us</a>
              </li>
              <li>
                <a href="#home">Consultancy, Training and Support</a>
              </li>
            </ul>
          </div>
          <div className="footer-menu">
            <p className="link-heading">Products and Services</p>
            <ul className="nav-ul footer-links">
              <li>
                <a href="#home">Custom Application Development</a>
              </li>
              <li>
                <a href="#home">SMS Service</a>
              </li>
              <li>
                <a href="#home">AI Automation Service</a>
              </li>
              <li>
                <a href="#home">Blog</a>
              </li>
            </ul>
          </div>
          <div className="footer-menu">
            <p className="link-heading">Contact us</p>
              <p className="address">Digital Address:</p>
            <p className="address">GA-408-7212</p>
            <p className="address">Address:</p>
            <p className="address">HOUSE NUMBER 280/7, NEAR RISING STAR ACADAMY, DANSOMAN-KAMARA GUGGISBERG AVENUE ACCRA</p>
            <br/>
            <p className="address">P.O Box DS 1244 Dansoman-Estate, Accra, Ghana</p>
            <br/>
            <p className="address">Phone No:</p>
            <p className="address">+233242887596 / 501399430</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default FooterLinks;
