import Footer from "../_components/footer";
import {
  Clock,
  Database,
  FileCheck2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

const updatedAt = "June 28, 2026";

const policySections = [
  {
    title: "Information We Collect",
    icon: Database,
    body: [
      "We collect the information needed to manage reservations, guest records, payments, service requests, and hotel operations. This may include your name, contact number, email address, home address, nationality, gender, booking details, stay dates, event details, payment records, and guest preferences.",
      "When identity verification is required, we may collect verification details such as ID document images, verification status, provider session identifiers, and verification decision results.",
    ],
  },
  {
    title: "How We Use Your Information",
    icon: FileCheck2,
    body: [
      "We use guest information to confirm bookings, prepare rooms or event spaces, contact guests about reservations, process payments, issue receipts, respond to requests, protect the property from fraud or misuse, and maintain required operational records.",
      "Identity verification information is used only to confirm that a booking is associated with a real guest and to help front office staff complete check-in or reservation review.",
    ],
  },
  {
    title: "Identity Verification",
    icon: UserCheck,
    body: [
      "The system may require a valid ID before a booking can be submitted or approved. If Awani Hotel and Suites uses a third-party verification provider such as Didit, the verification flow may take place on that provider's hosted page.",
      "Your verification status may be returned to our system as Approved, Declined, In Review, or a similar status. We store only the information needed to connect the verification result to your guest record or booking.",
    ],
  },
  {
    title: "Data Sharing",
    icon: ShieldCheck,
    body: [
      "We do not sell guest personal information. We may share limited information with service providers that help us operate the hotel management system, process communications, support identity verification, maintain infrastructure, or comply with valid legal or safety requirements.",
      "Service providers are expected to use the information only for the service they provide to Awani Hotel and Suites.",
    ],
  },
  {
    title: "Security",
    icon: LockKeyhole,
    body: [
      "We use access controls, authenticated staff accounts, protected routes, and secure storage practices to reduce the risk of unauthorized access. Only authorized staff should access guest records when needed for hotel operations.",
      "No online system can guarantee absolute security, but we work to keep guest information protected and limited to legitimate business use.",
    ],
  },
  {
    title: "Retention",
    icon: Clock,
    body: [
      "We keep guest and booking information for as long as needed to manage reservations, handle disputes, prepare reports, support accounting records, and meet operational or legal requirements.",
      "When information is no longer needed, we may delete, anonymize, or archive it according to hotel policy and system capability.",
    ],
  },
];

const guestRights = [
  "Request access to personal information connected to your guest record.",
  "Ask us to correct inaccurate or outdated information.",
  "Ask about how your ID verification result was used for a booking.",
  "Request deletion where retention is no longer required for hotel operations, accounting, safety, or legal reasons.",
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen py-10 sm:py-14">
      <section className="mx-auto max-w-[1160px] overflow-hidden rounded-[2rem] border border-[#e2d6c6] bg-[#fffdf8] shadow-[0_24px_55px_-42px_rgba(35,30,24,0.48)]">
        <div className="grid gap-8 border-b border-[#eadfce] bg-[#f8efe2] px-5 py-10 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-14">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#947043]">
              Guest Privacy
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-[#241f1a] sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#665b4d]">
              This page explains how Ma. Awani Hotel and Suites collects, uses,
              stores, and protects guest information when you browse the site,
              make a reservation, complete identity verification, contact the
              hotel, or use our guest services.
            </p>
          </div>

          <aside className="self-end rounded-2xl border border-[#dfd0bc] bg-[#fffaf1] p-5">
            <p className="text-sm font-semibold text-[#362d22]">
              Last updated
            </p>
            <p className="mt-1 text-2xl font-serif text-[#9a7647]">
              {updatedAt}
            </p>
            <p className="mt-4 text-sm leading-6 text-[#695f51]">
              For questions about this policy or your guest record, contact the
              hotel using the details at the bottom of this page.
            </p>
          </aside>
        </div>

        <div className="grid gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[260px_1fr] lg:px-10 lg:py-12">
          <nav
            aria-label="Privacy policy sections"
            className="h-fit rounded-2xl border border-[#e6d9c8] bg-[#fcf7ef] p-4 text-sm lg:sticky lg:top-28"
          >
            <p className="mb-3 font-semibold text-[#332b22]">On this page</p>
            <div className="space-y-2">
              {policySections.map((section) => (
                <a
                  key={section.title}
                  href={`#${section.title.toLowerCase().replaceAll(" ", "-")}`}
                  className="block rounded-xl px-3 py-2 text-[#615648] transition-colors hover:bg-[#f1e5d3] hover:text-[#241f1a]"
                >
                  {section.title}
                </a>
              ))}
              <a
                href="#your-choices"
                className="block rounded-xl px-3 py-2 text-[#615648] transition-colors hover:bg-[#f1e5d3] hover:text-[#241f1a]"
              >
                Your Choices
              </a>
              <a
                href="#contact"
                className="block rounded-xl px-3 py-2 text-[#615648] transition-colors hover:bg-[#f1e5d3] hover:text-[#241f1a]"
              >
                Contact
              </a>
            </div>
          </nav>

          <div className="space-y-6">
            {policySections.map((section) => {
              const Icon = section.icon;

              return (
                <section
                  key={section.title}
                  id={section.title.toLowerCase().replaceAll(" ", "-")}
                  className="scroll-mt-28 rounded-2xl border border-[#e8ddcc] bg-[#fffaf2] p-5 sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#eadac3] text-[#7e5f35]">
                      <Icon size={21} aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl text-[#271f14]">
                        {section.title}
                      </h2>
                      <div className="mt-3 space-y-3 text-sm leading-7 text-[#63594c] sm:text-base">
                        {section.body.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}

            <section
              id="your-choices"
              className="scroll-mt-28 rounded-2xl border border-[#e8ddcc] bg-[#241f1a] p-5 text-[#f6ecdc] sm:p-6"
            >
              <h2 className="font-serif text-2xl">Your Choices</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#dccfbd] sm:text-base">
                You may contact us about your personal information. We will
                review each request based on the guest record, booking status,
                operational needs, and applicable requirements.
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {guestRights.map((right) => (
                  <li
                    key={right}
                    className="rounded-xl border border-[#4a4033] bg-[#2f2922] p-4 text-sm leading-6 text-[#efe2cf]"
                  >
                    {right}
                  </li>
                ))}
              </ul>
            </section>

            <section
              id="contact"
              className="scroll-mt-28 rounded-2xl border border-[#e8ddcc] bg-[#fcf7ef] p-5 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#eadac3] text-[#7e5f35]">
                  <Mail size={21} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-[#271f14]">
                    Contact
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#63594c] sm:text-base">
                    For privacy questions, corrections, or requests connected
                    to a guest record, contact Ma. Awani Hotel and Suites.
                  </p>
                  <div className="mt-4 space-y-2 text-sm text-[#42382d]">
                    <p>Corner-East Euzkara Avenue, San Carlos City, Philippines 6127</p>
                    <p>+63 917 302 4794</p>
                    <p>awanihotel2019@yahoo.com</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
