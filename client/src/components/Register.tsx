// import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { useToast } from "@chakra-ui/react";

// const Register = () => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate()
//   const toast = useToast();

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     axios.post("http://localhost:3000/api/users/signup", {
//       username,
//       email,
//       password
//     }).then(response => {
//       toast({
//         title: 'SignUp ',
//         description: 'User signup successfully',
//         status: 'success',
//         position: "top-right",
//         duration: 2000,
//         isClosable: true,
//       })
//       if(response.data) {
//         navigate('/login')
//       }
//     }).catch(err => {
//       toast({
//         title: 'SignUp failed',
//         description: 'Username and Email must be unique',
//         status: 'error',
//         position: "top-right",
//         duration: 5000,
//         isClosable: true,
//       })
//       console.log(err)
//     })
//   };


//   return (
//     <div className="sign-up-container">
//       <form className="sign-up-form" onSubmit={handleSubmit}>
//         <h2 className="heading">Sign Up</h2>
//         <label htmlFor="username" className="heading">Username:</label>
//         <input
//           type="text"
//           placeholder="Username"
//           required
//           onChange={(e) => setUsername(e.target.value)}
//         />

//         <label htmlFor="email" className="heading">Email:</label>
//         <input
//           type="email"
//           autoComplete="off"
//           placeholder="Email"
//           required
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <label htmlFor="password" className="heading">Password:</label>
//         <input
//           type="password"
//           placeholder="******"
//           required
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button type="submit" className="signup">Sign Up</button>
//         <p className="heading">Have an Account? <Link to="/login">Login</Link></p> 
//       </form>
//     </div>
//   );
// };


import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { createUser } from '@/services/authUser'
import { showToast } from '@/services/showToast'
import { useState, FormEvent, ChangeEvent } from 'react'

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  
  const navigate = useNavigate()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const response = await createUser(formData);
    if(response){
      showToast("Sign Up", "Sign Up Successfull", 'success');
      setFormData({
        name: "",
        email: "",
        password: "",
      });
      if(response.data) {
        navigate('/login')
      }
    } else showToast("Sign Up", "Sign Up Failed", 'error')
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Username</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your username"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </div>
    </div>
  )
}


//export default Register;