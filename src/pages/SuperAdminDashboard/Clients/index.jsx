import React, { useCallback, useMemo, useState } from "react";
import TableLayout from "../../../layout/TableLayout";
import { CLIENT_COLUMNS } from "./column";
import { useModal } from "../../../context/modal";
import AddClientModal from "../../../components/Modals/AddClientModal";

const demoRows = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: i % 2 ? "Nina William" : "Samran Nadeem",
  email: i % 2 ? "ninawilliam@gmail.com" : "samranadeem@gmail.com",
  webshop: ["Collebaut", "Godiva", "Delvaux"][i % 3],
  company: ["Clothing Brand", "Bags Brand", "Shoes Brand"][i % 3],
  revenue: "€100,295.00",
  businessRegion: ["Belgium", "Netherlands"][i % 2],
  avatar: "https://i.pravatar.cc/64?img=" + ((i % 10) + 1),
}));

const GRADIENT = "linear-gradient(90deg, #2196F3 -7.06%, #00338D 100%)";

export default function ClientsList() {
  const [search, setSearch] = useState("");
  const { openModal, closeModal } = useModal();

  const onAddClient = useCallback(() => {
    openModal(<AddClientModal onClose={closeModal} />, 720);
  }, [openModal, closeModal]);

  const onDelete = useCallback((row) => {
    console.log("delete client:", row);
  }, []);

  const columns = useMemo(() => CLIENT_COLUMNS({ onDelete }), [onDelete]);

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
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#2E2E2E]">Clients</h1>
          <p className="mt-1 text-sm text-[#545454]">
            Here is the list of all Clients
          </p>
        </div>

        {/* Right controls */}
        <div className="flex items-center justify-start w-full gap-3 sm:w-auto sm:justify-end">
          <button
            onClick={onAddClient}
            className="inline-flex items-center gap-2 rounded-full bg-[#1E50A2] px-5 py-2.5 text-white shadow-sm hover:opacity-95"
          >
            <span className="text-lg leading-none">＋</span>
            <span className="font-medium">Add Client</span>
          </button>

          <div className="flex items-stretch rounded-full border border-[#E6E6E6] bg-white pl-3 pr-1 shadow-sm">
            <div className="flex items-center pr-1 text-slate-600">🔍</div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search something..."
              className="h-10 w-[240px] rounded-full px-2 text-sm outline-none sm:w-[320px]"
            />
            <button
              type="button"
              className="px-5 py-2 text-sm font-semibold text-white rounded-full"
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
  totalPages={1}
  totalItems={filtered.length}
  showSearch={false}
  showCategories={false}
  showSelectOutlet={false}
  entityLabel="clients"
/>

    </>
  );
}
