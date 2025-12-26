import './App.css'
import UserSignIn from './pages/UserSignIn'
import UserSignUp from './pages/UserSignUp'
import AdminSignIn from './pages/AdminSignIn'
import AdminSignUp from './pages/AdminSignUp'
import Courses from './pages/Courses'
import Navbar from './components/layout/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import CreateCourse from './pages/CreateCourse'
import MyPurchases from './pages/MyPurchases'
import UpdateCourse from './pages/UpdateCourse'

function App() {
  return (
    <BrowserRouter>
      {/* Placing Navbar HERE (outside Routes) means 
         it stays visible on EVERY page automatically.
      */}
      <Navbar /> 
      <Routes>
        {/* Public / Student Routes */}
        <Route path="/" element={<Courses />} /> 
        <Route path="/signup" element={<UserSignUp />} />
        <Route path="/login" element={<UserSignIn />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/my-courses" element={<MyPurchases />} />

        {/* Admin Routes */}
        <Route path="/admin/signup" element={<AdminSignUp />} /> 
        <Route path="/admin/login" element={<AdminSignIn />} />  
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-course" element={<CreateCourse />} />
        <Route path="/admin/update-course/:courseId" element={<UpdateCourse />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
