import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useModal } from "../../../context/modal";
import { X } from "lucide-react";

const GRADIENT = "linear-gradient(90deg, #B2F0E7 -7.06%, #C9DDF9 100%)";

// ⬇️ Schema isi file me
const Schema = Yup.object({
  name: Yup.string().trim().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  phone: Yup.string().trim().required("Required"),
  webshop: Yup.string().trim().required("Required"),
  company: Yup.string().trim().required("Required"),
  region: Yup.string().trim().required("Required"),
});

export default function AddClientModal({ onClose }) {
  const { closeModal } = useModal();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#2E2E2E]">Add Client</h2>
        <button
          className="p-2 rounded-full hover:bg-slate-100"
          onClick={onClose || closeModal}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <Formik
        initialValues={{
          name: "",
          email: "",
          phone: "",
          webshop: "",
          company: "",
          region: "",
        }}
        validationSchema={Schema}
        onSubmit={(values) => {
          console.log("Add client form:", values);
          closeModal();
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {[
              { name: "name", label: "Name", placeholder: "samran nadeem" },
              {
                name: "email",
                label: "Email Address",
                placeholder: "samrannadeem@gmail.com",
                type: "email",
              },
              {
                name: "phone",
                label: "Phone Number",
                placeholder: "+0123 456 789",
              },
              { name: "webshop", label: "Webshop Name", placeholder: "Collebaut" },
              { name: "company", label: "Company", placeholder: "Clothing Brand" },
              { name: "region", label: "Business Region", placeholder: "Belgium" },
            ].map((f) => (
              <div key={f.name}>
                <label className="mb-1 block text-sm font-medium text-[#2E2E2E]">
                  {f.label}
                </label>
                <Field
                  type={f.type || "text"}
                  name={f.name}
                  placeholder={f.placeholder}
                  className="w-full rounded-lg border border-[#E6E6E6] px-3 py-2.5 outline-none focus:ring-2 focus:ring-sky-300"
                />
                <ErrorMessage
                  name={f.name}
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
            ))}

            {/* Actions */}
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={onClose || closeModal}
                className="flex-1 rounded-full border border-[#E6E6E6] bg-white px-5 py-3 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-full px-5 py-3 font-semibold text-[#1F2937]"
                style={{ background: GRADIENT, boxShadow: "0px 4px 6px 0px #00000029" }}
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
