import React from "react";
import { Formik, Form, Field } from "formik";
import { X } from "lucide-react";
import { useModal } from "@/context/modal";
import { useCreateCouponMutation } from "@/features/api/apiSlice";

const GRADIENT = "linear-gradient(90deg, #B2F0E7 -7.06%, #C9DDF9 100%)";

export default function AddCouponModal({ onClose, onSuccess }) {
  const { closeModal } = useModal();
  const [createCoupon, { isLoading, error }] = useCreateCouponMutation();

  const handleClose = () => {
    if (onClose) onClose();
    else closeModal();
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between pb-4 mb-6 bg-white border-b">
        <h2 className="text-xl font-semibold text-[#2E2E2E]">Add New Coupon</h2>
        <button
          className="p-2 rounded-full hover:bg-slate-100"
          onClick={handleClose}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium">Error creating coupon</p>
          <p className="text-sm">{error.data?.message || error.message}</p>
        </div>
      )}

      <Formik
        initialValues={{
          code: "",
          name: "",
          type: "percentage",
          value: 10,
          currency: "eur",
          active: true,
          startsAt: null,
          expiresAt: null,
          maxRedemptions: "",
          maxRedemptionsPerCustomer: 1,
          minimumAmount: 0,
          applicablePlans: [],
          firstTimeOnly: false,
          notes: "",
        }}
        onSubmit={async (values) => {
          try {
            const payload = {
              ...values,
              code: values.code.toUpperCase(),
              maxRedemptions: values.maxRedemptions || null,
              startsAt: values.startsAt || null,
              expiresAt: values.expiresAt || null,
            };

            await createCoupon(payload).unwrap();
            if (onSuccess) onSuccess();
            handleClose();
          } catch (err) {
            // Error is handled by RTK Query
            console.error("Failed to create coupon:", err);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="space-y-5 px-2 pb-6">
            {/* Code & Name */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#2E2E2E]">
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="code"
                  placeholder="WELCOME10"
                  className="w-full rounded-lg border border-[#E6E6E6] px-3 py-2.5 uppercase outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>

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
            </div>

            {/* Type & Value */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#2E2E2E]">
                  Discount Type <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="type"
                  className="w-full rounded-lg border border-[#E6E6E6] px-3 py-2.5 outline-none focus:ring-2 focus:ring-sky-300"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (€)</option>
                </Field>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#2E2E2E]">
                  Discount Value <span className="text-red-500">*</span>
                </label>
                <Field
                  type="number"
                  name="value"
                  placeholder={values.type === "percentage" ? "10" : "5.00"}
                  step={values.type === "percentage" ? "1" : "0.01"}
                  className="w-full rounded-lg border border-[#E6E6E6] px-3 py-2.5 outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>
            </div>

            {/* Start & End Date */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#2E2E2E]">
                  Start Date (Optional)
                </label>
                <Field
                  type="datetime-local"
                  name="startsAt"
                  className="w-full rounded-lg border border-[#E6E6E6] px-3 py-2.5 outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>

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
                  Leave empty for unlimited usage
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

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <Field
                  type="checkbox"
                  name="firstTimeOnly"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-[#2E2E2E]">
                  First-time customers only
                </span>
              </label>

              <label className="flex items-center gap-2">
                <Field
                  type="checkbox"
                  name="active"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-[#2E2E2E]">Active</span>
              </label>
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
                {isLoading ? "Creating..." : "Create Coupon"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
