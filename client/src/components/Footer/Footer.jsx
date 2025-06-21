import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaSquareFacebook,
  FaInstagram,
  FaSquareXTwitter,
  FaLinkedin,
  FaPhone,
} from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import logo from "../../images/logo.png";

import "./Footer.css";

export default function Footer() {
  return (
    <div className="footer">
      <Container>
        <Row>
          <Col>
            <div className="footer-logo">
              {/* <img src={icon} alt="logo" /> */}
          <img className="nav-logo" src={logo} alt="logo" />
      
            </div>
          </Col>
          <Col >
            <div className="footer-text">
              <h2>Support</h2>
              <p>
                We are a team of students who are passionate about learning and
                sharing knowledge. We are always open to new ideas and
                collaborations. If you have any questions, please contact us at{" "}
                <a href="mailto:helpdesk.elearncode@gmail.com">Here</a><br/>
                Copyright ©2025, All rights reserved.
              </p>
            </div>
          </Col>
          <Col className="colum">
            <Row>
              <div className="footer-contact">
                <h2>Contact Us</h2>
                <Row>
                  <a href="mailto:helpdesk.elearncode@gmail.com">
                    <MdEmail className="contact-icon"/>{" "}
                    support@elearncode.com
                  </a>
                </Row>
                <Row>
                  <p>
                    <FaPhone className="contact-icon"/>{" "}
                    +91-977778888
                  </p>
                </Row>
              </div>
            </Row>
            <Row>
              <div className="footer-text">
                <h2>Follow Us</h2>
                <p>
                  <a
                    className="footer-icon"
                    href="https://www.facebook.com/elearncode"
                  >
                    <FaSquareFacebook className="footer-icon" size={40} />
                  </a>
                  <a
                    className="footer-icon"
                    href="https://www.instagram.com/elearncode/"
                  >
                    <FaInstagram className="footer-icon" size={40} />
                  </a>
                  <a
                    className="footer-icon"
                    href="https://twitter.com/elearncode"
                  >
                    <FaSquareXTwitter  className="footer-icon" size={40} />
                  </a>
                  <a
                    className="footer-icon"
                    href="https://www.linkedin.com/company/elearncode/"
                  >
                    <FaLinkedin className="footer-icon" size={40} />
                  </a>
                </p>
              </div>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
