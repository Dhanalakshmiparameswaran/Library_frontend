import { BrowserRouter , Route,Routes} from 'react-router-dom';
import './App.css'
import Reg_form from './Components/Reg_form'
import Login from './Components/Login';
import Home from './Components/Home';
import UserDashboard from './Components/UserDashboard'
import AdminDashboard from './Components/AdminDashboard';
import Protected from './Components/Protected';

function App() {

  return (
    <>
      <BrowserRouter>
       <Routes>
        <Route path="/" element={<Home/>}/> 
         <Route path="/signup" element={<Reg_form/>}/>
         <Route path="/signin" element={<Login/>}/>
         <Route path="/admin" element={<Protected><AdminDashboard/></Protected>}/> 
         <Route path="/user" element={<Protected><UserDashboard/></Protected>}/> 
       </Routes>
     </BrowserRouter>
     
    </>
  )
}

export default App
