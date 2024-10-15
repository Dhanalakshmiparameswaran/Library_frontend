import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode }from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../App.css'

interface JwtDecode {
  id: string;
  role: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({...formData,[name]: value,});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9082/auth/signin', {
        username: formData.name,
        password: formData.password,
      });

      console.log('User logged in:', response.data);

      const token = response.data;
      localStorage.setItem('jwtToken', token);
      if (token) {
        const decodedToken: JwtDecode = jwtDecode(token);
        const userRole = decodedToken.role;
 
        if (userRole === 'admin') {
          navigate('/admin');
        } else {
          alert('success to login');
          navigate('/user');
        }
      } else {
        console.error('Error logging in: Token is empty or null');
      }
    } catch (error) {
      alert('User name or password wrong');
      console.error('Error logging in:', error);
    }
  };

  return (
    <>
    <div className='FormBody'>
      <h2 className='Formtitle'>Login</h2>
      <form className='Form' onSubmit={handleSubmit}>
        <div className='row'><div className='col'><label htmlFor="name">Name:</label></div>
          <div className='col'><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
        </div>
        <div className='row'>
          <div className='col'><label htmlFor="password">Password:</label></div>
          <div className='col'><input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required/></div>
        </div>
        <button className='formbtn' type="submit">Submit</button>
      </form>
      <div className='Formfoot'>
            <label  htmlFor="login"> You don't have an account? <Link className='bn' to={'/signup'} >Registration</Link></label>
      </div>
    </div>
    </>
  );
};

export default Login;
