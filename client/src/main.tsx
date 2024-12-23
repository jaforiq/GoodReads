import './index.css'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import { Provider } from "react-redux";
import { store } from './store/store.ts'
import MyBooks from './pages/MyBooks.tsx';
import Login from './components/Login.tsx';
import EditBook from './pages/EditBook.tsx';
import { createRoot } from 'react-dom/client'
import CreateBook from './pages/CreateBook.tsx';
import { ChakraProvider } from '@chakra-ui/react'
import Register from './components/Register.tsx';
import BookDetails from './pages/BookDetails.tsx';
import BookProtectedRoute from './routes/BookProtectedRoute.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

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
      {
        path: "/details/:id",
        element: <BookDetails/>
      },
      {
        path: "/create",
        element: (
        <BookProtectedRoute>
          <CreateBook/>
        </BookProtectedRoute>
        )
      },
      {
        path: "/mybook",
        element: (
          <BookProtectedRoute>
            <MyBooks/>
          </BookProtectedRoute>
          )
      },
      {
        path: "/editbook/:id",
        element: (
          <BookProtectedRoute>
            <EditBook/>
          </BookProtectedRoute>
          )        
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
