import React, { useState } from 'react';
import '../UserDashboard.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Book {
  ID: number;
  bookname: string;
}

interface User {
  ID: number;
  username: string;
  role: string;
  userBooks: string;
}

interface UserBook {
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

const AdminDashboard: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [showBooks, setShowBooks] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showUserBooks, setShowUserBooks] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [bookname, setBookName] = useState('');
  const [username, setUsername] = useState('');
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');
  const [Selected, setSelected] = useState({ UBID: '',});
  const Navigate =useNavigate();

  //show the all books table
  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('No token found');
      
      const response = await axios.get('http://localhost:9082/admin/show', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBooks(response.data);
      setShowBooks(true);
      setShowUsers(false);
      setShowUserBooks(false);
    } catch (error) {
      console.error('Error fetching book details:', error);
    }
  };

  //show the user book table
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('No token found');
      
      const response = await axios.get('http://localhost:9082/admin/viewUser', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(response.data);
      setShowUsers(true);
      setShowBooks(false);
      setShowUserBooks(false);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

 // show the user book details
  const fetchUserBooks = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('No token found');
      
      const response = await axios.get('http://localhost:9082/admin/userbooks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserBooks(response.data);
      setShowUserBooks(true);
      setShowUsers(false);
      setShowBooks(false);
    } catch (error) {
      console.error('Error fetching user book details:', error);
    }
  };

  // add the new book in book table
  const handleAddBook = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('No token found');
      
      await axios.post('http://localhost:9082/admin/createBook', { bookname }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsPopupOpen(false);
      setBookName('');
      fetchBooks(); // Refresh the book list
      } catch (error) {
      console.error('Error adding book:', error);
      }
  };

  // delete the book in book table
  const handleDeleteBook = async (id: number) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('No token found');
      
      await axios.delete(`http://localhost:9082/admin/deleteBook/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBooks(books.filter((book) => book.ID !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  // delete the user book details
  const handleDeleteUserBook = async (UBID: number) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('No token found');
      
      await axios.delete(`http://localhost:9082/admin/deleteUB/${UBID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserBooks(userBooks.filter((userBook) => userBook.UBID !== UBID));
    } catch (error) {
      console.error('Error deleting user book:', error);
    }
  };

  //update the user book details

  const handleUpdateUserBook = async () => {
    try {
      if (!Selected) {
        console.error('Selected user book is null or undefined');
        return;
      }
  
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('No token found');
      }
  
      const updatedUserBookData = {
        username,
        bookname,
        startdate,
        enddate
      };
      const response = await axios.put(
        `http://localhost:9082/admin/updateUB/${Selected.UBID}`,
        updatedUserBookData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.status !== 200) {
        throw new Error(`Update failed with status code ${response.status}`);
      }
      setIsPopupOpen(false);
      setStartDate('');
      setEndDate('');
      fetchUserBooks(); 
    } catch (error) {
      console.error('Error updating user book:', error);
    }
  };
  
