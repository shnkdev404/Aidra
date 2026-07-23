import { Link } from "@tanstack/react-router";
import { HeartPulse } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[#282828] bg-black text-[#b3b3b3]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1DB954] text-black">
              <HeartPulse className="h-4 w-4 fill-black" />
            </div>
            <span className="text-xl font-bold text-white">Aidra</span>
          </div>
          <p className="mt-4 max-w-xs text-xs text-[#a7a7a7] leading-relaxed">
            Your always-on AI health companion and verified physician workspace.
          </p>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white">For Patients</div>
          <ul className="mt-4 space-y-2 text-xs">
            <li><Link to="/auth" className="hover:text-[#1DB954] transition-colors">Sign In / Sign Up</Link></li>
            <li><Link to="/" hash="features" className="hover:text-[#1DB954] transition-colors">AI Symptoms Assistant</Link></li>
            <li><Link to="/" hash="how" className="hover:text-[#1DB954] transition-colors">BMI & Health Tracking</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white">For Physicians</div>
          <ul className="mt-4 space-y-2 text-xs">
            <li><Link to="/for-doctors" className="hover:text-[#1DB954] transition-colors">Doctor Verification Overview</Link></li>
            <li><Link to="/doctor-auth" className="hover:text-[#1DB954] transition-colors">Submit Credentials</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white">Medical Notice</div>
          <p className="mt-4 text-xs text-[#a7a7a7] leading-relaxed">
            Aidra AI provides health information for educational guidance and does not replace emergency medical care.
          </p>
        </div>
      </div>

      <div className="border-t border-[#282828] py-6 text-center text-xs text-[#a7a7a7]">
        © {new Date().getFullYear()} Aidra Health. All rights reserved.
      </div>
    </footer>
  );
}
