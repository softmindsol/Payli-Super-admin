import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useModal } from "@/context/modal";

// config -> map se fields render honge
const FORM_FIELDS = [
  { name: "name",       label: "Name",          type: "text",  placeholder: "samran nadeem" },
  { name: "email",      label: "Email Address", type: "email", placeholder: "samranadeem@gmail.com",
    yup: Yup.string().email("Invalid email").required("Required") },
  { name: "phone",      label: "Phone Number",  type: "text",  placeholder: "+0123 456 789" },
  { name: "posAddress", label: "POS Address",   type: "text",  placeholder: "Bend Oregon, United States of America" },
];

// Yup schema from config (default string required)
const schema = Yup.object(
  FORM_FIELDS.reduce((acc, f) => {
    acc[f.name] = f.yup || Yup.string().trim().required("Required");
    return acc;
  }, {})
);

export default function EditEmployeeForm({ data, onSubmit }) {
  const { closeModal } = useModal();

  const initialValues = {
    name: data?.name ?? "",
    email: data?.email ?? "",
    phone: data?.phone ?? "",
    posAddress: `${data?.posCity ?? ""}${data?.posCountry ? `,${data.posCountry}` : ""}`,
  };

  return (
    <div className="">
      <h3 className="mb-6 text-[20px] font-semibold text-[#2E2E2E]">Edit Employee</h3>

      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await onSubmit?.(values);      // parent handle karega update
          } finally {
            setSubmitting(false);
            closeModal();
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {FORM_FIELDS.map((f) => (
              <div key={f.name}>
                <label className="block mb-1 text-sm text-gray-700">{f.label}</label>
                <Field
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#1D50AB]/30"
                />
                <ErrorMessage name={f.name} component="div" className="mt-1 text-xs text-red-600" />
              </div>
            ))}

            <div className="flex items-center justify-between gap-3 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="w-full md:w-auto rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-[#2E2E2E]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto rounded-full bg-gradient-to-r from-[#9EE7E6] to-[#1D50AB] px-5 py-2.5 text-white disabled:opacity-60"
              >
                Save Changes
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
