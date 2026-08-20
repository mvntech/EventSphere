import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2 } from 'lucide-react'
import AuthShell from '@/components/layout/AuthShell'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { apiError } from '@/services/api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(form.email, form.password)
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (err) {
      setError(apiError(err, 'Could not sign you in.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      subtitle="Pick up where you left off — your expos, booths and sessions are waiting."
      footer={
        <>
          New to EventSphere?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={update('email')}
            placeholder="you@company.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs text-muted-foreground hover:text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={update('password')}
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" />}
          {submitting ? 'Signing in' : 'Sign in'}
        </Button>
      </form>
    </AuthShell>
  )
}
