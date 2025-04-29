import React from "react"
import { Route , Routes } from "react-router-dom"

import Home from "./pages/home/HomePage.jsx"
import Login from "./pages/auth/login/LogIn.jsx"
import SignUp from "./pages/auth/signup/signUpPage.jsx"
import NotificationPage from "./pages/notification/NotificationPage.jsx"
import ProfilePage from "./pages/profile/ProfilePage.jsx"

import Sidebar from "./components/common/Sidebar.jsx"
import RightPanel from "./components/common/RightPanel.jsx"

function App() {

  return (
    <div className="flex max-w-6xl mx-auto">
       <Sidebar/>
       <Routes>
         <Route path="/" element={<Home/>}/>
         <Route path="/login" element={<Login/>}/>
         <Route path="/signup" element={<SignUp/>}/>
         <Route path="/notifications" element={<NotificationPage/>}/>
         <Route path="/profile/:username" element={<ProfilePage/>}/>
       </Routes>
       <RightPanel/>
      
    </div>
  )
}

export default App
