import { motion } from "framer-motion";

type StatCardProps = {
  title: string;
  subtitle: string;
  value: string | number;
};

function StatCard({ title, subtitle, value }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="relative p-6 overflow-hidden transition-all bg-white border border-gray-100 shadow-sm rounded-3xl hover:shadow-xl hover:border-[#7A2E3A]/20"
    >
      {/* subtle accent */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#7A2E3A] to-[#E6C76E]" />

      <p className="text-xs font-bold tracking-widest uppercase text-gray-400">{subtitle}</p>

      <h3 className="mt-2 text-lg font-bold text-[#3B0F19]">{title}</h3>

      <div className="mt-6 flex items-baseline gap-2">
        <p className="text-4xl font-black text-gray-900 tracking-tight">{value}</p>
        <div className="h-2 w-2 rounded-full bg-[#E6C76E]" />
      </div>

      {/* Background Decoration */}
      <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-[#7A2E3A]/5 blur-2xl" />
    </motion.div>
  );
}

export default StatCard;

