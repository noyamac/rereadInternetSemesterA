import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { booksApi } from '../../api/books';
import type { BookComment } from '../../shared/types/book.model';

const CommentsPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [comments, setComments] = useState<BookComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getCommentUsername = (comment: BookComment) => {
    return comment.username || comment.userId;
  };

  useEffect(() => {
    if (!bookId) return;

    const loadComments = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const data = await booksApi.commentsByBook(bookId);
        setComments(data);
      } catch (error) {
        console.error('Error loading comments:', error);
        setErrorMessage('Failed to load comments.');
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [bookId]);

  const addComment = async () => {
    if (!bookId) return;

    const content = newComment.trim();
    if (!content) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const created = await booksApi.createComment(bookId, content);
      setComments((prev) => [...prev, created]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setErrorMessage('Failed to add comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Comments</h2>
            <Link to="/" className="btn btn-outline-secondary btn-sm">
              Back to feed
            </Link>
          </div>

          <Card className="shadow-sm border-2 mb-4">
            <Card.Body>
              <Form.Group>
                <Form.Label className="fw-bold">Add a comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Write your comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex justify-content-end mt-3">
                <Button
                  variant="light-blue"
                  disabled={isSubmitting || !newComment.trim()}
                  onClick={addComment}
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </Card.Body>
          </Card>

          {errorMessage ? <Alert variant="danger">{errorMessage}</Alert> : null}

          {isLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : comments.length === 0 ? (
            <Card className="border-2">
              <Card.Body className="text-muted text-center py-4">
                No comments yet. Be the first to add one.
              </Card.Body>
            </Card>
          ) : (
            comments.map((comment) => (
              <Card key={comment._id} className="shadow-sm border-2 mb-3">
                <Card.Body>
                  <div className="fw-semibold mb-1">
                    {getCommentUsername(comment)}
                  </div>
                  <p className="mb-2">{comment.content}</p>
                  <small className="text-muted">
                    {new Date(comment.date).toLocaleString()}
                  </small>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CommentsPage;
