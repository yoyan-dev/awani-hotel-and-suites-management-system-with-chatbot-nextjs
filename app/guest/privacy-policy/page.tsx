import Footer from "../_components/footer";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#fbf6ee]">
      <section className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
        <div className="rounded-2xl border border-[#e2d6c6] bg-[#fffdf8] p-6 shadow-[0_18px_42px_-36px_rgba(35,30,24,0.48)] sm:p-8">
          <h1 className="font-serif text-4xl text-[#241f1a]">
            Privacy and Policy
          </h1>

          <div className="mt-5 space-y-4 text-sm leading-7 text-[#63594c] sm:text-base">
            <p>
              Ma. Awani Hotel and Suites collects guest information needed to
              manage reservations, verify bookings, contact guests, process
              requests, and operate hotel services.
            </p>
            <p>
              This may include your name, contact details, address, booking
              details, valid ID information, verification status, and related
              reservation records.
            </p>
            <p>
              We use this information only for hotel operations, guest service,
              security, record keeping, and legal or safety requirements. We do
              not sell guest personal information.
            </p>
            <p>
              Guest information is kept only as long as needed for hotel
              operations or required records. You may contact the hotel to ask
              about your guest record or request corrections.
            </p>
          </div>

          <a
            href="/policy/cancellation-policy.pdf"
            download
            className="mt-6 inline-flex rounded-full bg-[#b08a53] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9d7948]"
          >
            Download Cancellation Policy PDF
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
