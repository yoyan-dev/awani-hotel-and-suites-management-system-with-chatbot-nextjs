interface KPIProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
}

export const KPI: React.FC<KPIProps> = ({ label, value, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
    <div>
      <p className="text-gray-500">{label}</p>
      <h3 className="text-xl font-semibold text-gray-900">{value}</h3>
    </div>
    {icon && <div className="text-indigo-500">{icon}</div>}
  </div>
);
