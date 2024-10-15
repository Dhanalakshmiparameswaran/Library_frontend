import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css'
import { useNavigate } from 'react-router-dom';

interface RegisterFormState {
  name: string;
  password: string;
}

const Reg_form: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormState>({
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
      const response = await axios.post('http://localhost:9082/auth/signup', {
        username: formData.name,
        password: formData.password,
      });
      alert('Successfully registered');
      console.log('User registered:', response.data);
      navigate('/signin');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <>
    <div className='FormBody'>
      <h2 className='Formtitle'>Registration Form</h2>
      <form className='Form' onSubmit={handleSubmit}>
        <div className='row'><label htmlFor="name">Name:</label><div className='col'></div>
          <div className='col'><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
        </div>
        <div className='row'>
          <div className='col'><label htmlFor="password">Password:</label></div>
          <div className='col'><input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required/></div>
        </div>
        {/* <div className='row'>
            <div className="col"><label htmlFor="role">Select Your role:</label></div>
            <div className="col"><select className='selectbox'><option value="User">User</option><option value="Admin">Admin</option></select></div>
        </div> */}
        <button className='formbtn' type="submit">Submit</button>
      </form>
      <div className='Formfoot'>
      <label htmlFor="login">Already have an account? </label>
        <Link to="/signin">Login</Link>
        </div>
    </div>
    </>
  );
};

export default Reg_form;
