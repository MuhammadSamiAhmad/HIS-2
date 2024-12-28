export const StatCard = ({
  value,
  title,
  icon,
}: {
  value: string;
  title: string;
  icon: React.ReactNode; // Accepts any React node as the icon
}) => (
  <div className="rounded-lg bg-background border-2 border-Silver-3 shadow-2xl text-textColor">
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-4xl font-bold text-textColor">{value}</p>
          <p className="text-gray-400 mt-2">{title}</p>
        </div>
        <div className="text-emerald-400">
          <div className="text-callToAction-900">{icon}</div>
        </div>
      </div>
    </div>
  </div>
);
