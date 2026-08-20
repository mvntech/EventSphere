import { Link } from 'react-router-dom'

// split layout shared by all four auth screens: a color-blocked brand panel
// on the left, the form on the right. On mobile the panel collapses to a band.
export default function AuthShell({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative overflow-hidden bg-primary px-6 py-10 text-primary-foreground lg:px-14 lg:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, currentColor 0 2px, transparent 2px 22px)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -bottom-32 size-96 rounded-full bg-accent/20 blur-2xl"
        />

        <div className="relative flex h-full flex-col justify-between gap-10">
          <Link to="/" className="inline-flex items-center gap-2.5 self-start">
            <span className="grid size-8 place-items-center rounded-md bg-primary-foreground font-mono text-sm font-semibold text-primary">
              ES
            </span>
            <span className="font-serif text-lg tracking-tight">EventSphere</span>
          </Link>

          <div className="max-w-md space-y-5">
            <h2 className="font-serif text-3xl leading-tight lg:text-[2.6rem] lg:leading-[1.15]">
              Every expo,
              <br />
              running in one place.
            </h2>
            <p className="text-sm leading-relaxed text-primary-foreground/80">
              Organizers plan the floor. Exhibitors claim their space. Attendees build their
              schedule. All of it live, all of it in sync.
            </p>
          </div>

          <dl className="hidden gap-px overflow-hidden rounded-md border border-primary-foreground/15 bg-primary-foreground/15 sm:grid sm:grid-cols-3">
            {[
              ['Organizers', 'Expos, booths, schedule'],
              ['Exhibitors', 'Apply, reserve, showcase'],
              ['Attendees', 'Browse, bookmark, connect'],
            ].map(([role, blurb]) => (
              <div key={role} className="bg-primary px-4 py-3.5">
                <dt className="font-mono text-[0.65rem] uppercase tracking-widest text-primary-foreground/60">
                  {role}
                </dt>
                <dd className="mt-1 text-xs text-primary-foreground/90">{blurb}</dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>

      <main className="flex items-center justify-center bg-background px-6 py-12 lg:px-12">
        <div className="w-full max-w-sm">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-serif text-3xl text-foreground">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
          )}

          <div className="mt-8">{children}</div>

          {footer && (
            <div className="mt-8 border-t border-border pt-5 text-sm text-muted-foreground">
              {footer}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
