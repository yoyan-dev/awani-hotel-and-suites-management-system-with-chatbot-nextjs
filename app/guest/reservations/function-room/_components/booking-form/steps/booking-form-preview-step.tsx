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
      <p className="text-default-500">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}

export default function BookingFormPreviewStep({
  previewData,
}: BookingFormPreviewStepProps) {
  return (
    <div className="space-y-4 w-full">
      <h1 className="text-lg font-semibold">Preview Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-xl border border-default-200 p-4 text-sm">
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
