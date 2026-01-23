import React, { useMemo, useState, useCallback } from "react";
import TableLayout from "@/layout/TableLayout";
import { INVENTORY_COLUMNS } from "./column";

// Demo data sets
const WEBSHOP_ROWS = [
  { id: 1, name: "Vision 55” 4K TV", category: "Electronics", stock: 46, sku: "#0369852741", branch: "Down Town Store, Branch A", price: 250789, status: "In Stock" },
  { id: 2, name: "Elite Chair Pro", category: "Furniture", stock: 12, sku: "#0369852741", branch: "Down Town Store, Branch A", price: 12999, status: "Not Available" },
  { id: 3, name: "Apple iPhone X", category: "Electronics", stock: 8, sku: "#0369852741", branch: "Down Town Store, Branch A", price: 999, status: "Pending" },
];

const POS_ROWS = [
  { id: 4, name: "Robotic Vacuum", category: "Home Living", stock: 23, sku: "#0369852741", branch: "POS Store, Branch B", price: 299, status: "In Stock" },
  { id: 5, name: "Baby Stroller", category: "Baby & Kids", stock: 44, sku: "#0369852741", branch: "POS Store, Branch B", price: 499, status: "In Stock" },
];

// Segmented toggle
const InventoryToggle = ({ value, onChange }) => {
  const isWebshop = value === "webshop";
  return (
    <div className="inline-flex items-center rounded-full bg-[#F2F2F2] p-1">
      <button
        type="button"
        onClick={() => onChange("webshop")}
        className={`rounded-full px-5 py-2 text-sm font-medium transition-all
          ${isWebshop ? "bg-[#184BBF] text-white shadow-sm" : "text-[#222]"}`}
      >
        Webshop Inventory
      </button>
      <button
        type="button"
        onClick={() => onChange("pos")}
        className={`rounded-full px-5 py-2 text-sm font-medium transition-all
          ${!isWebshop ? "bg-[#184BBF] text-white shadow-sm" : "text-[#222]"}`}
      >
        POS Inventory
      </button>
    </div>
  );
};

const InventoryManagement = () => {
  const [tab, setTab] = useState("webshop");
  const [search, setSearch] = useState("");

  const handleUpdateInventory = useCallback((row) => {
    console.log("Update Inventory:", row);
  }, []);
  const handleEdit = useCallback((row) => console.log("edit:", row), []);
  const handleDelete = useCallback((row) => console.log("delete:", row), []);

  const columns = useMemo(
    () =>
      INVENTORY_COLUMNS({
        onUpdate: handleUpdateInventory,
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [handleUpdateInventory, handleEdit, handleDelete]
  );

  // Which dataset?
  const baseRows = tab === "webshop" ? WEBSHOP_ROWS : POS_ROWS;

  // Simple search filter
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return baseRows.filter(
      (r) =>
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.sku.toLowerCase().includes(q)
    );
  }, [search, baseRows]);

  return (
    <>
      {/* Top page heading */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-semibold text-[#2E2E2E]">Inventory</h1>
          <p className="mt-1 text-sm text-[#545454]">
            Here is the list of Inventory
          </p>
        </div>
        <InventoryToggle value={tab} onChange={setTab} />
      </div>

      {/* TableLayout with search + categories only */}
      <TableLayout
        title="Inventory Items"
        data={filteredRows}
        columns={columns}
        loading={false}
        queryParams={{ page: 1 }}
        totalPages={1}
        totalItems={baseRows.length}
        onSearch={setSearch}
        showCategories={true}
      />
    </>
  );
};

export default InventoryManagement;
