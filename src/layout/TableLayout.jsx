import React, { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import Modal from "../components/Modals/index";
import GenericTable from "../components/Table/index";

const TableLayout = ({
  title,
  actionButton,
  columns,
  data,
  loading = false,
  queryParams = { page: 1 },
  totalPages = 1,
  onPageChange = () => {},
  onSearch = () => {},
  totalItems,

  // NEW: visibility toggles (default true to avoid breaking other pages)
  showSearch = true,
  showCategories = true,

  // Optional: Select Outlet
  showSelectOutlet = false,
  outletValue = "Select Outlet",
  onOutletChange = () => {},
  outletOptions = ["POS", "Webshop", "POS/Webshop"],

  // NEW: footer label override
  entityLabel = "items",
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const v = e.target.value;
    setSearchTerm(v);
    onSearch?.(v);
  };

  const pageSize = data?.length || 0;
  const start = pageSize ? (queryParams.page - 1) * pageSize + 1 : 0;
  const end = pageSize ? (queryParams.page - 1) * pageSize + pageSize : 0;

  return (
    <section
      className="rounded-2xl border border-[#EFEFEF] bg-white px-5 py-6"
      style={{ boxShadow: "0px 4px 6px 0px #00000024" }}
    >
      {/* ===== Top Bar ===== */}
      <div className="flex flex-col gap-3 mb-5 md:flex-row md:items-center md:justify-start">
        {title ? (
          <h2 className="whitespace-nowrap text-[18px] font-bold text-[#2E2E2E]">
            {title}
          </h2>
        ) : null}

        <div className="flex items-center w-full gap-3 md:w-auto">
          {/* Search (toggle) */}
          {showSearch && (
            <div className="relative flex-1 md:w-[360px] lg:ml-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8A8A]" />
              <input
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search items..."
                className="w-full rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#1D50AB]/30"
              />
            </div>
          )}

          {/* All Categories (toggle) */}
          {showCategories && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#1D50AB] px-4 py-2.5 text-sm text-white"
            >
              All Categories
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}

          {/* Optional: Select Outlet */}
          {showSelectOutlet && (
            <div className="relative">
              <select
                value={outletValue}
                onChange={(e) => onOutletChange(e.target.value)}
                className="appearance-none rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-4 pr-9 text-sm text-[#2E2E2E] shadow-sm focus:ring-2 focus:ring-[#1D50AB]/30"
              >
                <option value="Select Outlet" disabled>
                  Select Outlet
                </option>
                {outletOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
            </div>
          )}

          {/* Extra actions slot */}
          {actionButton}
        </div>
      </div>

      {/* ===== Table ===== */}
      <GenericTable columns={columns} data={data} loading={loading} stickyHeader />

      {/* ===== Footer / Pagination row ===== */}
      <div className="flex flex-col items-start gap-3 md:justify-between md:items-center md:flex-row">
        <p className="pt-9 pb-3 text-sm font-semibold text-[#1D50AB]">
          {`Showing ${start}-${end} from ${totalItems ?? end} ${entityLabel}`}
        </p>
        {/* Add Pagination component here when needed */}
      </div>

      <Modal />
    </section>
  );
};

export default TableLayout;
