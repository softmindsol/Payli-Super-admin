import React, { useCallback, useMemo, useState } from "react";
import TableLayout from "../../../layout/TableLayout";
import { COUPON_COLUMNS } from "./column";
import { useModal } from "@/context/modal";
import AddCouponModal from "../../../components/Modals/AddCouponModal";
import EditCouponModal from "../../../components/Modals/EditCouponModal";
import DeleteCouponModal from "../../../components/Modals/DeleteCouponModal";
import CouponStatsModal from "../../../components/Modals/CouponStatsModal";
import { useGetCouponsQuery } from "../../../features/api/apiSlice";

const GRADIENT = "linear-gradient(90deg, #2196F3 -7.06%, #00338D 100%)";

export default function CouponsManagement() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, expired, inactive
  const { openModal, closeModal } = useModal();

  // API query with search and filter params
  const { data, isLoading, error, refetch } = useGetCouponsQuery({
    search: search.trim() || undefined,
    active:
      filter === "active" ? true : filter === "inactive" ? false : undefined,
    expired: filter === "expired" ? true : undefined,
  });

  const coupons = data?.data?.coupons || [];

  const onAddCoupon = useCallback(() => {
    openModal(<AddCouponModal onClose={closeModal} onSuccess={refetch} />, 720);
  }, [openModal, closeModal, refetch]);

  const onEdit = useCallback(
    (row) => {
      openModal(
        <EditCouponModal
          coupon={row}
          onClose={closeModal}
          onSuccess={refetch}
        />,
        720,
      );
    },
    [openModal, closeModal, refetch],
  );

  const onDelete = useCallback(
    (row) => {
      openModal(
        <DeleteCouponModal
          coupon={row}
          onClose={closeModal}
          onSuccess={refetch}
        />,
        480,
      );
    },
    [openModal, closeModal, refetch],
  );

  const onViewStats = useCallback(
    (row) => {
      openModal(<CouponStatsModal coupon={row} onClose={closeModal} />, 600);
    },
    [openModal, closeModal],
  );

  const columns = useMemo(
    () => COUPON_COLUMNS({ onEdit, onDelete, onViewStats }),
    [onEdit, onDelete, onViewStats],
  );

  // Calculate statistics from real data
  const statistics = useMemo(() => {
    if (!Array.isArray(coupons)) {
      return {
        totalCoupons: 0,
        activeCoupons: 0,
        totalRedemptions: 0,
        totalDiscountGiven: "0.00",
      };
    }

    const totalCoupons = coupons.length;
    const activeCoupons = coupons.filter(
      (c) => c.active && !c.isExpired && !c.isMaxedOut,
    ).length;
    const totalRedemptions = coupons.reduce(
      (sum, c) => sum + (c.timesRedeemed || 0),
      0,
    );
    const totalDiscountGiven = coupons.reduce((sum, c) => {
      // Calculate approximate discount given based on type and value
      if (c.type === "percentage") {
        return sum + (c.timesRedeemed || 0) * (c.value / 100) * 50; // Assuming avg order €50
      } else {
        return sum + (c.timesRedeemed || 0) * c.value;
      }
    }, 0);

    return {
      totalCoupons,
      activeCoupons,
      totalRedemptions,
      totalDiscountGiven: totalDiscountGiven.toFixed(2),
    };
  }, [coupons]);

  return (
    <>
      {/* Page heading */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#2E2E2E]">
            Coupon Management
          </h1>
          <p className="mt-1 text-sm text-[#545454]">
            Create and manage promotional coupons for onboarding
          </p>
        </div>

        {/* Right controls */}
        <div className="flex items-center justify-start w-full gap-3 sm:w-auto sm:justify-end">
          <button
            onClick={onAddCoupon}
            className="inline-flex items-center gap-2 rounded-full bg-[#1E50A2] px-5 py-2.5 text-white shadow-sm hover:opacity-95"
          >
            <span className="text-lg leading-none">＋</span>
            <span className="font-medium">Add Coupon</span>
          </button>

          <div className="flex items-stretch rounded-full border border-[#E6E6E6] bg-white pl-3 pr-1 shadow-sm">
            <div className="flex items-center pr-1 text-slate-600">🔍</div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search coupons..."
              className="h-10 w-[200px] rounded-full px-2 text-sm outline-none sm:w-[280px]"
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

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {[
          { key: "all", label: "All Coupons" },
          { key: "active", label: "Active" },
          { key: "expired", label: "Expired" },
          { key: "inactive", label: "Inactive" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
              filter === tab.key
                ? "bg-[#1E50A2] text-white"
                : "bg-white text-[#6B7280] border border-[#E6E6E6] hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-white border rounded-lg shadow-sm border-slate-200">
          <div className="text-xs font-medium text-[#6B7280]">
            Total Coupons
          </div>
          <div className="mt-1 text-2xl font-bold text-[#2E2E2E]">
            {statistics.totalCoupons}
          </div>
        </div>
        <div className="p-4 bg-white border rounded-lg shadow-sm border-slate-200">
          <div className="text-xs font-medium text-[#6B7280]">
            Active Coupons
          </div>
          <div className="mt-1 text-2xl font-bold text-green-600">
            {statistics.activeCoupons}
          </div>
        </div>
        <div className="p-4 bg-white border rounded-lg shadow-sm border-slate-200">
          <div className="text-xs font-medium text-[#6B7280]">
            Total Redemptions
          </div>
          <div className="mt-1 text-2xl font-bold text-blue-600">
            {statistics.totalRedemptions}
          </div>
        </div>
        <div className="p-4 bg-white border rounded-lg shadow-sm border-slate-200">
          <div className="text-xs font-medium text-[#6B7280]">
            Total Discount Given
          </div>
          <div className="mt-1 text-2xl font-bold text-purple-600">
            €{statistics.totalDiscountGiven}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-medium">Error loading coupons</p>
          <p className="text-sm">{error.data?.message || error.message}</p>
          <button
            onClick={refetch}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Table */}
      <TableLayout
        title="Coupon List"
        columns={columns}
        data={coupons}
        loading={isLoading}
        queryParams={{ page: 1 }}
        totalPages={1}
        totalItems={data?.total || coupons.length}
        showSearch={false}
        showCategories={false}
        showSelectOutlet={false}
        entityLabel="coupons"
      />
    </>
  );
}
