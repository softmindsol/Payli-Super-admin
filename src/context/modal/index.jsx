import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { modalService } from "../../services/modalService";
import ModalTemplate from "../../components/Modals/ModalTemplate";

const ModalContext = createContext(undefined);

export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [modalConfig, setModalConfig] = useState({});

  const openModal = useCallback((configOrNode, modalWidth = null) => {
    // Support both old API (node, width) and new API (config object)
    if (
      typeof configOrNode === "object" &&
      configOrNode !== null &&
      !configOrNode.$$typeof
    ) {
      // New API: config object
      const config = configOrNode;

      // If it's a modal service config with type, use ModalTemplate
      if (config.type) {
        setContent(
          <ModalTemplate config={config} onClose={() => closeModal()} />
        );
        setModalConfig(config);
      } else {
        // Custom content
        setContent(config.content);
        setModalConfig(config);
      }
    } else {
      // Old API: React node
      setContent(configOrNode);
      setModalConfig({
        width: modalWidth,
        closeOnOverlay: true,
        closeOnEsc: true,
      });
    }

    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (modalConfig.onClose) {
      modalConfig.onClose();
    }
    setIsOpen(false);
    setContent(null);
    setModalConfig({});
  }, [modalConfig]);

  // Lock body scroll while modal is open (and avoid layout shift)
  useEffect(() => {
    if (!isOpen) return;

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    // calculate scrollbar width (to prevent layout jump)
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [isOpen]);

  // Initialize modal service
  useEffect(() => {
    modalService.init(openModal, closeModal);
  }, [openModal, closeModal]);

  const value = useMemo(
    () => ({
      isOpen,
      content,
      config: modalConfig,
      width: modalConfig.width, // backward compatibility
      openModal,
      closeModal,
      setContent, // optional: update current modal content without closing
    }),
    [isOpen, content, modalConfig, openModal, closeModal]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return ctx;
};
