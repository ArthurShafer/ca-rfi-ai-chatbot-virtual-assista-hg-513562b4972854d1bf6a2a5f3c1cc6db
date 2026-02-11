"use client";

const DEPARTMENTS = [
  { name: "Health & Human Services", desc: "CalFresh, Medi-Cal, social services, behavioral health", icon: "heart" },
  { name: "Resource Management Agency", desc: "Building permits, planning, code enforcement, environmental health", icon: "building" },
  { name: "Clerk-Recorder", desc: "Birth certificates, marriage licenses, property records", icon: "document" },
  { name: "Tax Collector", desc: "Property tax payments, due dates, tax sale information", icon: "currency" },
  { name: "Animal Services", desc: "Adoptions, licensing, lost pets, shelter locations", icon: "paw" },
  { name: "Sheriff's Office", desc: "Public safety, records requests, community programs", icon: "shield" },
];

const QUICK_LINKS = [
  "Pay Property Taxes Online",
  "Apply for CalFresh Benefits",
  "Request a Birth Certificate",
  "Building Permit Applications",
  "Report a Code Violation",
  "Find Vaccination Clinics",
];

const NEWS = [
  { date: "Feb 10, 2026", title: "Board of Supervisors Approves 2026-27 Budget Priorities" },
  { date: "Feb 7, 2026", title: "Tulare County Opens New Community Health Center in Porterville" },
  { date: "Feb 3, 2026", title: "Property Tax Second Installment Due April 10" },
];

function DeptIcon({ type }: { type: string }) {
  const cls = "h-6 w-6 text-blue-700";
  switch (type) {
    case "heart":
      return (<svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>);
    case "building":
      return (<svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 21h20M6 21V7l6-4 6 4v14M10 13h4M10 17h4M10 9h4" /></svg>);
    case "document":
      return (<svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);
    case "currency":
      return (<svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>);
    case "paw":
      return (<svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21c-2.5 0-5-2.5-5-5 0-1.5.5-2.5 1.5-3.5S10.5 11 12 11s3.5.5 3.5 1.5S16 14.5 17 16c1 1.5 1 2.5 0 3.5S14.5 21 12 21zM7.5 8a2 2 0 100-4 2 2 0 000 4zM16.5 8a2 2 0 100-4 2 2 0 000 4zM5 13a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM19 13a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>);
    case "shield":
      return (<svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>);
    default:
      return null;
  }
}

export default function DashboardBackground() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* County header bar */}
      <div className="bg-blue-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs">
          <div className="flex items-center gap-4">
            <span>Phone: (559) 636-5000</span>
            <span className="hidden sm:inline">2800 W. Burrel Ave, Visalia, CA 93291</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="hover:underline">Translate / Traducir</button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-800 text-lg font-bold text-white">
              TC
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">County of Tulare</h1>
              <p className="text-xs text-slate-500">California &middot; Established 1852</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <span className="cursor-pointer hover:text-blue-700">Departments</span>
            <span className="cursor-pointer hover:text-blue-700">Services</span>
            <span className="cursor-pointer hover:text-blue-700">How Do I...</span>
            <span className="cursor-pointer hover:text-blue-700">About</span>
            <span className="cursor-pointer hover:text-blue-700">Contact</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-800 via-blue-900 to-slate-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
              Welcome to Tulare County
            </h2>
            <p className="mt-3 text-lg text-blue-200">
              Serving over 477,000 residents across the heart of California&apos;s San Joaquin Valley.
              Find information about county services, departments, and resources.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                Pay Taxes
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                Apply for Benefits
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                Get Records
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                Report an Issue
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Department grid */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h3 className="mb-6 text-lg font-bold text-slate-800">County Departments</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEPARTMENTS.map((d) => (
            <div
              key={d.name}
              className="group cursor-pointer rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <DeptIcon type={d.icon} />
              </div>
              <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-700">
                {d.name}
              </h4>
              <p className="mt-1 text-xs text-slate-500">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links + News */}
      <div className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Quick links */}
            <div>
              <h3 className="mb-4 text-lg font-bold text-slate-800">Popular Services</h3>
              <div className="space-y-2">
                {QUICK_LINKS.map((link) => (
                  <div
                    key={link}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                  >
                    <svg className="h-4 w-4 shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {link}
                  </div>
                ))}
              </div>
            </div>

            {/* News */}
            <div>
              <h3 className="mb-4 text-lg font-bold text-slate-800">County News</h3>
              <div className="space-y-4">
                {NEWS.map((item, i) => (
                  <div key={i} className="border-l-2 border-blue-200 pl-4">
                    <p className="text-[11px] font-medium text-slate-400">{item.date}</p>
                    <p className="mt-0.5 text-sm text-slate-700">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-slate-800 px-6 py-8 text-slate-400">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <p className="text-sm font-semibold text-white">County of Tulare, California</p>
              <p className="mt-1 text-xs">2800 W. Burrel Ave, Visalia, CA 93291 &middot; (559) 636-5000</p>
            </div>
            <p className="text-xs">
              &copy; 2026 County of Tulare. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
