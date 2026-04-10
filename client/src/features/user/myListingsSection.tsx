import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Book from '../../shared/components/book/book';
import type { BookPost } from '../../shared/types/book.model';

interface MyListingsSectionProps {
  books: BookPost[];
  deletingBookId: string | null;
  onRemoveBook: (bookId: string) => void;
  onEditBook: (book: BookPost) => void;
}

const MyListingsSection: React.FC<MyListingsSectionProps> = ({
  books,
  deletingBookId,
  onRemoveBook,
  onEditBook,
}) => {
  return (
    <>
      <h4 className="fw-bold mb-4">My Listings</h4>

      {books.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4">
          {books.map((book) => (
            <Col key={book._id} className="d-flex flex-column">
              <Book
                book={book}
                onLike={() => {}}
                onRemove={onRemoveBook}
                onEdit={onEditBook}
                isRemoving={deletingBookId === book._id}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center p-5 bg-white rounded-4 shadow-sm text-muted">
          <h5>You haven't posted any books yet.</h5>
          <Button variant="purple" className="mt-3 rounded-pill text-white">
            Upload Your First Book
          </Button>
        </div>
      )}
    </>
  );
};

export default MyListingsSection;
