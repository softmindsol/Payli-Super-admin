import React from "react";
import { Formik, Form, Field } from "formik";
import { X } from "lucide-react";
import { useModal } from "@/context/modal";
import { useUpdateCouponMutation } from "@/features/api/apiSlice";

const GRADIENT = "linear-gradient(90deg, #B2F0E7 -7.06%, #C9DDF9 100%)";
export default function EditCouponModal({ coupon, onClose }) {
  const { closeModal } = useModal();
  const [updateCoupon, { isLoading, error }] = useUpdateCouponMutation();

  const handleClose = () => {
    if (onClose) onClose();
    else closeModal();
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between pb-4 mb-6 bg-white border-b">
        <div>
          <h2 className="text-xl font-semibold text-[#2E2E2E]">Edit Coupon</h2>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Code: <span className="font-mono font-semibold">{coupon.code}</span>
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

      <Formik
        initialValues={{
          name: coupon.name || "",
          active: coupon.active !== undefined ? coupon.active : true,
          expiresAt: formatDateForInput(coupon.expiresAt),
          maxRedemptions: coupon.maxRedemptions || "",
          maxRedemptionsPerCustomer: coupon.maxRedemptionsPerCustomer || 1,
          minimumAmount: coupon.minimumAmount || 0,
          applicablePlans: coupon.applicablePlans || [],
          notes: coupon.notes || "",
        }}
        onSubmit={async (values) => {
          try {
            await updateCoupon({ id: coupon.id, ...values }).unwrap();
            handleClose();
          } catch (err) {
            console.error("Failed to update coupon:", err);
          }
        }}
      >
        {({ values, isSubmitting }) => (
          <Form className="space-y-5 px-2 pb-6">
            {/* Read-only info */}
            <div className="p-4 rounded-lg bg-slate-50">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-[#6B7280]">Type:</span>{" "}
                  <span className="font-medium">
                    {coupon.type === "percentage"
                      ? `${coupon.value}%`
                      : `€${coupon.value}`}
                  </span>
                </div>
                <div>
                  <span className="text-[#6B7280]">Times Redeemed:</span>{" "}
                  <span className="font-medium">
                    {coupon.timesRedeemed || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#2E2E2E]">
                Coupon Name <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                name="name"
                placeholder="Welcome Discount - 10% Off"
                className="w-full rounded-lg border border-[#E6E6E6] px-3 py-2.5 outline-none focus:ring-2 focus:ring-sky-300"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#2E2E2E]">
                Expiry Date (Optional)
              </label>
              <Field
                type="datetime-local"
                name="expiresAt"
                className="w-full rounded-lg border border-[#E6E6E6] px-3 py-2.5 outline-none focus:ring-2 focus:ring-sky-300"
              />
            </div>

            {/* Max Redemptions */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#2E2E2E]">
                  Max Total Redemptions
                </label>
                <Field
                  type="number"
                  name="maxRedemptions"
                  placeholder="Leave empty for unlimited"
                  className="w-full rounded-lg border border-[#E6E6E6] px-3 py-2.5 outline-none focus:ring-2 focus:ring-sky-300"
                />
                <p className="mt-1 text-xs text-[#6B7280]">
                  Current: {coupon.timesRedeemed || 0} used
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#2E2E2E]">
                  Max Per Customer <span className="text-red-500">*</span>
                </label>
                <Field
                  type="number"
                  name="maxRedemptionsPerCustomer"
                  placeholder="1"
                  className="w-full rounded-lg border border-[#E6E6E6] px-3 py-2.5 outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>
            </div>

            {/* Minimum Amount */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#2E2E2E]">
                Minimum Order Amount (€)
              </label>
              <Field
                type="number"
                name="minimumAmount"
                placeholder="0"
                step="0.01"
                className="w-full rounded-lg border border-[#E6E6E6] px-3 py-2.5 outline-none focus:ring-2 focus:ring-sky-300"
              />
              <p className="mt-1 text-xs text-[#6B7280]">
                Set 0 for no minimum requirement
              </p>
            </div>

            {/* Applicable Plans */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2E2E2E]">
                Applicable Plans
              </label>
              <div className="flex flex-wrap gap-3">
                {["pos", "webshop", "combo"].map((plan) => (
                  <label key={plan} className="flex items-center gap-2">
                    <Field
                      type="checkbox"
                      name="applicablePlans"
                      value={plan}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-[#2E2E2E] uppercase">
                      {plan}
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-[#6B7280]">
                Leave all unchecked to apply to all plans
              </p>
            </div>

            {/* Active Status */}
            <div>
              <label className="flex items-center gap-2">
                <Field
                  type="checkbox"
                  name="active"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-[#2E2E2E]">
                  Active
                </span>
              </label>
              <p className="mt-1 text-xs text-[#6B7280] ml-6">
                Inactive coupons cannot be used by customers
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#2E2E2E]">
                Notes (Optional)
              </label>
              <Field
                as="textarea"
                name="notes"
                placeholder="Internal notes about this coupon..."
                rows={3}
                className="w-full rounded-lg border border-[#E6E6E6] px-3 py-2.5 outline-none focus:ring-2 focus:ring-sky-300"
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">
                  {error?.data?.message ||
                    "Failed to update coupon. Please try again."}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-full border border-[#E6E6E6] bg-white px-5 py-3 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-full px-5 py-3 font-semibold text-[#1F2937] hover:opacity-90 disabled:opacity-50"
                style={{ background: GRADIENT }}
              >
                {isLoading ? "Updating..." : "Update Coupon"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
