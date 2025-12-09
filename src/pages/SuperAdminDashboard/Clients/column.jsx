import React from "react";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Eye } from "lucide-react";
import { createPortal } from "react-dom";

const get = (row, path) => path.split(".").reduce((o, k) => o?.[k], row);

export const CLIENT_COLUMNS = ({ onDelete, onView, onRevoke }) => [
  {
    key: "#",
    label: "#",
    width: "60px",
    render: (_row, idx) => <span className="text-slate-500">{idx + 1}</span>,
  },
  {
    key: "name",
    label: "Name",
    width: "220px",
    render: (row) => (
      <div className="flex items-center">
        <span className="font-semibold text-[#0A285E]">{get(row, "name")}</span>
      </div>
    ),
  },
  { key: "email", label: "Email Address", width: "260px" },
  { key: "phone", label: "Phone", width: "160px" },
  { key: "webshop", label: "Tenant", width: "160px" },
  {
    key: "service",
    label: "Plan",
    width: "120px",
    render: (row) => {
      const plan = (row.service || "").toString().toLowerCase();
      const variant =
        plan === "pos"
          ? "default"
          : plan === "combo"
          ? "secondary"
          : plan === "webshop"
          ? "success"
          : "outline";
      return (
        <Badge variant={variant}>
          {plan?.charAt(0)?.toUpperCase() + plan?.slice(1)}
        </Badge>
      );
    },
  },
  { key: "webshopDomain", label: "Webshop Domain", width: "200px" },
  { key: "businessRegion", label: "Business Region", width: "160px" },
  {
    key: "status",
    label: "Status",
    width: "120px",
    render: (row) => {
      const isActive = !!row.isActive;
      return (
        <Badge variant={isActive ? "success" : "destructive"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    key: "actions",
    label: "Actions",
    width: "110px",
    render: (row) => (
      <RowActions
        row={row}
        onDelete={onDelete}
        onView={onView}
        onRevoke={onRevoke}
      />
    ),
  },
];

/* ----- Row actions with portal menu (reuse Inventory menu style) ----- */
const ActionsMenuPortal = ({
  anchorRect,
  onClose,
  onView,
  onEdit,
  onDelete,
  onRevoke,
  row,
}) => {
  if (!anchorRect) return null;
  const style = {
    position: "fixed",
    top: `${anchorRect.bottom + 6}px`,
    left: `${Math.max(anchorRect.right - 180, 8)}px`,
    zIndex: 1000,
  };
  const Item = ({ onClick, children, className }) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#E9F0FF] ${
        className || "text-[#0A285E]"
      }`}
    >
      {children}
    </button>
  );
  return createPortal(
    <div
      style={style}
      className="w-44 overflow-hidden rounded-xl bg-white shadow-[0_12px_24px_rgba(0,0,0,0.18)] ring-1 ring-black/5"
    >
      <Item
        onClick={() => {
          onClose?.();
          onView?.(row);
        }}
      >
        View
      </Item>
      <Item
        onClick={() => {
          onClose?.();
          onEdit?.(row);
        }}
      >
        Edit
      </Item>
      <Item
        className="text-red-600"
        onClick={() => {
          onClose?.();
          onRevoke?.(row);
        }}
      >
        Revoke
      </Item>
      <Item
        className="text-red-600"
        onClick={() => {
          onClose?.();
          onDelete?.(row);
        }}
      >
        Delete
      </Item>
    </div>,
    document.body
  );
};

const RowActions = ({ row, onDelete, onView, onRevoke }) => {
  const btnRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [rect, setRect] = React.useState(null);

  React.useEffect(() => {
    const onDocClick = (e) => {
      if (!btnRef.current) return;
      if (!btnRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  React.useEffect(() => {
    if (open && btnRef.current) setRect(btnRef.current.getBoundingClientRect());
  }, [open]);

  return (
    <>
      <button
        onClick={() => onView?.(row)}
        className="p-2 rounded-full hover:bg-gray-100 mr-1"
        title="View details"
      >
        <Eye className="w-5 h-5 text-[#2E2E2E]" />
      </button>
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
          onView={onView}
          onEdit={() => console.log("edit", row)}
          onDelete={onDelete}
          onRevoke={onRevoke}
        />
      )}
    </>
  );
};
