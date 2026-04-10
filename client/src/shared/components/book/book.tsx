import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, Dropdown } from 'react-bootstrap';
import type { BookPost } from '../../types/book.model';
import './book.css';

interface BookProps {
  book: BookPost;
  onLike: (bookId: string) => void;
  onRemove?: (bookId: string) => void;
  onEdit?: (book: BookPost) => void;
  isRemoving?: boolean;
}

const Book: React.FC<BookProps> = ({
  book,
  onLike,
  onRemove,
  onEdit,
  isRemoving = false,
}) => {
  const navigate = useNavigate();

  return (
    <Card className="h-100 shadow-sm border-2">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>{book.sellerUsername || book.sellerId}</span>
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
      <div className="book-img">
        <Card.Img
          variant="top"
          src={book.imageUrl}
          className="w-100 h-100"
          style={{ borderRadius: 0 }}
        />
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0" style={{ maxWidth: '70%' }}>
            {book.title} | By {book.author}
          </Card.Title>
          <Badge bg="light-green">${book.price}</Badge>
        </div>

        <Card.Subtitle className="mb-3 text-muted">
          {book.description}
        </Card.Subtitle>
        <Card.Subtitle className="mb-3">{book.summery}</Card.Subtitle>

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
            onClick={() => navigate(`/book/${book._id}/comments`)}
          >
            View Comments
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Book;
