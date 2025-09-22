import React, { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import Modal from "../components/Modals/index";
import GenericTable from "../components/Table/index";

const TableLayout = ({
  title,
  actionButton, // optional custom button(s)
  columns,
  data,
  loading = false,
  queryParams = { page: 1 },
  totalPages = 1,
  onPageChange = () => {},
  onSearch = () => {},
  totalItems, // optional: total count to show "Showing x–y of N"

  // Optional: "Select Outlet" control
  showSelectOutlet = false,
  outletValue = "Select Outlet",
  onOutletChange = () => {},
  outletOptions = ["POS", "Webshop", "POS/Webshop"],
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
      style={{ boxShadow: " 0px 4px 6px 0px #00000024" }}
    >
      {/* ===== Top Bar (single row) ===== */}
      <div className="flex flex-col gap-3 mb-5 md:flex-row md:items-center md:justify-start">
        {title ? (
          <h2 className="text-[18px] font-bold text-[#2E2E2E] whitespace-nowrap">
            {title}
          </h2>
        ) : null}
        

        <div className="flex items-center w-full gap-3 md:w-auto">
          {/* Search (keep EXACT previous design) */}
          <div className="relative flex-1 md:w-[360px] lg:ml-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A8A]" />
            <input
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search items..."
              className="w-full rounded-full border border-[#E5E7EB] bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1D50AB]/30"
            />
          </div>

          {/* All Categories pill */}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[#1D50AB] text-white px-4 py-2.5 text-sm"
          >
            All Categories
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Optional: Select Outlet pill-like select */}
          {showSelectOutlet && (
            <div className="relative">
              <select
                value={outletValue}
                onChange={(e) => onOutletChange(e.target.value)}
                className="appearance-none rounded-full bg-white border border-[#E5E7EB] pl-4 pr-9 py-2.5 text-sm text-[#2E2E2E] shadow-sm focus:ring-2 focus:ring-[#1D50AB]/30"
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

          {/* Optional extra actions (Add Product / Import CSV etc.) */}
          {actionButton}
        </div>
      </div>

      {/* ===== Table ===== */}
      <GenericTable
        columns={columns}
        data={data}
        loading={loading}
        stickyHeader
      />

      {/* ===== Footer / Pagination row ===== */}
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-semibold pt-9 pb-3 text-[#1D50AB]">
          {`Showing ${start}-${end} from ${totalItems ?? end} ${
            title?.toLowerCase().includes("inventory")
              ? "Inventory"
              : "Products"
          }`}
        </p>
        {/* Place your Pagination here if you have one */}
        {/* <Pagination currentPage={queryParams.page} totalPages={totalPages} onPageChange={onPageChange} /> */}
      </div>

      <Modal />
    </section>
  );
};

export default TableLayout;
