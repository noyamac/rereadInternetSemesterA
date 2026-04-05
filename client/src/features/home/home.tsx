import React, { useState, useEffect } from 'react';
import { Col, Container, Form, Row, Button } from 'react-bootstrap';
import Book from '../../shared/components/book/book';
import type { BookPost } from '../../shared/types/book.model';
import { booksApi } from '../../api/books';

const Home: React.FC = () => {
  const [serachInput, setSearchInput] = useState<string>('');
  const [books, setBooks] = useState<BookPost[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadBooks = async (pageNum: number = 1) => {
    setLoading(true);
    try {
      const newBooks = await booksApi.books(pageNum, 10);
      if (newBooks.length < 10) {
        setHasMore(false);
      }
      if (pageNum === 1) {
        setBooks(newBooks);
      } else {
        setBooks((prev) => [...prev, ...newBooks]);
      }
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks(1);
  }, []);

  const loadMore = () => {
    if (loading || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    loadBooks(nextPage);
  };

  const likeBook = async (bookId: string) => {
    try {
      await booksApi.likeBook(bookId);

      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === bookId
            ? {
                ...book,
                isLiked: !book.isLiked,
                likes: book.isLiked ? book.likes - 1 : book.likes + 1,
              }
            : book,
        ),
      );
    } catch (error) {
      console.error('Error liking book:', error);
    }
  };

  const filteredBooks = books.filter((book) => {
    const searchText = serachInput.toLowerCase();
    return (
      book.title.toLowerCase().includes(searchText) ||
      book.author.toLowerCase().includes(searchText)
    );
  });

  return (
    <>
      <Container className="py-5">
        <Row className="justify-content-center mb-5">
          <Col md={6}>
            <Form.Control
              size="lg"
              type="text"
              placeholder="Search by book or author..."
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Col>
        </Row>

        <Row xs={1} md={2} lg={4} className="g-4">
          {filteredBooks.map((book) => (
            <Col key={book._id}>
              <Book book={book} onLike={likeBook} />
            </Col>
          ))}
        </Row>

        {hasMore && (
          <Row className="justify-content-center mt-4">
            <Col xs="auto">
              <Button variant="primary" onClick={loadMore} disabled={loading}>
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default Home;
