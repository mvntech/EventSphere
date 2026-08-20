import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, CalendarCog, Loader2, Store, Ticket } from 'lucide-react'
import AuthShell from '@/components/layout/AuthShell'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useAuth } from '@/context/AuthContext'
import { apiError } from '@/services/api'
import { cn } from '@/lib/utils'

const roles = [
  {
    value: 'attendee',
    label: 'Attendee',
    blurb: 'Browse expos, bookmark sessions, message exhibitors',
    Icon: Ticket,
  },
  {
    value: 'exhibitor',
    label: 'Exhibitor',
    blurb: 'Apply to expos, reserve a booth, showcase products',
    Icon: Store,
  },
  {
    value: 'admin',
    label: 'Organizer',
    blurb: 'Run expos, allocate booths, manage the schedule',
    Icon: CalendarCog,
  },
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'attendee',
    company: '',
    phone: '',
  })
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

    setSubmitting(true)
    try {
      await register(form)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(apiError(err, 'Could not create your account.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Join EventSphere"
      title="Create your account"
      subtitle="Choose how you'll take part — you can be an organizer, an exhibitor or an attendee."
      footer={
        <>
          Already registered?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in instead
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

        <fieldset className="space-y-2.5">
          <legend className="mb-2.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
            I'm joining as
          </legend>
          <RadioGroup
            value={form.role}
            onValueChange={(role) => setForm({ ...form, role })}
            className="gap-2.5"
          >
            {roles.map(({ value, label, blurb, Icon }) => {
              const selected = form.role === value
              return (
                <Label
                  key={value}
                  htmlFor={`role-${value}`}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-md border p-3.5 transition-colors',
                    selected
                      ? 'border-primary bg-accent'
                      : 'border-border hover:border-primary/40 hover:bg-muted'
                  )}
                >
                  <RadioGroupItem value={value} id={`role-${value}`} className="mt-0.5" />
                  <Icon
                    className={cn(
                      'mt-px size-4 shrink-0',
                      selected ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                  <span className="space-y-0.5">
                    <span
                      className={cn(
                        'block text-sm font-medium',
                        selected ? 'text-accent-foreground' : 'text-foreground'
                      )}
                    >
                      {label}
                    </span>
                    <span className="block text-xs font-normal leading-relaxed text-muted-foreground">
                      {blurb}
                    </span>
                  </span>
                </Label>
              )
            })}
          </RadioGroup>
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            autoComplete="name"
            required
            value={form.name}
            onChange={update('name')}
            placeholder="Ada Lovelace"
          />
        </div>

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
          <Label htmlFor="password">Password</Label>
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

        {form.role === 'exhibitor' && (
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              autoComplete="organization"
              value={form.company}
              onChange={update('company')}
              placeholder="Northwind Robotics"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={update('phone')}
            placeholder="+1 555 0123"
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" />}
          {submitting ? 'Creating account' : 'Create account'}
        </Button>
      </form>
    </AuthShell>
  )
}
