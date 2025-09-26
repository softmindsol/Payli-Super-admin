import React, { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import { createPortal } from "react-dom";

const get = (row, path) => path.split(".").reduce((o, k) => o?.[k], row);

/* Status pill */
const StatusBadge = ({ value }) => {
  const val = (value || "").toLowerCase();
  const ok = val === "in stock";
  const pending = val === "pending";
  const notAvail = val === "not available";

  const cls = ok
    ? "bg-[#D2FFDC] text-[#00C92C] border border-[#00C92C] px-4 py-1"
    : pending
    ? "bg-[#FFF4E0] text-[#C47A00] border border-[#C47A00] px-3 py-1"
    : notAvail
    ? "bg-[#FFE9E9] text-[#C90000] border border-[#C90000] px-3 py-1"
    : "bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1";

  return (
    <span className={`inline-flex items-center rounded-full text-xs ${cls}`}>
      {value}
    </span>
  );
};

/* 3-dots actions menu */
const ActionsMenuPortal = ({ anchorRect, onClose, onUpdate, onEdit, onDelete, row }) => {
  if (!anchorRect) return null;
  const style = {
    position: "fixed",
    top: `${anchorRect.bottom + 6}px`,
    left: `${Math.max(anchorRect.right - 180, 8)}px`,
    zIndex: 1000,
  };
  const Item = ({ onClick, children }) => (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2.5 text-sm text-[#0A285E] hover:bg-[#E9F0FF]"
    >
      {children}
    </button>
  );
  return createPortal(
    <div
      style={style}
      className="w-48 overflow-hidden rounded-xl bg-white shadow-[0_12px_24px_rgba(0,0,0,0.18)] ring-1 ring-black/5"
    >
      <Item onClick={() => { onClose?.(); onUpdate?.(row); }}>Update Inventory</Item>
      <Item onClick={() => { onClose?.(); onEdit?.(row); }}>Edit</Item>
      <Item onClick={() => { onClose?.(); onDelete?.(row); }}>Delete</Item>
    </div>,
    document.body
  );
};

const RowActions = ({ row, onUpdate, onEdit, onDelete }) => {
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!btnRef.current) return;
      if (!btnRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (open && btnRef.current) {
      setRect(btnRef.current.getBoundingClientRect());
    }
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical className="w-5 h-5 text-[#2E2E2E]" />
      </button>
      {open && (
        <ActionsMenuPortal
          anchorRect={rect}
          row={row}
          onClose={() => setOpen(false)}
          onUpdate={onUpdate}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export const INVENTORY_COLUMNS = ({ onUpdate, onEdit, onDelete }) => [
  { key: "name", label: "Product", width: "260px" },
  { key: "category", label: "Category", width: "140px" },
  { key: "stock", label: "Stock", width: "80px", align: "center" },
  { key: "sku", label: "Product ID", width: "160px" },
  {
  key: "branch",
  label: "Branch",
  width: "180px",
  render: (row) => row.branch || row.location || "—",
}
,
  {
    key: "price",
    label: "Price",
    width: "140px",
    align: "right",
    render: (row) =>
      `€${Number(get(row, "price") || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
  },
  {
    key: "status",
    label: "Status",
    width: "130px",
    align: "center",
    render: (row) => <StatusBadge value={get(row, "status")} />,
  },
  {
    key: "actions",
    label: "Actions",
    width: "80px",
    align: "center",
    render: (row) => (
      <RowActions row={row} onUpdate={onUpdate} onEdit={onEdit} onDelete={onDelete} />
    ),
  },
];
