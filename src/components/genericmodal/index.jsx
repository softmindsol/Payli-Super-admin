import { useEffect, useRef } from "react";
import { useModal } from "../../context/modal/index";

const Modal = () => {
  const { isOpen, content, closeModal } = useModal();
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      // Only close if clicking on the backdrop (the outer div), not on the modal content
      if (e.target.classList.contains("backdrop-blur-sm")) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("click", handler);
    }

    return () => {
      document.removeEventListener("click", handler);
    };
  }, [closeModal, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeModal, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-3 overflow-x-hidden overflow-y-auto z-99999 backdrop-blur-sm bg-black/50"
      onClick={(e) => {
        // Close modal only if clicking on the backdrop
        if (e.target === e.currentTarget) {
          closeModal();
        }
      }}
    >
      <div
        ref={ref}
        id="popup-modal"
        tabIndex="-1"
        className="relative w-full max-w-lg bg-white rounded-lg shadow dark:bg-gray-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-h-[80vh] overflow-y-auto p-4">{content}</div>
      </div>
    </div>
  );
};

export default Modal;
