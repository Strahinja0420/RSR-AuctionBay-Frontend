type StatCardProps = {
  title: string;
  subtitle: string;
  value: string | number;
};

function StatCard({ title, subtitle, value }: StatCardProps) {
  return (
    <div className="relative p-6 overflow-hidden transition bg-white border shadow-sm rounded-2xl border-neutral-200 hover:shadow-md">
      {/* subtle accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-[#7A2E3A]" />

      <p className="text-lg font-bold text-neutral-500">{subtitle}</p>

      <h3 className="mt-1 text-base font-semibold text-[#7A2E3A]">{title}</h3>

      <p className="mt-4 text-3xl font-bold text-neutral-900">{value}</p>
    </div>
  );
}

export default StatCard;
