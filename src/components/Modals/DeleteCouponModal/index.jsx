import React from "react";
import { X, AlertTriangle } from "lucide-react";
import { useModal } from "@/context/modal";
import { useDeleteCouponMutation } from "@/features/api/apiSlice";

const GRADIENT = "linear-gradient(90deg, #B2F0E7 -7.06%, #C9DDF9 100%)";

export default function DeleteCouponModal({ coupon, onClose }) {
  const { closeModal } = useModal();
  const [deleteCoupon, { isLoading, error }] = useDeleteCouponMutation();

  const handleClose = () => {
    if (onClose) onClose();
    else closeModal();
  };

  const handleDelete = async () => {
    try {
      await deleteCoupon(coupon.id).unwrap();
      handleClose();
    } catch (err) {
      console.error("Failed to delete coupon:", err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#2E2E2E]">Delete Coupon</h2>
        <button
          className="p-2 rounded-full hover:bg-slate-100"
          onClick={handleClose}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Warning Icon */}
      <div className="flex justify-center mb-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
      </div>

      {/* Message */}
      <div className="mb-6 text-center">
        <p className="text-[#2E2E2E] mb-2">
          Are you sure you want to delete this coupon?
        </p>
        <div className="p-3 mt-3 rounded-lg bg-slate-50">
          <p className="text-sm font-semibold text-[#2E2E2E]">{coupon.name}</p>
          <p className="text-sm font-mono text-blue-600">{coupon.code}</p>
        </div>
        <p className="text-sm text-[#6B7280] mt-4">
          This coupon will be soft-deleted and cannot be used anymore.
          Historical data will be preserved.
        </p>
      </div>

      {/* Additional Info */}
      {coupon.timesRedeemed > 0 && (
        <div className="p-3 mb-4 border border-yellow-200 rounded-lg bg-yellow-50">
          <p className="text-sm text-yellow-800">
            ⚠️ This coupon has been used <strong>{coupon.timesRedeemed}</strong>{" "}
            times. Deleting it will not affect existing redemptions.
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">
            {error?.data?.message ||
              "Failed to delete coupon. Please try again."}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleClose}
          className="flex-1 rounded-full border border-[#E6E6E6] bg-white px-5 py-3 font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isLoading}
          className="flex-1 rounded-full bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          {isLoading ? "Deleting..." : "Delete Coupon"}
        </button>
      </div>
    </div>
  );
}
