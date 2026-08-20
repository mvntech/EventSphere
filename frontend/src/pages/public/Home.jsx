import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

// Temporary entry point. The real landing page (Section 2.4 browse) replaces this.
export default function Home() {
  return (
    <div className="grid min-h-svh place-items-center bg-background px-6">
      <div className="max-w-md text-center">
        <span className="mx-auto grid size-10 place-items-center rounded-md bg-primary font-mono text-sm font-semibold text-primary-foreground">
          ES
        </span>
        <h1 className="mt-6 font-serif text-4xl text-foreground">Welcome to EventSphere!</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Expos, booths and schedules for organizers, exhibitors and attendees.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/register">Create account</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
