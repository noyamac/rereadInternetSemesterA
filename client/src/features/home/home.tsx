import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from 'react-bootstrap';
import { booksApi } from '../../api/books';
import Book from '../../shared/components/book/book';
import type { BookPost } from '../../shared/types/book.model';

const Home: React.FC = () => {
  const [serachInput, setSearchInput] = useState<string>('');
  const [books, setBooks] = useState<BookPost[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [regularLoading, setRegularLoading] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);

  const loadBooks = async (pageNum: number = 1) => {
    setLoading(true);
    setIsSearchMode(false);
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

  const handleRegularSearch = async () => {
    if (!serachInput.trim()) return;

    setRegularLoading(true);
    setIsSearchMode(true);
    setHasMore(false);

    try {
      const searchResults = await booksApi.regularSearch(serachInput);
      setBooks(searchResults);
    } catch (error) {
      console.error('Regular Search failed:', error);
    } finally {
      setRegularLoading(false);
    }
  };

  const handleAiSearch = async () => {
    if (!serachInput.trim()) return;

    setAiLoading(true);
    setIsSearchMode(true);
    setHasMore(false);

    try {
      const aiResults = await booksApi.aiSearch(serachInput);
      setBooks(aiResults);
    } catch (error) {
      console.error('AI Search failed:', error);
    } finally {
      setAiLoading(false);
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

  return (
    <>
      <Container className="py-5">
        <Row className="justify-content-center mb-5">
          <Col md={8}>
            <InputGroup size="lg">
              <Form.Control
                type="text"
                placeholder="Search by title, author, or keywords..."
                value={serachInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button
                variant="outline-primary"
                onClick={handleRegularSearch}
                disabled={regularLoading}
              >
                {regularLoading ? <Spinner size="sm" /> : 'Search'}
              </Button>
              <Button
                variant="outline-primary"
                onClick={handleAiSearch}
                disabled={aiLoading}
              >
                {aiLoading ? <Spinner size="sm" /> : '✨ AI Search'}
              </Button>
              {isSearchMode && (
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchInput('');
                    setPage(1);
                    loadBooks(1);
                  }}
                >
                  Reset
                </Button>
              )}
            </InputGroup>
            <Form.Text className="text-muted ms-2">
              Search the database or use ✨ AI Search for smarter results.
            </Form.Text>
          </Col>
        </Row>

        {books.length > 0 ? (
          <Row xs={1} md={2} lg={4} className="g-4">
            {books.map((book) => (
              <Col key={book._id}>
                <Book book={book} onLike={likeBook} />
              </Col>
            ))}
          </Row>
        ) : isSearchMode ? (
          <Row className="justify-content-center">
            <Col xs={12} className="text-center py-5">
              <p className="text-muted fs-5">
                No books found matching your search. Try adjusting your search
                terms.
              </p>
            </Col>
          </Row>
        ) : null}

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
