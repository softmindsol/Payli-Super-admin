import React, { useCallback, useMemo, useState } from "react";
import TableLayout from "../../../layout/TableLayout";
import { CLIENT_COLUMNS } from "./column";
import { useModal } from "../../../context/modal/index";
import AddClientModal from "../../../components/Modals/AddClientModal/index";

// demo rows (swap with API)
const demoRows = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: i % 2 ? "Nina William" : "Samran Nadeem",
  email: i % 2 ? "ninawilliam@gmail.com" : "samrannadeem@gmail.com",
  webshop: ["Collebaut", "Godiva", "Delvaux"][i % 3],
  company: ["Clothing Brand", "Bags Brand", "Shoes Brand"][i % 3],
  revenue: "€100,295.00",
  businessRegion: ["Belgium", "Netherlands"][i % 2],
  avatar:
    "https://i.pravatar.cc/64?img=" + ((i % 10) + 1),
}));

const GRADIENT = "linear-gradient(90deg, #B2F0E7 -7.06%, #C9DDF9 100%)";

export default function ClientsList() {
  const [search, setSearch] = useState("");
  const { openModal, closeModal } = useModal();

  const onAddClient = useCallback(() => {
    openModal(<AddClientModal onClose={closeModal} />, 720);
  }, [openModal, closeModal]);

  const onDelete = useCallback((row) => {
    console.log("delete client:", row);
  }, []);

  const columns = useMemo(
    () => CLIENT_COLUMNS({ onDelete }),
    [onDelete]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return demoRows;
    return demoRows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        r.webshop.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <>
      {/* Page heading */}
      <div className="mb-5">
        <h1 className="text-[22px] font-semibold text-[#2E2E2E]">Clients</h1>
        <p className="mt-1 text-sm text-[#545454]">Here is the list of all Clients</p>
      </div>

      {/* Header controls (match design) */}
      <div className="flex gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onAddClient}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-white"
            style={{ background: "#1E50A2" }}
          >
            <span className="text-lg leading-none">＋</span>
            <span className="font-medium">Add Client</span>
          </button>

          {/* search input + button as one control */}
          <div className="flex items-stretch rounded-full border border-[#E6E6E6] overflow-hidden">
            <div className="flex items-center pl-3 pr-1 text-slate-500">🔍</div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search something..."
              className="h-10 w-[260px] px-2 outline-none"
            />
            <button
              className="px-5 text-[#1F2937] font-semibold"
              style={{ background: GRADIENT }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <TableLayout
        title="Client List"
        columns={columns}
        data={filtered}
        loading={false}
        queryParams={{ page: 1 }}
        totalPages={10}
        totalItems={filtered.length}
        onSearch={setSearch} // keeps TableLayout search hook happy
      />
    </>
  );
}
