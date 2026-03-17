interface BookingDetailsHeaderProps {
  onDownloadPdf: () => void;
}

export default function BookingDetailsHeader({
  onDownloadPdf,
}: BookingDetailsHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between bg-primary px-4 py-2 text-white">
      <span>Booking Details</span>
      <button
        type="button"
        className="rounded-full border border-white/40 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
        onClick={onDownloadPdf}
      >
        Download PDF
      </button>
    </div>
  );
}
