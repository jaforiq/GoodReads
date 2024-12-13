import { Link } from "react-router-dom";
import logo from "../images/ui-2.svg";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/features/user/userSlice";
import { RootState } from "@/store/store";

const Navbar = () => {

  const token = useSelector((state: RootState) => state.user.token)
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col">
      <header className='h-16 flex items-center'>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-70">
            <div className="flex items-center gap-8 h-full">
              {/* Meetup Logo */}
              <a href="/" className="flex-shrink-0">
                <img
                  src={logo}
                  alt="Meetup Logo"
                  className="h-8"
                />
              </a>
              {/* Search Bar */}
              {/* <InputGroup>
                <Input ref={searchByTitleRef} type='text' className='m-0 rounded-l-lg' placeholder='Search by event title' onChange={handleInputChange}/>
                <Input ref={searchByLocationRef} type='text' className='m-0' rounded={'none'} placeholder='Search by location' />
                <InputRightAddon children={<Search className="h-5 w-5" />}  />
              </InputGroup> */}
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {/* <div className="flex items-center gap-1">
                <Globe className="h-5 w-5" />
                English
              </div> */}
              {
                token ? (<>
                  <Link to="/createevent"><button className="text-black px-4 py-2 rounded-md hover:bg-slate-500">Create Book</button></Link>
                  <Link to="/userevent"><button className=" text-black px-4 py-2 rounded-md hover:bg-slate-500">Your Book</button></Link>
                  <Link to="/"><button className="text-black px-4 py-2 rounded-md hover:bg-blue-600" onClick=
                    {() => {
                      dispatch(logout());
                    }} >Log out</button></Link>
                </>) : (<>
                  <Link to="/login"><button className="text-gray-700 hover:text-gray-900">Log in</button></Link>
                  <Link to="/signup"><button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Sign up</button></Link>
                </>)
              }
            </nav>

            {/* Mobile Menu */}
            {/* <button className="md:hidden text-gray-700">
              <Menu className="h-6 w-6" />
            </button> */}
          </div>
        </div>
      </header>
   
    </div>
  )
}

export default Navbar