import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedProps {
  children: JSX.Element;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const token = localStorage.getItem('jwtToken');
  
  if (!token) {
    return <Navigate to="/signin" />;
  }
  
  return children;
};

export default Protected;
