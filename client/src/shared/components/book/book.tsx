import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, Dropdown, Modal } from 'react-bootstrap';
import type { BookPost } from '../../types/book.model';
import { getDefaultProfilePictureUrl } from '../../utils/profilePicture';
import './book.css';

interface BookProps {
  book: BookPost;
  onLike: (bookId: string) => void;
  onRemove?: (bookId: string) => void;
  onEdit?: (book: BookPost) => void;
  isRemoving?: boolean;
}

const DEFAULT_PROFILE_PICTURE = getDefaultProfilePictureUrl();

const Book: React.FC<BookProps> = ({
  book,
  onLike,
  onRemove,
  onEdit,
  isRemoving = false,
}) => {
  const navigate = useNavigate();
  const [showTextModal, setShowTextModal] = useState(false);

  return (
    <Card className={`shadow-sm border-2 ${book.imageUrl ? 'h-100' : ''}`}>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div className="book-seller">
          <img
            src={book.sellerProfilePicture || DEFAULT_PROFILE_PICTURE}
            alt={book.sellerUsername || 'Seller'}
            className="book-seller-avatar"
            onError={(event) => {
              const image = event.currentTarget;
              if (!image.src.includes(DEFAULT_PROFILE_PICTURE)) {
                image.onerror = null;
                image.src = DEFAULT_PROFILE_PICTURE;
              }
            }}
          />
          <span>{book.sellerUsername || book.sellerId}</span>
        </div>
        {(onRemove || onEdit) && (
          <Dropdown align="end">
            <Dropdown.Toggle
              as={Button}
              variant="link"
              size="sm"
              className="book-actions-toggle"
              style={{ fontSize: '1.25rem' }}
              disabled={isRemoving}
            >
              &#8942;
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {onEdit && (
                <Dropdown.Item onClick={() => onEdit(book)}>
                  ✏️ Edit
                </Dropdown.Item>
              )}
              {onEdit && onRemove && <Dropdown.Divider />}
              {onRemove && (
                <Dropdown.Item
                  className="text-danger"
                  onClick={() => onRemove(book._id)}
                  disabled={isRemoving}
                >
                  {isRemoving ? 'Removing...' : '🗑️ Delete'}
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Card.Header>
      {book.imageUrl && (
        <div className="book-img">
          <Card.Img
            variant="top"
            src={book.imageUrl}
            className="w-100 h-100"
            style={{ borderRadius: 0, objectFit: 'cover' }}
          />
        </div>
      )}

      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2 w-100">
          <div className="me-2" style={{ maxWidth: '75%', minWidth: 0 }}>
            <Card.Title
              className="mb-1 text-truncate"
              style={{ minWidth: 0 }}
              title={book.title}
            >
              {book.title}
            </Card.Title>
            <Card.Subtitle
              className="text-muted text-truncate"
              style={{ minWidth: 0 }}
              title={book.author}
            >
              By {book.author}
            </Card.Subtitle>
          </div>

          <Badge bg="light-green" className="flex-shrink-0 ms-2">
            ${book.price}
          </Badge>
        </div>

        <div
          style={{ cursor: 'pointer' }}
          onClick={() => setShowTextModal(true)}
          title="Click to read full description"
        >
          <Card.Subtitle
            className={`mb-3 text-muted ${book.imageUrl ? 'text-truncate-multi' : 'text-truncate-extended'}`}
          >
            {book.description}
          </Card.Subtitle>
          {book.summary && (
            <Card.Subtitle
              className={`mb-3 ${book.imageUrl ? 'text-truncate-multi' : 'text-truncate-extended'}`}
            >
              {book.summary}
            </Card.Subtitle>
          )}
        </div>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Button
              variant={book.isLiked ? 'danger' : 'outline-danger'}
              size="sm"
              onClick={() => onLike?.(book._id)}
            >
              ❤️ {book.likes}
            </Button>
            <small className="text-muted">
              Comments: {book.comments.length}
            </small>
          </div>
          <Button
            variant="light-blue"
            className="w-100"
            onClick={() => navigate(`/view/${book._id}/comments`)}
          >
            View Comments
          </Button>
        </div>
      </Card.Body>

      <Modal
        show={showTextModal}
        onHide={() => setShowTextModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{book.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 className="fw-bold">Description</h6>
          <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {book.description}
          </p>
          {book.summary && (
            <>
              <h6 className="mt-4 fw-bold">Summary</h6>
              <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {book.summary}
              </p>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default Book;
