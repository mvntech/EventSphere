import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// wraps routes that need a session. pass `roles` to also restrict by role,
// mirroring authorize(...roles) on the backend.
export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Checking your session
        </p>
      </div>
    )
  }

  if (!user) {
    // remember where they were headed so login can send them back
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

// the inverse: keeps signed-in users off the auth screens.
export function GuestRoute() {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />
}
