import React from "react";
import { X, TrendingUp, Users, DollarSign, Calendar } from "lucide-react";
import { useModal } from "@/context/modal";
import { useGetCouponStatsQuery } from "@/features/api/apiSlice";

export default function CouponStatsModal({ coupon, onClose }) {
  const { closeModal } = useModal();
  const { data, isLoading, error } = useGetCouponStatsQuery(coupon.id);

  const handleClose = () => {
    if (onClose) onClose();
    else closeModal();
  };

  const getCouponStatus = (stats) => {
    if (!stats) return { label: "Inactive", color: "text-red-600" };

    if (stats.isExpired) return { label: "Expired", color: "text-red-600" };

    if (stats.isMaxedOut)
      return { label: "Maxed Out", color: "text-orange-600" };

    if (stats.isActive) return { label: "Active", color: "text-green-600" };

    return { label: "Inactive", color: "text-red-600" };
  };

  // Extract stats from API response
  const stats = data?.data?.stats;

  // Use API data or fallback to coupon data
  const displayStats = stats
    ? {
        timesRedeemed: stats.timesRedeemed || 0,
        remainingRedemptions:
          stats.remainingRedemptions === null
            ? "Unlimited"
            : stats.remainingRedemptions,
        totalDiscountGiven: (stats.totalDiscountGiven || 0).toFixed(2),
        totalRevenue: (stats.totalRevenue || 0).toFixed(2),
        uniqueUsers: stats.uniqueUsers || 0,
        averageOrderValue: (stats.averageOrderValue || 0).toFixed(2),
        conversionRate: (stats.conversionRate || 0).toFixed(1),
      }
    : {
        timesRedeemed: coupon.timesRedeemed || 0,
        remainingRedemptions: coupon.maxRedemptions
          ? coupon.maxRedemptions - (coupon.timesRedeemed || 0)
          : "Unlimited",
        totalDiscountGiven: "0.00",
        totalRevenue: "0.00",
        uniqueUsers: 0,
        averageOrderValue: "0.00",
        conversionRate: "0.0",
      };

  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const couponStatus = getCouponStatus(stats);

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 pb-4 mb-6 bg-white border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#2E2E2E]">
              Coupon Statistics
            </h2>
            <p className="text-sm text-[#6B7280] mt-0.5">
              {stats?.name || coupon.name}
            </p>
          </div>
          <button
            className="p-2 rounded-full hover:bg-slate-100"
            onClick={handleClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-3">
          <span className="inline-flex items-center px-3 py-1 text-sm font-mono font-semibold text-blue-600 rounded-full bg-blue-50">
            {stats?.code || coupon.code}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading statistics...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-6">
          <p className="text-sm text-red-600">
            {error?.data?.message || "Failed to load coupon statistics."}
          </p>
        </div>
      )}

      {/* Key Metrics */}
      {!isLoading && !error && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {displayStats.timesRedeemed}
            </div>
            <div className="text-sm text-blue-700">Times Redeemed</div>
          </div>

          <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-900">
              {displayStats.uniqueUsers}
            </div>
            <div className="text-sm text-green-700">Unique Users</div>
          </div>

          <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-900">
              €{displayStats.totalDiscountGiven}
            </div>
            <div className="text-sm text-purple-700">Total Discount Given</div>
          </div>

          <div className="p-4 border rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-900">
              €{displayStats.totalRevenue}
            </div>
            <div className="text-sm text-orange-700">Total Revenue</div>
          </div>
        </div>
      )}

      {/* Additional Stats */}
      <div className="p-4 mb-6 border rounded-lg bg-slate-50 border-slate-200">
        <h3 className="mb-3 text-sm font-semibold text-[#2E2E2E]">
          Additional Information
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Average Order Value:</span>
            <span className="font-medium text-[#2E2E2E]">
              €{displayStats.averageOrderValue}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Conversion Rate:</span>
            <span className="font-medium text-[#2E2E2E]">
              {displayStats.conversionRate}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Remaining Redemptions:</span>
            <span className="font-medium text-[#2E2E2E]">
              {displayStats.remainingRedemptions}
            </span>
          </div>
        </div>
      </div>

      {/* Coupon Details */}
      <div className="p-4 mb-6 border rounded-lg border-slate-200">
        <h3 className="mb-3 text-sm font-semibold text-[#2E2E2E]">
          Coupon Details
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Type:</span>
            <span className="font-medium text-[#2E2E2E]">
              {coupon.type === "percentage"
                ? `${coupon.value}% Off`
                : `€${coupon.value} Off`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Status:</span>
            <span className={`font-medium ${couponStatus.color}`}>
              {couponStatus.label}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Start Date:</span>
            <span className="font-medium text-[#2E2E2E]">
              {formatDate(coupon.startsAt)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Expiry Date:</span>
            <span className="font-medium text-[#2E2E2E]">
              {formatDate(coupon.expiresAt)}
            </span>
          </div>
          {coupon.minimumAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Minimum Amount:</span>
              <span className="font-medium text-[#2E2E2E]">
                €{coupon.minimumAmount}
              </span>
            </div>
          )}
          {coupon.applicablePlans && coupon.applicablePlans.length > 0 && (
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Applicable Plans:</span>
              <span className="font-medium text-[#2E2E2E]">
                {coupon.applicablePlans.join(", ").toUpperCase()}
              </span>
            </div>
          )}
          {coupon.firstTimeOnly && (
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Restriction:</span>
              <span className="font-medium text-[#2E2E2E]">
                First-time customers only
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {coupon.notes && (
        <div className="p-4 mb-6 border rounded-lg bg-amber-50 border-amber-200">
          <h3 className="mb-2 text-sm font-semibold text-[#2E2E2E]">Notes</h3>
          <p className="text-sm text-[#6B7280]">{coupon.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="pt-4 border-t">
        <button
          type="button"
          onClick={handleClose}
          className="w-full rounded-full border border-[#E6E6E6] bg-white px-5 py-3 font-medium hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  );
}
