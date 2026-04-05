import type { BookPost } from '../../types/book.model';
import { Card, Button, Badge } from 'react-bootstrap';
import './book.css';

interface BookProps {
  book: BookPost;
  onLike: (bookId: string) => void;
}

const Book: React.FC<BookProps> = ({ book, onLike }) => {
  return (
    <Card className="h-100 shadow-sm border-2">
      <Card.Header>{book.sellerId}</Card.Header>
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
              variant={book.isLiked ? "danger" : "outline-danger"}
              size="sm"
              onClick={() => onLike(book._id)}
            >
              ❤️ {book.likes}
            </Button>
          </div>
          <Button variant="light-blue" className="w-100">
            Comments
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Book;
