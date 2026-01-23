import React from "react";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { createPortal } from "react-dom";

const get = (row, path) => path.split(".").reduce((o, k) => o?.[k], row);

export const CLIENT_COLUMNS = ({
  onDelete,
  onView,
  onRevoke,
  onContinueAccess,
}) => [
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
  { key: "webshopDomain", label: "Webshop Domain", width: "200px" },
  { key: "businessRegion", label: "Business Region", width: "160px" },

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
        onContinueAccess={onContinueAccess}
      />
    ),
  },
];

/* ----- Row actions with dropdown menu ----- */
const RowActions = ({ row, onDelete, onView, onRevoke, onContinueAccess }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const dropdownRef = React.useRef(null);
  const buttonRef = React.useRef(null);

  // Check if tenant is active (if inactive, access is revoked)
  const isTenantActive = row.isTenantActive === true;

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Calculate position when opening
  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 176;
      const dropdownHeight = 180;

      // Position below the button, aligned to the right
      let top = rect.bottom + 4;
      let left = rect.right - dropdownWidth;

      // Adjust if dropdown would go off screen
      if (left < 8) left = 8;
      if (top + dropdownHeight > window.innerHeight) {
        top = rect.top - dropdownHeight - 4;
      }

      setPosition({ top, left });
    }

    setIsOpen(!isOpen);
  };

  const handleAction = (callback) => {
    setIsOpen(false);
    if (callback) {
      callback(row);
    }
  };

  const MenuItem = ({ onClick, children, className = "" }) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[#E9F0FF] ${className}`}
    >
      {children}
    </button>
  );

  const dropdownMenu = isOpen ? (
    <div
      ref={dropdownRef}
      className="fixed w-44 bg-white rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.18)] ring-1 ring-black/5 overflow-hidden"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
        minWidth: "176px",
      }}
    >
      <MenuItem onClick={() => handleAction(onView)} className="text-[#0A285E]">
        View
      </MenuItem>
      {isTenantActive ? (
        <MenuItem
          onClick={() => handleAction(onRevoke)}
          className="text-red-600"
        >
          Revoke Access
        </MenuItem>
      ) : (
        <MenuItem
          onClick={() => handleAction(onContinueAccess)}
          className="text-green-600"
        >
          Continue Access
        </MenuItem>
      )}
      <MenuItem onClick={() => handleAction(onDelete)} className="text-red-600">
        Delete
      </MenuItem>
    </div>
  ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <MoreVertical className="w-5 h-5 text-[#2E2E2E]" />
      </button>
      {createPortal(dropdownMenu, document.body)}
    </>
  );
};
