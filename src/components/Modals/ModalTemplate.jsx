import React, { useState } from "react";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Error } from "@/assets/svgs";

export default function ModalTemplate({ config, onClose }) {
  const {
    title,
    message,
    type = "info", // info, success, warning, error
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    icon,
  } = config;

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      if (onConfirm) {
        await onConfirm();
      }
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const renderIcon = () => {
    if (icon) return icon;

    if (type === "error") {
      return (
        <div className="flex items-center justify-center mx-auto mb-3">
          <img src={Error} alt="Error" className="w-[126px] max-w-[126px]" />
        </div>
      );
    }

    let IconComponent = Info;
    let colorClass = "text-blue-500 bg-blue-50";

    if (type === "success") {
      IconComponent = CheckCircle;
      colorClass = "text-green-500 bg-green-50";
    } else if (type === "warning") {
      IconComponent = AlertTriangle;
      colorClass = "text-yellow-500 bg-yellow-50";
    }

    return (
      <div
        className={`flex items-center justify-center w-16 h-16 mx-auto mb-3 rounded-full ${colorClass}`}
      >
        <IconComponent className="w-8 h-8" />
      </div>
    );
  };

  const getButtonColor = () => {
    switch (type) {
      case "error":
      case "warning":
        return "bg-[#C90000] hover:bg-[#A00000]";
      case "success":
        return "bg-green-600 hover:bg-green-700";
      default:
        return "bg-[#00338D] hover:bg-[#002266]";
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="w-full max-w-[520px] rounded-2xl bg-white p-6"
    >
      {/* Icon */}
      {renderIcon()}

      {/* Title & text */}
      {title && (
        <h2 className="text-center text-[18px] font-semibold text-[#2E2E2E]">
          {title}
        </h2>
      )}
      {message && (
        <p className="mt-2 text-center text-[14px] text-[#545454]">{message}</p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-center gap-3 mt-6">
        {cancelText && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="rounded-full border border-[#E5E7EB] bg-white px-6 py-2.5 text-[#2E2E2E] disabled:opacity-60 hover:bg-gray-50"
          >
            {cancelText}
          </button>
        )}

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading}
          className={`rounded-full px-6 py-2.5 font-medium text-white disabled:opacity-60 ${getButtonColor()}`}
        >
          {isLoading ? "Processing..." : confirmText}
        </button>
      </div>
    </div>
  );
}
