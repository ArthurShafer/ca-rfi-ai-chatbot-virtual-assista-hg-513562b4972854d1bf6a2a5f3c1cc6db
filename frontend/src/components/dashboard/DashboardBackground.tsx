"use client";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const DEPARTMENTS = [
  { name: "Health & Human Services Agency", href: "#", desc: "CalFresh, Medi-Cal, behavioral health, social services" },
  { name: "Resource Management Agency", href: "#", desc: "Building permits, planning, environmental health" },
  { name: "Assessor / Clerk-Recorder", href: "#", desc: "Birth certificates, marriage licenses, property records" },
  { name: "Tax Collector / Treasurer", href: "#", desc: "Property tax payments, due dates, tax sales" },
  { name: "Animal Services", href: "#", desc: "Adoptions, licensing, lost pets, shelter hours" },
  { name: "Sheriff's Office", href: "#", desc: "Public safety, records, community programs" },
  { name: "Agricultural Commissioner", href: "#", desc: "Pest management, pesticide regulation, weights & measures" },
  { name: "Public Works", href: "#", desc: "Roads, flood control, solid waste, county facilities" },
];

const QUICK_LINKS = [
  "Pay Property Taxes Online",
  "Apply for CalFresh Benefits",
  "Request Birth / Death Certificate",
  "Building Permit Application",
  "Report a Code Violation",
  "Find Vaccination Clinics",
  "County Job Openings",
  "Board of Supervisors Agendas",
];

const NEWS = [
  { date: "February 10, 2026", title: "Board of Supervisors Approves 2026-27 Budget Priorities" },
  { date: "February 7, 2026", title: "New Community Health Center Opens in Porterville" },
  { date: "February 3, 2026", title: "Property Tax Second Installment Due April 10, 2026" },
  { date: "January 28, 2026", title: "Tulare County Library Launches Free Digital Literacy Program" },
];

const ALERTS = [
  "Property Tax 2nd installment due April 10. Pay online or at the Tax Collector's Office.",
];

export default function DashboardBackground() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* CA.gov utility bar */}
      <div className="bg-[#323a45]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-white/80">State of California</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-white/70">
            <span className="cursor-pointer hover:text-white">Translate</span>
            <span className="cursor-pointer hover:text-white">Contact Us</span>
          </div>
        </div>
      </div>

      {/* County header */}
      <div className="border-b border-[#d4d4d4] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img
              src={`${basePath}/tulare-county-seal.png`}
              alt="Seal of Tulare County"
              className="h-14 w-14"
            />
            <div>
              <h1 className="text-[22px] font-bold leading-tight text-[#323a45]">
                County of Tulare
              </h1>
              <p className="text-[12px] text-[#666]">California</p>
            </div>
          </div>
          <div className="hidden items-center gap-1 md:flex">
            <input
              type="text"
              placeholder="Search county services..."
              className="w-52 rounded-l border border-[#d4d4d4] bg-[#fafafa] px-3 py-1.5 text-[13px] text-[#333] placeholder-[#999] focus:border-[#046b99] focus:outline-none"
              readOnly
            />
            <button className="rounded-r bg-[#046b99] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[#035a80]">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="bg-[#046b99]">
        <nav className="mx-auto flex max-w-6xl items-center gap-0 px-4">
          {["Home", "Departments", "Services", "How Do I...", "About", "Board of Supervisors"].map((item, i) => (
            <span
              key={item}
              className={`cursor-pointer border-b-2 px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#035a80] ${
                i === 0 ? "border-[#fdb81e] bg-[#035a80]" : "border-transparent"
              }`}
            >
              {item}
            </span>
          ))}
        </nav>
      </div>

      {/* Alert banner */}
      {ALERTS.map((alert, i) => (
        <div key={i} className="border-b border-[#f0c75e] bg-[#fef9e7]">
          <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2">
            <span className="text-[14px]">&#9888;</span>
            <p className="text-[13px] text-[#6d5a00]">{alert}</p>
          </div>
        </div>
      ))}

      {/* Hero area */}
      <div className="bg-[#046b99]">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="max-w-xl">
            <h2 className="text-[28px] font-bold leading-snug text-white">
              Welcome to Tulare County
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-white/85">
              Serving over 477,000 residents across California&apos;s San Joaquin Valley.
              Access county services, pay taxes, apply for permits, and more.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Pay Taxes", "Apply for Benefits", "Request Records", "Report an Issue"].map((label) => (
              <span
                key={label}
                className="cursor-pointer rounded bg-white/15 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-white/25"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Departments - left column */}
          <div className="lg:col-span-2">
            <h3 className="mb-3 border-b-2 border-[#046b99] pb-2 text-[16px] font-bold text-[#323a45]">
              County Departments
            </h3>
            <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
              {DEPARTMENTS.map((d) => (
                <div
                  key={d.name}
                  className="cursor-pointer border-b border-[#e5e5e5] px-2 py-3 transition-colors hover:bg-[#eef8fb]"
                >
                  <p className="text-[14px] font-semibold text-[#046b99] hover:underline">
                    {d.name}
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#666]">{d.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 cursor-pointer text-[13px] font-medium text-[#046b99] hover:underline">
              View all departments &rarr;
            </p>
          </div>

          {/* Sidebar - right column */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div>
              <h3 className="mb-3 border-b-2 border-[#046b99] pb-2 text-[16px] font-bold text-[#323a45]">
                Popular Services
              </h3>
              <ul className="space-y-0">
                {QUICK_LINKS.map((link) => (
                  <li
                    key={link}
                    className="cursor-pointer border-b border-[#eee] px-1 py-2 text-[13px] text-[#046b99] transition-colors hover:bg-[#eef8fb] hover:underline"
                  >
                    {link}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="rounded border border-[#d4d4d4] bg-white p-4">
              <h4 className="mb-2 text-[14px] font-bold text-[#323a45]">Contact</h4>
              <p className="text-[13px] leading-relaxed text-[#555]">
                2800 W. Burrel Avenue<br />
                Visalia, CA 93291<br />
                (559) 636-5000
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-[#555]">
                Monday &ndash; Friday<br />
                8:00 AM &ndash; 5:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* News section */}
      <div className="border-t border-[#d4d4d4] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h3 className="mb-4 border-b-2 border-[#046b99] pb-2 text-[16px] font-bold text-[#323a45]">
            County News &amp; Announcements
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {NEWS.map((item, i) => (
              <div key={i} className="border-b border-[#eee] pb-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#999]">
                  {item.date}
                </p>
                <p className="mt-1 cursor-pointer text-[14px] text-[#046b99] hover:underline">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#d4d4d4] bg-[#323a45]">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <img
                src={`${basePath}/tulare-county-seal.png`}
                alt="Seal of Tulare County"
                className="h-10 w-10 opacity-80"
              />
              <div>
                <p className="text-[14px] font-semibold text-white">County of Tulare</p>
                <p className="text-[12px] text-white/60">
                  2800 W. Burrel Ave, Visalia, CA 93291
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-[12px] text-white/60">
              <span className="cursor-pointer hover:text-white">Accessibility</span>
              <span className="cursor-pointer hover:text-white">Privacy Policy</span>
              <span className="cursor-pointer hover:text-white">Conditions of Use</span>
              <span className="cursor-pointer hover:text-white">Sitemap</span>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-white/40">
            &copy; 2026 County of Tulare, California. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
