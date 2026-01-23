import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react"; // ✅ arrow icon
import * as Yup from "yup"; // Yup validation

// Fields configuration for the form
const FIELDS = [
  { name: "name", label: "Name", type: "text", placeholder: "Enter name" },
  { name: "email", label: "Email Address", type: "email", placeholder: "example@gmail.com" },
  { name: "phone", label: "Phone Number", type: "phone", placeholder: "Enter phone number" },
  { name: "role", label: "Role", type: "select", options: ["Admin", "Manager", "Cashier"] },
  { name: "posAddress", label: "POS Locations", type: "multiselect", options: ["Outlet 1", "Outlet 2", "Outlet 3"], fullWidth: true },
];

// Inline Validation Schema Using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  phone: Yup.string().required("Phone number is required").matches(/^[0-9]+$/, "Phone number must be numeric"),
  role: Yup.string().required("Role is required"),
  posAddress: Yup.array().min(1, "At least one location must be selected").required("POS Locations are required"),
});

export default function AddEmployeeForm({ onSubmit, data = null, isEdit = false, closeModal }) {
  const [dropdownOpen, setDropdownOpen] = useState({});
  const dropdownRef = useRef(null);

  const initialValues = {
    name: data?.name ?? "",
    email: data?.email ?? "",
    phone: data?.phone ?? "+32 ",
    role: data?.role ?? "",
    posAddress: data?.posAddress ?? [],
  };

  return (
    <div className="w-full max-w-[840px] rounded-2xl bg-white">
      <h3 className="text-[22px] font-bold text-[#2E2E2E]">{isEdit ? "Edit Employee" : "Add Employee"}</h3>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            // For now, just call onSubmit and pass values (no validation)
            await onSubmit?.(values);
            if (!isEdit) resetForm(); // Only reset form for new additions
            closeModal();
          } catch (error) {
            console.error(`Failed to ${isEdit ? "update" : "add"} employee:`, error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.name} className={`flex flex-col relative ${f.fullWidth ? "md:col-span-2" : ""}`}>
                <label className="mb-2 text-[15px] text-[#2E2E2E] capitalize font-semibold">{f.label}</label>

                {/* Render select, multiselect, phone input, or other fields */}
                {f.type === "select" ? (
                  <div className="relative">
                    <Field as="select" name={f.name} className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1D50AB]/30 bg-white appearance-none">
                      <option value="" disabled hidden>Select {f.label}</option>
                      {f.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </Field>
                    <ChevronDown className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2" size={18} />
                  </div>
                ) : f.type === "multiselect" ? (
                  <div className="relative" ref={dropdownRef}>
                    <Field name={f.name}>
                      {({ field, form }) => (
                        <>
                          <div
                            className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 bg-white min-h-[48px] cursor-pointer"
                            onClick={() =>
                              setDropdownOpen((prev) => ({
                                ...prev,
                                [f.name]: !prev[f.name],
                              }))
                            }
                          >
                            <div className="flex flex-wrap gap-2">
                              {field.value && field.value.length > 0 ? (
                                field.value.map((selectedValue) => (
                                  <span key={selectedValue} className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                                    {selectedValue}
                                    <button type="button" onClick={(e) => {
                                      e.stopPropagation();
                                      const newValue = field.value.filter((v) => v !== selectedValue);
                                      form.setFieldValue(f.name, newValue);
                                    }} className="text-blue-600 hover:text-blue-800">×</button>
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-gray-500">Select locations...</span>
                              )}
                            </div>
                            <ChevronDown className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2" size={18} />
                          </div>

                          {dropdownOpen[f.name] && (
                            <div className="absolute left-0 right-0 z-10 mt-1 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg top-full max-h-48">
                              {f.options?.map((opt) => {
                                const isSelected = field.value?.includes(opt);
                                return (
                                  <div
                                    key={opt}
                                    onClick={() => {
                                      const newValue = isSelected
                                        ? field.value.filter((v) => v !== opt)
                                        : [...(field.value || []), opt];
                                      form.setFieldValue(f.name, newValue);
                                      setDropdownOpen((prev) => ({
                                        ...prev,
                                        [f.name]: false,
                                      }));
                                    }}
                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${isSelected ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"}`}
                                  >
                                    <span className="text-sm">{opt}</span>
                                    {isSelected && <span className="float-right text-blue-600">✓</span>}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </>
                      )}
                    </Field>
                  </div>
                ) : f.type === "phone" ? (
                  <Field name={f.name}>
                    {({ field, form }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1D50AB]/30 bg-white"
                        placeholder={f.placeholder}
                      />
                    )}
                  </Field>
                ) : (
                  <Field name={f.name} type={f.type} placeholder={f.placeholder} className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 placeholder:text-[#9CA3AF] text-sm outline-none focus:ring-2 focus:ring-[#1D50AB]/30" />
                )}

                <ErrorMessage name={f.name} component="div" className="mt-1 text-xs text-red-600" />
              </div>
            ))}

            {/* Buttons full width (span 2) */}
            <div className="flex items-center justify-between gap-3 pt-6 md:col-span-2">
              <button type="button" onClick={closeModal} className="w-full rounded-full border border-[#E5E7EB] text-black font-semibold text-[16px] py-3">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-gradient-to-r from-[#B2F0E7] to-[#C9DDF9] py-3 text-black font-semibold text-[16px] disabled:opacity-60">
                {isSubmitting ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
