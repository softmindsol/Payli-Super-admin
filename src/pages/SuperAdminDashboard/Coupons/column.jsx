import React from "react";
import { Trash2, Edit, BarChart3 } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

export const COUPON_COLUMNS = ({ onEdit, onDelete, onViewStats }) => [
  {
    key: "code",
    label: "Code",
    sortable: true,
    width: "140px",
    render: (row) => (
      <span className="font-mono font-semibold text-blue-600">{row.code}</span>
    ),
  },
  {
    key: "name",
    label: "Name",
    sortable: true,
    width: "200px",
    render: (row) => (
      <div>
        <div className="font-medium text-[#2E2E2E]">{row.name}</div>
        {row.notes && (
          <div className="text-xs text-[#6B7280] mt-0.5 truncate max-w-[180px]">
            {row.notes}
          </div>
        )}
      </div>
    ),
  },
  {
    key: "type",
    label: "Type",
    sortable: true,
    width: "120px",
    render: (row) => (
      <Badge variant={row.type === "percentage" ? "default" : "secondary"}>
        {row.type === "percentage" ? `${row.value}%` : `€${row.value}`}
      </Badge>
    ),
  },
  {
    key: "active",
    label: "Status",
    sortable: true,
    width: "100px",
    render: (row) => {
      const isNotStarted = row.startsAt && new Date(row.startsAt) > new Date();

      let status = "Active";
      let variant = "default";

      if (!row.active) {
        status = "Inactive";
        variant = "outline";
      } else if (row.isExpired) {
        status = "Expired";
        variant = "destructive";
      } else if (row.isMaxedOut) {
        status = "Maxed Out";
        variant = "secondary";
      } else if (isNotStarted) {
        status = "Scheduled";
        variant = "secondary";
      }

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    key: "timesRedeemed",
    label: "Usage",
    sortable: true,
    width: "140px",
    render: (row) => (
      <div className="text-sm">
        <span className="font-semibold text-[#2E2E2E]">
          {row.timesRedeemed || 0}
        </span>
        {row.maxRedemptions && (
          <span className="text-[#6B7280]"> / {row.maxRedemptions}</span>
        )}
        {!row.maxRedemptions && <span className="text-[#6B7280]"> / ∞</span>}
      </div>
    ),
  },
  {
    key: "validityPeriod",
    label: "Validity Period",
    width: "180px",
    render: (row) => {
      const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      };

      return (
        <div className="text-xs">
          {row.startsAt && (
            <div className="text-[#6B7280]">
              From: {formatDate(row.startsAt)}
            </div>
          )}
          {row.expiresAt && (
            <div className="text-[#6B7280]">
              To: {formatDate(row.expiresAt)}
            </div>
          )}
          {!row.startsAt && !row.expiresAt && (
            <div className="text-[#6B7280]">No expiry</div>
          )}
        </div>
      );
    },
  },
  {
    key: "applicablePlans",
    label: "Plans",
    width: "140px",
    render: (row) => {
      if (!row.applicablePlans || row.applicablePlans.length === 0) {
        return <span className="text-xs text-[#6B7280]">All Plans</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {row.applicablePlans.slice(0, 2).map((plan, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {plan.toUpperCase()}
            </Badge>
          ))}
          {row.applicablePlans.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{row.applicablePlans.length - 2}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    key: "actions",
    label: "Actions",
    width: "140px",
    render: (row) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onViewStats(row)}
          className="p-2 text-blue-600 transition-colors rounded-md hover:bg-blue-50"
          title="View Statistics"
        >
          <BarChart3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(row)}
          className="p-2 text-green-600 transition-colors rounded-md hover:bg-green-50"
          title="Edit Coupon"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(row)}
          className="p-2 text-red-600 transition-colors rounded-md hover:bg-red-50"
          title="Delete Coupon"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
  },
];
