
import { useState, FormEvent, ChangeEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { userLogin } from '@/services/userServices'
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

