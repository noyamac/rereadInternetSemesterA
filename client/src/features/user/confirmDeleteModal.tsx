import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface ConfirmDeleteModalProps {
  show: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  isProcessing?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  show,
  title,
  message,
  confirmLabel,
  isProcessing = false,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-danger">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-2">
        <p className="text-muted mb-0">{message}</p>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button
          variant="outline-light-blue"
          className="rounded-pill px-4"
          onClick={onClose}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          className="rounded-pill px-4"
          onClick={onConfirm}
          disabled={isProcessing}
        >
          {isProcessing ? 'Removing...' : confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteModal;
