class ModalService {
    constructor() {
        this.openModal = null;
        this.closeModal = null;
    }

    init(openModal, closeModal) {
        this.openModal = openModal;
        this.closeModal = closeModal;
    }

    open(config) {
        if (this.openModal) {
            this.openModal(config);
        } else {
            console.error("ModalService not initialized");
        }
    }

    close() {
        if (this.closeModal) {
            this.closeModal();
        }
    }
}

export const modalService = new ModalService();
