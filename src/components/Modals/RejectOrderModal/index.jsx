import React from "react";
import { useModal } from "@/context/modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const GRADIENT = "linear-gradient(90deg, #B2F0E7 -7.06%, #C9DDF9 100%)";

// Validation schema for the rejection reason
const RejectSchema = Yup.object({
  reason: Yup.string().trim().required("Reason is required"),
});

export default function RejectOrderModal({ order }) {
  const { closeModal } = useModal();

  return (
    <div className="">
      <h3 className="text-xl font-semibold text-[#2E2E2E]">Reject Order</h3>
      <p className="mt-1 text-sm text-[#6B7280]">
        Please provide a reason for rejecting this order
      </p>

      {/* Formik for rejection reason */}
      <Formik
        initialValues={{ reason: "" }}
        validationSchema={RejectSchema}
        onSubmit={(values) => {
          console.log("Reject order:", order?.orderId, values.reason);
          closeModal();
        }}
      >
        {({ isSubmitting }) => (
          <Form className="mt-5">
            <div>
              <Field
                as="textarea"
                name="reason"
                rows={4}
                placeholder="Enter rejection reason..."
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 outline-none focus:ring-2 focus:ring-sky-300"
              />
              <ErrorMessage
                name="reason"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div className="flex gap-4 mt-6">
              {/* Cancel Button */}
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 rounded-full border border-[#E5E7EB] bg-white px-5 py-3 font-medium"
              >
                Cancel
              </button>

              {/* Reject Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-full px-5 py-3 font-semibold text-[#1F2937]"
                style={{ background: GRADIENT, boxShadow: "0px 4px 6px 0px #00000029" }}
              >
                Reject Order
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
