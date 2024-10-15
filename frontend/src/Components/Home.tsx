import '../App.css'
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
    <div className='bd'>
     <nav className='Navbar'>
      <ul className='Navbar-container'>
        <li className='Navbar-list'>
          <h1 className='Navhead'>Library</h1>
        </li>
        <li className='Navbar-list'>
          <Link className='Navbar-iteam' to="/">Home</Link>
        </li>
        <li>
          <Link className='Navbar-iteam' to="/signin">Login</Link>
        </li>
        <li>
          <Link className='Navbar-iteam' to="/signup">Registration</Link>
        </li>
      </ul>
    </nav>
    <h1 className='title-h'>Welcome our library webside</h1>
    </div>
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h2>Library Management System</h2>
          <p>Providing access to a world of information and ideas.</p>
        </div>
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>123 Library Street, Booktown</p>
          <p>Email: librarymanagement@gmail.com</p>
          <p>Phone: 936-456-7890</p>
        </div>
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <a href="https://www.facebook.com" >Facebook</a>
          <a href="https://www.twitter.com" >Twitter</a>
          <a href="https://www.instagram.com">Instagram</a>
        </div>
      </div>
    </footer> 
    </>
  )
}

export default Home
