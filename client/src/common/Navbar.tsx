import logo from "../images/ui-2.svg";
import { Link } from "react-router-dom";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "@/features/user/userSlice";


const Navbar = () => {
  const dispatch = useDispatch();
  //const [token,setToken] = useState('');
  const token = useSelector((state: RootState) => state.user.token);
  
  //const token = useSelector((state: RootState) => state.user.token);
  //console.log('navbar: ', token);
  return (
    <div className="flex flex-col relative">
      <header className='h-16 mb-10 flex items-center bg-[#e6e1d5] fixed top-0 left-0 right-0 z-10'>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-70">
            <div className="flex items-center gap-8 h-full">
              {/* Meetup Logo */}
              <Link to="/"><img
                  src={logo}
                  alt="goodreads Logo"
                  className="h-8"
                /></Link>
              
              {/* Search Bar */}
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {
                token ? (<>
                  <Link to="/create"><button className="text-black px-4 py-2 rounded-md hover:bg-slate-500 hover:text-white">Create Book</button></Link>
                  <Link to="/mybook"><button className=" text-black px-4 py-2 rounded-md hover:bg-slate-500 hover:text-white">My Book</button></Link>
                  <Link to="/"><button className="text-black px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white" onClick=
                    {() => {
                      dispatch(logout());
                      //localStorage.removeItem("token");
                      //setToken('');
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