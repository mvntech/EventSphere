import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AlertCircle, Loader2 } from 'lucide-react'
import AuthShell from '@/components/layout/AuthShell'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { apiError } from '@/services/api'

export default function ResetPassword() {
  const { token } = useParams()
  const { resetPassword } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ password: '', confirm: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Those passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      // the API signs the user straight back in, so land them inside
      await resetPassword(token, form.password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(apiError(err, 'Could not reset your password.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Set a new password"
      subtitle="Choose something you haven't used before. You'll be signed in right after."
      footer={
        <>
          Link expired?{' '}
          <Link to="/forgot-password" className="font-medium text-primary hover:underline">
            Request a new one
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
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={form.password}
            onChange={update('password')}
            placeholder="At least 6 characters"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            required
            value={form.confirm}
            onChange={update('confirm')}
            placeholder="Type it again"
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" />}
          {submitting ? 'Saving' : 'Save new password'}
        </Button>
      </form>
    </AuthShell>
  )
}
