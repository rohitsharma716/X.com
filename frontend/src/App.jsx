import React from "react"
import { Route , Routes } from "react-router-dom"
import { Navigate } from "react-router-dom" 

import Home from "./pages/home/HomePage.jsx"
import Login from "./pages/auth/login/LogIn.jsx"
import SignUp from "./pages/auth/signup/signUpPage.jsx"
import NotificationPage from "./pages/notification/NotificationPage.jsx"
import ProfilePage from "./pages/profile/ProfilePage.jsx"

import Sidebar from "./components/common/Sidebar.jsx"
import RightPanel from "./components/common/RightPanel.jsx"
import { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import LoadingSpinner from "./components/common/LoadingSpinner.jsx"

function App() {

  const {data:authUser, isLoading } = useQuery({
        queryKey: ["authUser"],
        queryFn : async () => {
        try{
          const res = await fetch("/api/auth/me");
          const data = await res.json();
          if(data.error)  return null;
          if(!res.ok){
             throw new Error(data.error || "Failed to fetch user data")
          }
          console.log("user data",data);
          return data;
          
        }catch(error){
          throw new Error(error);
        }
      },
      retry: false,
  });

  if(isLoading){
     return (
      <div className="h-screen flex items-center justify-center" >
        <LoadingSpinner size="lg" />
      </div>
     )
  }

  return (
    <div className="flex max-w-6xl mx-auto">
       {authUser && <Sidebar/>}
       <Routes>
         <Route path="/" element={ authUser ? <Home/> : <Navigate to='/login  '/>}/>
         <Route path="/login" element={!authUser ? <Login/> : <Navigate to='/'/>}/>
         <Route path="/signup" element={!authUser ? <SignUp/> : <Navigate to='/'/>}/>
         <Route path="/notifications" element={ authUser ?  <NotificationPage/> : <Navigate to='/login'/>}/>
         <Route path="/profile/:username" element={authUser ?  <ProfilePage/> : <Navigate to='/login'/>}/>
       </Routes>
      {  authUser && <RightPanel/>}
       <Toaster/>
      
    </div>
  )
}

export default App
