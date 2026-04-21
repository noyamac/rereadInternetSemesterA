import React from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';

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
            placeholder="Enter your username"
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
        style={{ borderColor: '#87B6BC', color: '#4d7f86' }}
      >
        Cancel
      </Button>
      <Button
        variant="light"
        onClick={onSave}
        disabled={isSaving}
        style={{
          backgroundColor: '#87B6BC',
          borderColor: '#87B6BC',
          color: '#ffffff',
        }}
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default EditProfileModal;
