import React from "react";
import { X } from "lucide-react";

export default function ViewClientModal({ onClose, client }) {
  if (!client) return null;
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Client Details</h2>
        <button className="p-2 rounded-full" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div className="text-sm text-slate-600">
          <strong>Name: </strong> {client.name}
        </div>
        <div className="text-sm text-slate-600">
          <strong>Email: </strong> {client.email}
        </div>
        <div className="text-sm text-slate-600">
          <strong>Phone: </strong> {client.phone}
        </div>
        <div className="text-sm text-slate-600">
          <strong>Tenant: </strong> {client.webshop}
        </div>
        <div className="text-sm text-slate-600">
          <strong>Service: </strong> {client.service}
        </div>
        <div className="text-sm text-slate-600">
          <strong>Status: </strong> {client.isActive ? "Active" : "Inactive"}
        </div>
      </div>
    </div>
  );
}
