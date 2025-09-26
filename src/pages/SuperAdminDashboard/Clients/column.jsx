import React from "react";

const get = (row, path) => path.split(".").reduce((o, k) => o?.[k], row);

export const CLIENT_COLUMNS = ({ onDelete }) => [
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
      <div className="flex items-center gap-3">
        <img
          src={row.avatar}
          alt={row.name}
          className="object-cover w-8 h-8 rounded-full"
        />
        <span className="font-semibold text-[#0A285E]">{get(row, "name")}</span>
      </div>
    ),
  },
  { key: "email", label: "Email Address", width: "260px" },
  { key: "webshop", label: "Webshop", width: "160px" },
  { key: "company", label: "Company", width: "180px" },
  { key: "revenue", label: "Revenue", width: "160px" },
  { key: "businessRegion", label: "Business Region", width: "160px" },
  {
    key: "actions",
    label: "Actions",
    width: "90px",
    render: (row) => (
      <button
        className="rounded px-2 py-1 text-[#111827] hover:bg-gray-100"
        onClick={() => onDelete(row)}
        title="More actions"
      >
        •••
      </button>
    ),
  },
];
