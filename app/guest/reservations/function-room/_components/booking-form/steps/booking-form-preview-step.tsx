import { BookingPreviewData } from "../types/booking-form.types";

interface BookingFormPreviewStepProps {
  previewData: BookingPreviewData;
}

interface PreviewFieldProps {
  label: string;
  value: string;
  className?: string;
}

function PreviewField({ label, value, className }: PreviewFieldProps) {
  return (
    <div className={className}>
      <p className="text-[#7a6f62]">{label}</p>
      <p className="font-medium text-[#2d2418]">{value || "-"}</p>
    </div>
  );
}

export default function BookingFormPreviewStep({
  previewData,
}: BookingFormPreviewStepProps) {
  return (
    <div className="w-full space-y-4">
      <h1 className="font-serif text-2xl text-[#281f14]">Preview Details</h1>
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[#e7dccd] bg-[#fcf8f2] p-4 text-sm md:grid-cols-2">
        <PreviewField label="Full Name" value={previewData.full_name} />
        <PreviewField
          label="Contact Number"
          value={previewData.contact_number}
        />
        <PreviewField label="Email" value={previewData.email} />
        <PreviewField label="Gender" value={previewData.gender} />
        <PreviewField label="Nationality" value={previewData.nationality} />
        <PreviewField
          label="Number of Guests"
          value={previewData.number_of_guest}
        />
        <PreviewField
          label="Address"
          value={previewData.address}
          className="md:col-span-2"
        />
        <PreviewField label="Event Type" value={previewData.event_type} />
        <PreviewField label="Event Start" value={previewData.event_start} />
        <PreviewField label="Event End" value={previewData.event_end} />
        <PreviewField
          label="Notes"
          value={previewData.notes}
          className="md:col-span-2"
        />
      </div>
    </div>
  );
}
