import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-canvas text-body">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-primary text-primary-foreground">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                <path d="M12 2L2 22h20L12 2z" />
              </svg>
            </div>
            <span className="text-base font-semibold text-ink">Aidra</span>
          </div>
          <p className="mt-4 max-w-xs text-xs text-mute leading-relaxed">
            Developer-grade AI clinical assistant and verified physician workspace built for precision healthcare.
          </p>
        </div>

        <div>
          <div className="font-mono text-xs font-medium uppercase tracking-wider text-ink">For Patients</div>
          <ul className="mt-4 space-y-2.5 text-xs text-body">
            <li><Link to="/auth" className="hover:text-ink transition-colors">Sign In / Sign Up</Link></li>
            <li><Link to="/" hash="features" className="hover:text-ink transition-colors">AI Symptoms Assistant</Link></li>
            <li><Link to="/" hash="how" className="hover:text-ink transition-colors">BMI & Health Tracking</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-xs font-medium uppercase tracking-wider text-ink">For Physicians</div>
          <ul className="mt-4 space-y-2.5 text-xs text-body">
            <li><Link to="/for-doctors" className="hover:text-ink transition-colors">Doctor Verification Overview</Link></li>
            <li><Link to="/doctor-auth" className="hover:text-ink transition-colors">Submit Credentials</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-xs font-medium uppercase tracking-wider text-ink">Medical Notice</div>
          <p className="mt-4 text-xs text-mute leading-relaxed">
            Aidra AI provides health information for educational guidance and does not replace emergency medical care.
          </p>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-mute">
        © {new Date().getFullYear()} Aidra Health Inc. All rights reserved.
      </div>
    </footer>
  );
}
