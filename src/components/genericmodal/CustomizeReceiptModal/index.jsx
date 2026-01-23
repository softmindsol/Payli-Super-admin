import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useModal } from "@/context/modal";

// same-style, map-based fields
const FIELDS = [
  { name: "templateName", label: "Receipt Name",      type: "text",     placeholder: "Default Receipt", required: true },
  { name: "businessName", label: "Business Name",     type: "text",     placeholder: "Your Store LLC",  required: true },
  { name: "businessAddress", label: "Business Address", type: "textarea", placeholder: "123 Main St, City, Country" },
  { name: "phone",        label: "Phone",             type: "text",     placeholder: "+1 234 567 890" },
  { name: "website",      label: "Website",           type: "text",     placeholder: "www.example.com" },
  { name: "footerNote",   label: "Footer Note",       type: "textarea", placeholder: "Thank you for your purchase!" },
  { name: "paperSize",    label: "Paper Size",        type: "select",   options: ["58mm", "80mm", "A4"], required: true },
];

const schema = Yup.object(
  FIELDS.reduce((acc, f) => {
    if (f.required) acc[f.name] = Yup.string().trim().required("Required");
    return acc;
  }, {})
);

export default function CustomizeReceiptModal() {
  const { closeModal } = useModal();

  const initialValues = {
    templateName: "Default Receipt",
    businessName: "",
    businessAddress: "",
    phone: "",
    website: "",
    footerNote: "Thank you for your purchase!",
    paperSize: "80mm",
  };

  return (
    <div className="w-full max-w-[540px] rounded-2xl bg-white p-9 md:p-5">
      <h3 className="text-[22px] font-bold text-[#2E2E2E]">Customize Receipt</h3>

      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          console.log("RECEIPT_SAVE:", values);
          closeModal();
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="mt-8 space-y-4">
            {FIELDS.map((f) => (
              <div key={f.name}>
                <label className="block mb-3 text-[16px] text-[#2E2E2E] font-bold">
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
                ) : f.type === "textarea" ? (
                  <Field
                    as="textarea"
                    rows={3}
                    name={f.name}
                    placeholder={f.placeholder}
                    className="w-full rounded-lg border border-[#EFEFEF] px-5 py-3 placeholder:text-[#545454] text-sm outline-none focus:ring-2 focus:ring-[#1D50AB]/30"
                  />
                ) : (
                  <Field
                    name={f.name}
                    type="text"
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
                Save Receipt
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
