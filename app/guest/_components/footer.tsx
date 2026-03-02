import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-[#dfd4c5] bg-[#1f1d19] text-[#efe6d8]">
      <div className="mx-auto grid w-full max-w-[1320px] gap-10 px-6 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#c6ac82]">
            Awani Hotel & Suites
          </p>
          <h3 className="font-serif text-3xl leading-tight">
            Crafted for memorable stays and elevated hospitality.
          </h3>
          <p className="max-w-md text-sm text-[#d7cdbd]">
            Experience refined rooms, attentive service, and timeless comfort in
            the heart of San Carlos City.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-serif text-xl text-[#f4ece0]">Explore</h4>
          <ul className="space-y-3 text-sm text-[#d7cdbd]">
            <li>
              <Link
                href="/guest"
                className="transition-colors hover:text-[#f4e5cf]"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/guest/reservations/hotel-rooms"
                className="transition-colors hover:text-[#f4e5cf]"
              >
                Rooms & Suites
              </Link>
            </li>
            <li>
              <Link
                href="/guest/reservations/function-room"
                className="transition-colors hover:text-[#f4e5cf]"
              >
                Event Reservations
              </Link>
            </li>
            <li>
              <Link
                href="/guest/about-us"
                className="transition-colors hover:text-[#f4e5cf]"
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-serif text-xl text-[#f4ece0]">Contact</h4>
          <ul className="space-y-3 text-sm text-[#d7cdbd]">
            <li>
              Corner-East Euzkara Avenue, San Carlos City, Philippines 6127
            </li>
            <li>+63 917 302 4794</li>
            <li>awanihotel2019@yahoo.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#35312a] px-6 py-5 text-center text-xs text-[#b9ac98]">
        Copyright {year} Ma. Awani Hotel & Suites. All rights reserved.
      </div>
    </footer>
  );
}
