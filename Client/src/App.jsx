import React from 'react'
import SuperAdminDashboard from './Pages/SuperAdmin/SuperAdminDashboard'
import {Routes,Route} from "react-router-dom"
import Login from './Pages/Login/Login'
import AdminDashboard from './Pages/Admin/AdminDashboard'
import CustomerDashboard from './Pages/Customer/CustomerDashboard'

const App = () => {
  return (
    <div>
    <Routes>
     <Route path='/' element={<Login/>}/>  
     <Route path='/admin' element={<AdminDashboard/>}/>  
     <Route path='/super-admin' element={<SuperAdminDashboard/>}/>  
     <Route path='/customer' element={<CustomerDashboard/>}/>  
    
    </Routes>      
    </div>
  )
}

export default App
