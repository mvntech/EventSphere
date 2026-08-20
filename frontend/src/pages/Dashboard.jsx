import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'

const roleLabels = {
  admin: 'Organizer',
  exhibitor: 'Exhibitor',
  attendee: 'Attendee',
}

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-svh bg-muted/40">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-md bg-primary font-mono text-sm font-semibold text-primary-foreground">
              ES
            </span>
            <span className="font-serif text-lg">EventSphere</span>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut />
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary">
          Signed in
        </p>
        <h1 className="mt-2 font-serif text-3xl text-foreground">Hello, {user.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your {roleLabels[user.role]} dashboard is next up in the build.
        </p>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              {[
                ['Name', user.name],
                ['Email', user.email],
                ['Role', roleLabels[user.role]],
                ['Company', user.company || '—'],
                ['Phone', user.phone || '—'],
                ['User ID', user._id],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-0.5 break-all text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
