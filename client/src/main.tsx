import './index.css'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import { Provider } from "react-redux";
import { store } from './store/store.ts'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';

const router = createBrowserRouter([
  {
    path:"/",
    element: <App/>,
    children: [
      {
        path: "",
        element: <Home/>
      },
      {
        path: "/login",
        element: <Login/>
      },
      {
        path: "/signup",
        element: <Register/>
      },
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ChakraProvider>
      {/* <App /> */}
      <RouterProvider router={router}/>
    </ChakraProvider>
  </Provider>
)