// upadate popup sent details
  const openUpdatePopup = (userBook: UserBook) => {
    setUsername(userBook.username.username);
    setBookName(userBook.bookname.bookname);
    setStartDate(userBook.startdate);
    setEndDate(userBook.enddate);
    setSelected({ UBID: userBook.UBID.toString() }); 
    setIsPopupOpen(true);
  };
  
  const handlelogout = ()=>{
    localStorage.removeItem('jwtToken');
    Navigate('/')
  }

  return (
    <>
    {/* navbar for admine dashboard */}
      <div className="user_dashboard">
        <div className="navbar">
          <a className='bl' href="#" onClick={fetchBooks}>Books Details</a>
          <a className='bl' href="#" onClick={fetchUsers}>View Users</a>
          <a className='bl' href="#" onClick={fetchUserBooks}>User Books</a>
          <a className='bl' onClick={handlelogout}>Logout</a>
        </div>
      </div>
      <div className='overallpage'>
      <h1 className='heads'>Welcome...!</h1>

      {/* add new books on book table */}
      {showBooks && (
        <div className="book-list">
          <div>
            <button className='addbn' onClick={() => setIsPopupOpen(true)}>Add</button>
            {isPopupOpen && (
              <div className="popup-box">
                <div className="popup-content">
                  <h2 className='htag'>Enter Book Name</h2>
                  <input type="text" value={bookname} onChange={(e) => setBookName(e.target.value)} />
                  <div className="popup-buttons">
                    <button onClick={handleAddBook} className='Tbn1'>Submit</button>
                    <button onClick={() => setIsPopupOpen(false)} className='Tbn1'>Close</button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div><h1 className='hbook'>Available Books</h1></div>
          <div className="table-container">
            <div className="table-wrapper">
              {books.length > 0 ? (
              <table className='Table'>
                <thead>
                  <tr>
                    <th className ='Thead'>ID</th>
                    <th className='Thead'>Bookname</th>
                    <th className='Thead'>Delete</th>
                 </tr>
               </thead>
               <tbody>
                {books.map((book, index) => (
                 <tr key={index}>
                    <td className='Tabledats'>{book.ID}</td>
                    <td className='Tabledats'>{book.bookname}</td>
                    <td className='Tabledats'>
                      <button className='Tbn' onClick={() => handleDeleteBook(book.ID)}>Delete</button>
                     </td>
                 </tr>
                ))}
                </tbody>
              </table>
              ) : (
              <p>No books available</p>
             )}
            </div>
         </div>
        </div>
      )}
        
      {/* show the all user from user table */}
      {showUsers && (
        <div className="table-wrapper">
          <div><h1 className='hbook'>Available Users</h1></div>
          {users.length > 0 ? (
            <table className='Table'>
              <thead>
                <tr>
                  <th className='Thead'>ID</th>
                  <th className='Thead'>Username</th>
                  <th className='Thead'>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td className='Tabledats'>{user.ID}</td>
                    <td className='Tabledats'>{user.username}</td>
                    <td className='Tabledats'>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users available</p>
          )}
        </div>
      )}

       {/* show the all user book details and perform update and delete function */}
      {showUserBooks && (
         <div className="table-wrapper">
          <div><h1 className='hbook'>User Books</h1></div>
          {userBooks.length > 0 ? (
            <table className='Table'>
              <thead>
                <tr>
                  <th className='Thead'>UBID</th>
                  <th className='Thead'>Username</th>
                  <th className='Thead'>Bookname</th>
                  <th className='Thead'>Start Date</th>
                  <th className='Thead'>End Date</th>
                  <th className='Thead'>Delete</th>
                  <th className='Thead'>Update</th>
                </tr>
              </thead>
              <tbody>
                {userBooks.map((userBook,index) => (
                  <tr key={index}>
                    <td className='Tabledats'>{userBook.UBID}</td>
                    <td className='Tabledats'>{userBook.username.username}</td>
                    <td className='Tabledats'>{userBook.bookname.bookname}</td>
                    <td className='Tabledats'>{userBook.startdate}</td>
                    <td className='Tabledats'>{userBook.enddate}</td>
                    <td className='Tabledats'>
                      <button className='Tbn' onClick={() => handleDeleteUserBook(userBook.UBID)}>Delete</button></td><td className='Tabledats'>
                      <button className='Tbn' onClick={() => openUpdatePopup(userBook)}>Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No user books available</p>
          )}
          {isPopupOpen && (
           <div className="popup-box">
            <div className="popup-content">
            <h2 className='htag'>Update User Book</h2>
            <div className='col'>
                <label htmlFor="UBID">UBID:</label>
                <input type="text" value={Selected.UBID} readOnly />
            </div>
              <div className='col'>
                <label htmlFor="startdate">Start Date:</label>
                <input type="date" value={startdate} onChange={(e) => setStartDate(e.target.value)} />
               </div>
            <div className='col'>
                 <label htmlFor="enddate">End Date:</label>
                 <input type="date" value={enddate} onChange={(e) => setEndDate(e.target.value)} />
             </div>
           <div className="popup-buttons">
               <button onClick={()=>handleUpdateUserBook()} className='Tbn1'>Submit</button>
             <button onClick={() => { setIsPopupOpen(false); setUsername(''); setBookName(''); setStartDate(''); setEndDate(''); }} className='Tbn1'>Close</button>
          </div>
          </div>
       </div>
          )}
        </div>
      )}
      </div>
    </>
  );
};

export default AdminDashboard;

