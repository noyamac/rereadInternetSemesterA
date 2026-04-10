import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

export interface EditBookFields {
  title: string;
  author: string;
  price: number;
  description: string;
  summery: string;
}

interface EditBookModalProps {
  show: boolean;
  fields: EditBookFields;
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
  onFieldChange: (field: keyof EditBookFields, value: string | number) => void;
}

const EditBookModal: React.FC<EditBookModalProps> = ({
  show,
  fields,
  isSaving,
  onClose,
  onSave,
  onFieldChange,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Edit Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={fields.title}
              onChange={(event) => onFieldChange('title', event.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control
              value={fields.author}
              onChange={(event) => onFieldChange('author', event.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price ($)</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={fields.price}
              onChange={(event) =>
                onFieldChange('price', Number(event.target.value))
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Condition</Form.Label>
            <Form.Control
              value={fields.description}
              onChange={(event) =>
                onFieldChange('description', event.target.value)
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Summary</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={fields.summery}
              onChange={(event) => onFieldChange('summery', event.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button
          variant="outline-secondary"
          className="rounded-pill px-4"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="rounded-pill px-4"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditBookModal;
