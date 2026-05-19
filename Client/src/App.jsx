import React from 'react'
import SuperAdminDashboard from './Pages/SuperAdmin/SuperAdminDashboard'
import {Routes,Route} from "react-router-dom"
import Login from './Pages/Login/Login'
import AdminDashboard from './Pages/Admin/AdminDashboard'
import CustomerDashboard from './Pages/Customer/CustomerDashboard'
import OrdersPage from './Pages/Admin/SubPages/Order/OrdersPage'
import PaymentsPage from './Pages/Admin/SubPages/Payments/PaymenntsPage'
import NoticesPage from './Pages/Admin/SubPages/Notice/NoticePage'
import AdminComplaintsPage from './Pages/Admin/SubPages/Complaints/Complaints'
import DiscountLabels from './Pages/Admin/SubPages/Label/LabelsPage '
import MenuPage from './Pages/Admin/SubPages/Menu/MenuPage'
import OverviewPage from './Pages/Admin/SubPages/Overview/OverviewPage'
import CustomersPage from './Pages/Admin/SubPages/Customers/CustomersPage'

const App = () => {
  return (
    <div>
    <Routes>
     <Route path='/' element={<Login/>}/>  
        <Route path="/admin" element={<AdminDashboard />}>

          <Route index element={<OverviewPage />} />

          <Route path="menu" element={<MenuPage />} />

          <Route path="orders" element={<OrdersPage />} />

          <Route path="payments" element={<PaymentsPage />} />

          <Route path="notices" element={<NoticesPage />} />

          <Route path="customers" element={<CustomersPage/>} />


          <Route
            path="complaints"
            element={<AdminComplaintsPage />}
          />

          <Route path="label" element={<DiscountLabels />} />

        </Route>

     <Route path='/super-admin' element={<SuperAdminDashboard/>}/>  
     <Route path='/customer' element={<CustomerDashboard/>}/>  
    
    </Routes>      
    </div>
  )
}

export default App
