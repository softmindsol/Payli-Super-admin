// src/components/Employees/EmployeeList.jsx
import { useEffect, useRef, useState } from "react";
import { MoreVertical, Plus } from "lucide-react";
import { useModal } from "../../context/modal/index";
import AddEmployeeForm from "../genericmodal/AddEmployeeForm";

export default function EmployeeList({ rows, setRows, onViewAll }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const { openModal } = useModal();

  // close action menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpenMenuId(null);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleAddClick = () => {
    openModal(
      <AddEmployeeForm
        onSubmit={(values) => {
          // map form -> table row shape
          const [city, country] = (values.posAddress || "")
            .split(",")
            .map((s) => s.trim());
          const newRow = {
            id: Date.now(),
            name: values.name,
            email: values.email,
            phone: values.phone,
            role: values.role,
            posCity: city || values.posAddress,
            posCountry: country || "United States of America",
            avatar: `https://i.pravatar.cc/64?u=${encodeURIComponent(values.email)}`,
          };
          setRows((prev) => [newRow, ...prev]);
          console.log("TABLE_INSERT:", newRow);
        }}
      />
    );
  };

  return (
    <div
      className="rounded-xl bg-white border border-[#EFEFEF] p-4 md:p-5"
      style={{ boxShadow: "0px 4px 6px 0px #00000024" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-[18px] font-semibold text-[#2E2E2E]">
          Employee List
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={onViewAll}
            className="px-4 py-2 rounded-full text-[#2E2E2E] bg-white border border-[#EFEFEF]"
          >
            View all
          </button>
          <button
            onClick={handleAddClick}
            className="px-4 py-2 rounded-full text-white bg-[#1D50AB] inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table
          className="min-w-[880px] w-full border-separate"
          style={{ borderSpacing: "0 12px" }}
        >
          <thead>
            <tr className="text-left text-gray-700">
              <th className="px-5 py-3 rounded-l-xl bg-[#EFEFEF] text-sm font-medium">
                #
              </th>
              <th className="px-5 py-3 bg-[#EFEFEF] text-sm font-medium">
                Name
              </th>
              <th className="px-5 py-3 bg-[#EFEFEF] text-sm font-medium">
                Email Address
              </th>
              <th className="px-5 py-3 bg-[#EFEFEF] text-sm font-medium">
                Phone Number
              </th>
              <th className="px-5 py-3 bg-[#EFEFEF] text-sm font-medium">
                POS Address
              </th>
              <th className="px-5 py-3 rounded-r-xl bg-[#EFEFEF] text-sm font-medium">
                Action
              </th>
            </tr>
          </thead>

          <tbody ref={menuRef}>
            {rows.map((emp, idx) => (
              <tr key={emp.id} className="bg-white">
                <td
                  className="px-5 py-4 align-middle rounded-l-xl border border-[#EFEFEF]"
                  style={{ boxShadow: "0px 4px 6px 0px #00000024" }}
                >
                  <span className="text-gray-700">{idx + 1}</span>
                </td>

                <td
                  className="px-5 py-4 align-middle border border-[#EFEFEF] border-l-0"
                  style={{ boxShadow: "0px 4px 6px 0px #00000024" }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="object-cover rounded-full w-9 h-9"
                    />
                    <span className="text-gray-900">{emp.name}</span>
                  </div>
                </td>

                <td
                  className="px-5 py-4 align-middle border border-[#EFEFEF] border-l-0"
                  style={{ boxShadow: "0px 4px 6px 0px #00000024" }}
                >
                  <span className="text-gray-700">{emp.email}</span>
                </td>

                <td
                  className="px-5 py-4 align-middle border border-[#EFEFEF] border-l-0"
                  style={{ boxShadow: "0px 4px 6px 0px #00000024" }}
                >
                  <span className="text-gray-700">{emp.phone}</span>
                </td>

                <td
                  className="px-5 py-4 align-middle border border-[#EFEFEF] border-l-0"
                  style={{ boxShadow: "0px 4px 6px 0px #00000024" }}
                >
                  <div className="leading-tight">
                    <div className="font-semibold text-gray-900">
                      {emp.posCity}
                    </div>
                    <div className="text-xs text-gray-600">
                      {emp.posCountry}
                    </div>
                  </div>
                </td>

                <td
                  className="px-5 py-4 align-middle rounded-r-xl border border-[#EFEFEF] border-l-0 relative"
                  style={{ boxShadow: "0px 4px 6px 0px #00000024" }}
                >
                  <button
                    onClick={() =>
                      setOpenMenuId((v) => (v === emp.id ? null : emp.id))
                    }
                    className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                    aria-haspopup="menu"
                    aria-expanded={openMenuId === emp.id}
                  >
                    <MoreVertical className="w-5 h-5 text-gray-700" />
                  </button>

                  {openMenuId === emp.id && (
                    <div className="absolute right-4 top-12 z-20 w-44 overflow-hidden rounded-xl bg-white shadow-[0_8px_16px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
                      <button className="w-full text-left px-4 py-2.5 text-sm text-gray-800 hover:bg-[#E9F0FF]">
                        Edit Profile
                      </button>
                      <button
                        onClick={() =>
                          setRows((prev) => prev.filter((r) => r.id !== emp.id))
                        }
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
