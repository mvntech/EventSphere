import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedRoute, { GuestRoute } from '@/routes/ProtectedRoute'
import Home from '@/pages/public/Home'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import ResetPassword from '@/pages/auth/ResetPassword'
import Dashboard from '@/pages/Dashboard'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password/:token', element: <ResetPassword /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [{ path: '/dashboard', element: <Dashboard /> }],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

export default router
