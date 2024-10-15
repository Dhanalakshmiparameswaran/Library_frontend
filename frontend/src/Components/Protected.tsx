import { Navigate } from 'react-router-dom';


const Protected= ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('jwtToken');
  
  if (!token) {
    return <Navigate to="/signin" />;
  }
  
  return children;
};
 
export default Protected;


