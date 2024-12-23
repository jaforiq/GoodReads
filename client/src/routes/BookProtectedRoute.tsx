import { Navigate } from 'react-router-dom';

interface Props {
  children: JSX.Element;
}

const BookProtectedRoute = ({ children }: Props) => {
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;

  return isAuthenticated ? children : <Navigate to="/" replace />;
  
}

export default BookProtectedRoute