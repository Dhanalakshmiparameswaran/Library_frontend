import React, { useState } from 'react';
import '../UserDashboard.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Book {
  ID: number;
  bookname: string;
}

interface BorrowedBook {
  UBID: number;
  bookname: {
    ID: number;
    bookname: string;
  };
  username: {
    ID: number;
    username: string;
  };
  startdate: string;
  enddate: string;
}

const UserDashboard: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [showAvailableBooks, setShowAvailableBooks] = useState(false);
  const [showBorrowedBooks, setShowBorrowedBooks] = useState(false);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [username, setUsername] = useState('');
  const Navigate =useNavigate();

  //show book detalis
  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('No token found');

      const response = await axios.get('http://localhost:9082/user/books', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Fetched books:', response.data);
      setBooks(response.data);
      setShowAvailableBooks(true);
     setShowBorrowedBooks(false);
    } catch (error) {
      console.error('Error fetching book details:', error);
    }
  };
 //show the borrowed book
  const fetchBorrowedBooks = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('No token found');
      const response = await axios.get('http://localhost:9082/user/borrowed', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Fetched borrowed books:', response.data); 
      setBorrowedBooks(response.data);
      setShowBorrowedBooks(true);
      setShowAvailableBooks(false);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
    }
  };


  // show the borrow book details
  const handleBorrow = async () => {
    if (!startdate || !enddate || !selectedBook || !username) {
      console.error('Missing required fields');
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('No token found');

      await axios.post('http://localhost:9082/user/borrow', {
        username,
        bookname: selectedBook.bookname,
        startdate,
        enddate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchBooks(); 
      setPopupVisible(false); 
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };
 const handlelogout = ()=>{
    localStorage.removeItem('jwtToken');
    Navigate('/')
  }
  return (
    <>
     {/* navbar */}
      <div className="user_dashboard">
        <div className="navbar">
          <span className='bl' onClick={()=>fetchBorrowedBooks()}>Borrowed Books</span>
          <span className='bl' onClick={fetchBooks}>Available Books</span>
          <span className='bl' onClick={handlelogout}>Logout</span>
        </div>
      </div>
      <h1 className='heads'>Welcome...!</h1>
        
        {/* available book and user can borrow the book */}
        {showAvailableBooks ? (
          books.length > 0 ? (
            <table className='Table'>
              <thead>
                <tr>
                  <th className='Thead'>Book Name</th>
                  <th className='Thead'>Borrow</th>
                </tr>
              </thead>
              <tbody>
              {books.map((book) => (
                <tr key={book.ID}>
                   <td className='Tabledats'>{book.bookname}</td>
                   <td className='Tabledats'>
                   <button className='Tbn' onClick={() => {
                    setSelectedBook(book);
                    setPopupVisible(true);
                  }}>Borrow</button>
                  </td>
                </tr>
               ))}
              </tbody>
            </table>
          ) : (
            <p>No available books</p>
          )
        ) : (
          <p>Click "Available Books" to see available books</p>
        )}
         
         {/* show the borrowed book and starting and ending date */}
        {showBorrowedBooks && borrowedBooks.length > 0 && (
          <div>
            <h2>Borrowed Books</h2>
            <table className='Table'>
            <thead>
            <tr>
              <th className='Thead'>Book ID</th>
              <th className='Thead'>Book Name</th>
              <th className='Thead'>Username</th>
              <th className='Thead'>Start Date</th>
              <th className='Thead'>End Date</th>
            </tr>
          </thead>
          <tbody>
            {borrowedBooks.map((borrowedBook,index) => (
              <tr key={borrowedBook.UBID || index}>
                <td className='Tabledats'>{borrowedBook.UBID}</td>
                <td className='Tabledats'>{borrowedBook.bookname.bookname}</td>
                <td className='Tabledats'>{borrowedBook.username.username}</td>
                <td className='Tabledats'>{borrowedBook.startdate}</td>
                <td className='Tabledats'>{borrowedBook.enddate}</td>
              </tr>
            ))}
          </tbody>
            </table>
          </div>
        )}
      
      {/* perform borrowd function pupup for books */}
      {popupVisible && selectedBook && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={() => setPopupVisible(false)}>&times;</span>
            <h2 className='pophead'>Borrow Book</h2>
            <div className='popdiv'>
              <label>Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className='popdiv'>
              <label>Book name:</label>
              <input type="text" value={selectedBook.bookname} readOnly />
            </div>
            <div className='popdiv'>
              <label>Start Date:</label>
              <input type="date" value={startdate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className='popdiv'>
              <label>End Date:</label>
              <input type="date" value={enddate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <button onClick={handleBorrow}>Borrow</button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDashboard;

