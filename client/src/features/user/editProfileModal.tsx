import React from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import './editProfileModal.css';

export interface EditProfileFields {
  username: string;
  profilePicture: string;
}

interface EditProfileModalProps {
  show: boolean;
  fields: EditProfileFields;
  isSaving: boolean;
  errorMessage: string;
  onClose: () => void;
  onSave: () => void;
  onFieldChange: (field: keyof EditProfileFields, value: string) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  show,
  fields,
  isSaving,
  errorMessage,
  onClose,
  onSave,
  onFieldChange,
}) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Edit Profile</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {errorMessage ? <Alert variant="danger">{errorMessage}</Alert> : null}

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={fields.username}
            onChange={(event) => onFieldChange('username', event.target.value)}
            placeholder="Enter your new username"
            required
          />
        </Form.Group>

        <Form.Group>
          {/* TODO: Replace URL input with uploaded photo selection. */}
          <Form.Label>Profile Picture URL</Form.Label>
          <Form.Control
            type="url"
            value={fields.profilePicture}
            onChange={(event) =>
              onFieldChange('profilePicture', event.target.value)
            }
            placeholder="https://example.com/photo.jpg"
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button
        variant="light"
        onClick={onClose}
        disabled={isSaving}
        className="edit-profile-cancel-button"
      >
        Cancel
      </Button>
      <Button
        variant="light"
        onClick={onSave}
        disabled={isSaving}
        className="edit-profile-save-button"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default EditProfileModal;
