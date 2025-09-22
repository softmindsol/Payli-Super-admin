// src/components/genericmodal/CreateOutletModal/index.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useModal } from "@/context/modal";

// build-item style: ek hi array se sab fields render
const FIELDS = ["name", "location"];

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  location: Yup.string().trim().required("Location is required"),
});

export default function CreateOutletModal({ onSubmit }) {
  const { closeModal } = useModal();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // integration later; abhi ke liye callback/console
      if (onSubmit) onSubmit(values);
      else console.log("OUTLET_CREATE:", values);
      resetForm();
      closeModal();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[540px] rounded-2xl bg-white p-9 md:p-5">
      <h3 className="text-[22px] font-bold text-[#2E2E2E]">Create New Outlet</h3>

      <Formik
        initialValues={{ name: "", location: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="mt-8 space-y-4">
            {FIELDS.map((field) => (
              <div key={field}>
                <label className="block mb-3 text-[16px] text-[#2E2E2E] capitalize font-bold">
                  {field}
                </label>
                <Field
                  name={field}
                  type="text"
                  placeholder={`enter ${field}`}
                  className="w-full  rounded-lg border border-[#EFEFEF] px-5 py-3 placeholder:text-[#545454] text-sm outline-none focus:ring-2 focus:ring-[#1D50AB]/30"
                />
                <ErrorMessage
                  name={field}
                  component="div"
                  className="mt-1 text-xs text-red-600"
                />
              </div>
            ))}

            <div className="flex items-center justify-between gap-3 pt-5">
              <button
                type="button"
                onClick={closeModal}
                className="w-full  rounded-full border border-[#E5E7EB] text-black font-semibold text-[16px]  py-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full  rounded-full bg-gradient-to-r from-[#B2F0E7] to-[#C9DDF9]  py-3 text-black font-semibold text-[16px] disabled:opacity-60"
              >
                Add Outlet
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
