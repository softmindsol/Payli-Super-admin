// src/components/Dashboard/EcommerceMetrics.jsx
import { Inventory, Webshops, POS, Revenue } from "../../assets/svgs";

export default function EcommerceMetrics() {
  const metrics = [
    { id: 1, icon: Inventory, title: "Total Inventory", value: "3,794" },
    { id: 2, icon: Webshops,  title: "Total Webshops", value: "250+" },
    { id: 3, icon: POS,       title: "Total POS",      value: "€100,295.00" },
    { id: 4, icon: Revenue,   title: "Total Revenue",  value: "€3,794" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((m) => (
        <div
          key={m.id}
          className="rounded-xl bg-white border border-[#EFEFEF] p-5 md:p-6"
          style={{ boxShadow: "0px 4px 6px 0px #00000024" }}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
            <img src={m.icon} alt={`${m.title} icon`} className="w-6 h-6" />
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">{m.title}</p>
            <h4 className="mt-1 text-xl font-semibold text-gray-900">{m.value}</h4>
          </div>
        </div>
      ))}
    </div>
  );
}
