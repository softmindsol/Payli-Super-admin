// src/components/genericmodal/AddEmployeeForm/index.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useModal } from "../../../context/modal/index";

// Config -> fields render via map (same style as CreateOutletModal)
const FIELDS = [
  { name: "name",       label: "Name",           type: "text",    placeholder: "enter name",
    yup: Yup.string().trim().required("Required") },
  { name: "email",      label: "Email Address",  type: "email",   placeholder: "example@gmail.com",
    yup: Yup.string().email("Invalid email").required("Required") },
  { name: "phone",      label: "Phone Number",   type: "text",    placeholder: "+0123 456 789",
    yup: Yup.string().trim().required("Required") },
  { name: "role",       label: "Role",           type: "select",  options: ["Admin","Manager","Cashier"],
    yup: Yup.string().required("Required") },
  { name: "posAddress", label: "POS Address",    type: "text",    placeholder: "enter address",
    yup: Yup.string().trim().required("Required") },
];

const schema = Yup.object(
  FIELDS.reduce((acc, f) => {
    acc[f.name] = f.yup || Yup.string().trim().required("Required");
    return acc;
  }, {})
);

export default function AddEmployeeForm({ onSubmit }) {
  const { closeModal } = useModal();

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    role: "",
    posAddress: "",
  };

  return (
    <div className="w-full max-w-[540px] rounded-2xl bg-white p-9 md:p-5">
      <h3 className="text-[22px] font-bold text-[#2E2E2E]">Add Employee</h3>

      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await onSubmit?.(values);
            resetForm();
            closeModal();
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="mt-8 space-y-4">
            {FIELDS.map((f) => (
              <div key={f.name}>
                <label className="block mb-3 text-[16px] text-[#2E2E2E] capitalize font-bold">
                  {f.label}
                </label>

                {f.type === "select" ? (
                  <Field
                    as="select"
                    name={f.name}
                    className="w-full rounded-lg border border-[#EFEFEF] px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1D50AB]/30"
                  >
                    <option value="" disabled hidden>
                      Select {f.label}
                    </option>
                    {f.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </Field>
                ) : (
                  <Field
                    name={f.name}
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full rounded-lg border border-[#EFEFEF] px-5 py-3 placeholder:text-[#545454] text-sm outline-none focus:ring-2 focus:ring-[#1D50AB]/30"
                  />
                )}

                <ErrorMessage
                  name={f.name}
                  component="div"
                  className="mt-1 text-xs text-red-600"
                />
              </div>
            ))}

            <div className="flex items-center justify-between gap-3 pt-5">
              <button
                type="button"
                onClick={closeModal}
                className="w-full rounded-full border border-[#E5E7EB] text-black font-semibold text-[16px] py-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-gradient-to-r from-[#B2F0E7] to-[#C9DDF9] py-3 text-black font-semibold text-[16px] disabled:opacity-60"
              >
                Add Employee
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
