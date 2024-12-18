import { useEffect } from "react";
import logo from "../images/ui-2.svg";
import { Link } from "react-router-dom";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "@/features/user/userSlice";

const Navbar = () => {
  const dispatch = useDispatch();


  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      dispatch(login(token));
    }
  },[]);
  
  const token = useSelector((state: RootState) => state.user.token);
  //console.log('navbar: ', token);
  return (
    <div className="flex flex-col">
      <header className='h-16 flex items-center bg-[#e6e1d5]'>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-70">
            <div className="flex items-center gap-8 h-full">
              {/* Meetup Logo */}
              <a href="/" className="flex-shrink-0">
                <img
                  src={logo}
                  alt="goodreads Logo"
                  className="h-8"
                />
              </a>
              {/* Search Bar */}
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {
                token ? (<>
                  <Link to="/create"><button className="text-black px-4 py-2 rounded-md hover:bg-slate-500 hover:text-white">Create Book</button></Link>
                  {/* <Link to=""><button className=" text-black px-4 py-2 rounded-md hover:bg-slate-500 hover:text-white">Wishlist</button></Link> */}
                  <Link to="/"><button className="text-black px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white" onClick=
                    {() => {
                      dispatch(logout());
                    }} >Log out</button></Link>
                </>) : (<>
                  <Link to="/login"><button className="text-gray-700 px-4 py-2 rounded-md hover:bg-blue-300 hover:text-white">Log In</button></Link>
                  <Link to="/signup"><button className="text-gray-700 hover:bg-blue-300 hover:text-white">Sign Up</button></Link>
                </>)
              }
            </nav>
          </div>
        </div>
      </header>
   
    </div>
  )
}

export default Navbar