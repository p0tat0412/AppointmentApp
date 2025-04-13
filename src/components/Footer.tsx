import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MedStudent</h3>
            <p className="text-gray-300 mb-4">
              Connecting students with quality healthcare services on campus and
              beyond.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/booking"
                  className="ttext-gray-300 hover:text-white transition-color"
                >
                  Booking
                </Link>
              </li>
              <li>
                <Link
                  to="/medical-history"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Medical History
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  General Medicine
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dermatology
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Cardiology
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Psychology
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Emergency Care
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-300">
                  123 University Ave, Campus Medical Center, Building A
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3" />
                <span className="text-gray-300">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3" />
                <span className="text-gray-300">health@university.edu</span>
              </li>
              <li className="flex items-center">
                <FaClock className="mr-3" />
                <span className="text-gray-300">
                  Mon-Fri: 8:00 AM - 6:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} MedStudent. All rights reserved.
          </p>
          <div className="mt-2 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>{" "}
            |
            <a href="#" className="hover:text-white transition-colors ml-2">
              Terms of Service
            </a>{" "}
            |
            <a href="#" className="hover:text-white transition-colors ml-2">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
