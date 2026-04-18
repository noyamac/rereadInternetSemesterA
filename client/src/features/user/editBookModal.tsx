import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import type { EditBookFields } from '../../shared/types/book.model';

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
  const isTitleInvalid = fields.title.trim().length === 0;
  const isAuthorInvalid = fields.author.trim().length === 0;
  const isPriceInvalid = !Number.isFinite(fields.price) || fields.price < 0;
  const isDescriptionInvalid = fields.description.trim().length === 0;

  const isFormValid =
    !isTitleInvalid &&
    !isAuthorInvalid &&
    !isDescriptionInvalid &&
    !isPriceInvalid;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Edit Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <p className="text-muted small mb-3">* Required fields</p>

          <Form.Group className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              value={fields.title}
              onChange={(event) => onFieldChange('title', event.target.value)}
              isInvalid={isTitleInvalid}
              required
            />
            <Form.Control.Feedback type="invalid">
              Title is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Author *</Form.Label>
            <Form.Control
              value={fields.author}
              onChange={(event) => onFieldChange('author', event.target.value)}
              isInvalid={isAuthorInvalid}
              required
            />
            <Form.Control.Feedback type="invalid">
              Author is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price ($) *</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={fields.price}
              onChange={(event) =>
                onFieldChange(
                  'price',
                  event.target.value === ''
                    ? Number.NaN
                    : Number(event.target.value),
                )
              }
              isInvalid={isPriceInvalid}
              required
            />
            <Form.Control.Feedback type="invalid">
              Price is required and must be 0 or more.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              value={fields.description}
              onChange={(event) =>
                onFieldChange('description', event.target.value)
              }
              isInvalid={isDescriptionInvalid}
              required
            />
            <Form.Control.Feedback type="invalid">
              Description is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Summary</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={fields.summary}
              onChange={(event) => onFieldChange('summary', event.target.value)}
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
          disabled={isSaving || !isFormValid}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditBookModal;
