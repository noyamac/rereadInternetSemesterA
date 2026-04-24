import React from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import './editProfileModal.css';

export interface EditProfileFields {
  username: string;
}

interface EditProfileModalProps {
  show: boolean;
  fields: EditProfileFields;
  currentProfilePicture?: string;
  previewProfilePicture?: string;
  isSaving: boolean;
  errorMessage: string;
  onClose: () => void;
  onSave: () => void;
  onFileChange: (file: File | null) => void;
  onFieldChange: (field: keyof EditProfileFields, value: string) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  show,
  fields,
  currentProfilePicture,
  previewProfilePicture,
  isSaving,
  errorMessage,
  onClose,
  onSave,
  onFileChange,
  onFieldChange,
}) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Edit Profile</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {errorMessage ? <Alert variant="danger">{errorMessage}</Alert> : null}

      <Form
        id="edit-profile-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
      >
        {previewProfilePicture || currentProfilePicture ? (
          <div className="text-center mb-3">
            <img
              src={previewProfilePicture || currentProfilePicture}
              alt="Profile preview"
              className="rounded-circle border"
              style={{ width: '96px', height: '96px', objectFit: 'cover' }}
            />
          </div>
        ) : null}

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
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(event) => {
              const input = event.target as HTMLInputElement;
              onFileChange(input.files?.[0] || null);
            }}
          />
          <Form.Text className="text-muted">
            Upload a new profile photo from your computer.
          </Form.Text>
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
        variant="success"
        type="submit"
        form="edit-profile-form"
        disabled={isSaving}
        className="edit-profile-save-button"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default EditProfileModal;
