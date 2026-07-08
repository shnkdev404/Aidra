import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="serif text-2xl">Aidra</div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            An unhurried health companion. AI guidance, verified doctors, and the quiet
            tools you actually keep using.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Patients</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/auth" className="hover:underline underline-offset-4">Sign in</Link></li>
            <li><Link to="/" hash="features" className="hover:underline underline-offset-4">Features</Link></li>
            <li><Link to="/" hash="how" className="hover:underline underline-offset-4">How it works</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Doctors</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/for-doctors" className="hover:underline underline-offset-4">Overview</Link></li>
            <li><Link to="/doctor-auth" className="hover:underline underline-offset-4">Verify credentials</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Practice</div>
          <p className="mt-4 text-sm text-muted-foreground">
            Aidra is not a substitute for professional medical care. In an emergency,
            call your local emergency line.
          </p>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Aidra. Made with care.
      </div>
    </footer>
  );
}
