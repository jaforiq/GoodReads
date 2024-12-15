// import React, { useState } from "react";
// import "../App.css";
// import Axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { useToast } from "@chakra-ui/react";
// import { userLogin } from "../services/authUser";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
//   });

//   const navigate = useNavigate()
//   const toast = useToast();
  
//   Axios.defaults.withCredentials = true;
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     try{
//       const response = await userLogin(formData);

//     }

//     Axios.post("http://localhost:3000/api/users/login", {
//       email,
//       password
//     }).then(response => {
//       if(response.data) {
//           //console.log(response.data);
//           localStorage.setItem("token", response.data.token);
//           navigate('/')
//           toast({
//             title: 'Login',
//             description: 'User Login Successfull',
//             status: 'success',
//             position: "top-right",
//             duration: 2000,
//             isClosable: true,
//           })
//         }
//     }).catch(err => {
//       toast({
//         title: 'Login Failed',
//         description: 'Please enter your correct email or password',
//         status: 'error',
//         position: "top-right",
//         duration: 5000,
//         isClosable: true,
//       })
//         console.log(err)
//     })
//   };


//   return (
//     <div className="sign-up-container">
//       <form className="sign-up-form" onSubmit={handleSubmit}>
//         <h2 className="heading">Loign</h2>

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

//         <button type="submit" className="login">Login</button>
//         <p className="heading">Don't Have Account? <Link to="/signup">Sign Up</Link></p> 
//       </form>
//     </div>
//   );
// };

// export default Login;



import { useState, FormEvent, ChangeEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { userLogin } from '@/services/authUser'
import { showToast } from '@/services/showToast'
import { useDispatch } from 'react-redux'
import { login } from '@/features/user/userSlice'
import { Link, useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try{
      //console.log('form: ', loginData);
       const response = await userLogin(loginData);
       //console.log('res: ', response);
       if(response) {
        localStorage.setItem("token", response.token);
        dispatch(login(response.token));
        navigate('/')        
        showToast("Log In", "User Login Successfull", 'success');
       } else {
        showToast("Log In", "User login Failed", 'error');
       }
      
      } catch (err: any){
        showToast("Log In", "User login Failed", 'error');
      }
    //setLoginData({ email: "", password: "" })
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={loginData.email}
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
                value={loginData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Log in
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup"><a href="/register" className="text-blue-600 hover:underline">
              Sign up
            </a></Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

