import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Loader2, MailCheck } from 'lucide-react'
import AuthShell from '@/components/layout/AuthShell'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { apiError } from '@/services/api'

export default function ForgotPassword() {
  const { forgotPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      setSent(await forgotPassword(email))
    } catch (err) {
      setError(apiError(err, 'Could not send the reset link.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Forgot your password?"
      subtitle="Enter the email you registered with and we'll send you a link to set a new one."
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="space-y-4">
          <Alert>
            <MailCheck />
            <AlertDescription>{sent.message}</AlertDescription>
          </Alert>

          {sent.resetToken && (
            <div className="rounded-md border border-dashed border-primary/40 bg-accent/60 p-4">
              <p className="font-mono text-[0.7rem] uppercase tracking-widest text-primary">
                Development only
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-accent-foreground">
                Email delivery isn't configured, so here's the reset link:
              </p>
              <Link
                to={`/reset-password/${sent.resetToken}`}
                className="mt-2.5 block truncate font-mono text-xs text-primary underline underline-offset-4"
              >
                /reset-password/{sent.resetToken}
              </Link>
            </div>
          )}
        </div>
      ) : (
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="animate-spin" />}
            {submitting ? 'Sending' : 'Send reset link'}
          </Button>
        </form>
      )}
    </AuthShell>
  )
}
