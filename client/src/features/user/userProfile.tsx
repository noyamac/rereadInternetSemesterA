import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { booksApi } from '../../api/books';
import { userApi } from '../../api/user';
import { useAuth } from '../../hooks/useAuth';
import Book from '../../shared/components/book/book';
import type { BookPost } from '../../shared/types/book.model';
import type { UserProfile } from '../../shared/types/user.model';
import {
  getStoredAccessToken,
  getUserIdFromToken,
} from '../../shared/utils/authToken';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userBooks, setUserBooks] = useState<BookPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);

      try {
        setLoadError('');

        const token = getStoredAccessToken();
        if (!token) {
          setLoadError('You are not logged in. Please sign in again.');
          setIsLoading(false);
          return;
        }

        const userId = getUserIdFromToken(token);
        if (!userId) {
          setLoadError('Invalid login session. Please sign in again.');
          setIsLoading(false);
          return;
        }

        const [userData, booksData] = await Promise.all([
          userApi.getUser(userId),
          booksApi.getUserBooks(userId),
        ]);

        setUser(userData);
        setUserBooks(booksData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setLoadError('Failed to load profile data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const likeBook = async (bookId: string) => {
    try {
      await booksApi.likeBook(bookId);

      setUserBooks((prevBooks) =>
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

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
      navigate('/welcome', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '60vh' }}
      >
        <Spinner animation="border" variant="purple" />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-5">
        <div className="text-center p-5 bg-white rounded-4 shadow-sm text-danger">
          <h5>{loadError || 'Profile is unavailable right now.'}</h5>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="border-0 shadow-sm mb-5 rounded-4 overflow-hidden">
        <div className="bg-purple" style={{ height: '120px' }}></div>
        <Card.Body className="px-5 pb-5 position-relative">
          <img
            src={user.profilePicture}
            alt={user.username}
            className="rounded-circle border border-4 border-white shadow-sm mb-3"
            style={{
              width: '100px',
              height: '100px',
              marginTop: '-65px',
              objectFit: 'cover',
              backgroundColor: 'white',
            }}
          />
          <Row>
            <Col md={8}>
              <h2 className="fw-bold mb-1">{user.username}</h2>
              <p className="text-muted mb-2">{user.email}</p>
              <Badge bg="purple" className="px-3 py-2 rounded-pill text-white">
                {userBooks.length} Active Listings
              </Badge>
            </Col>
            <Col
              md={4}
              className="d-flex flex-column align-items-center align-items-md-end mt-3 mt-md-0 gap-3"
            >
              <Button
                variant="outline-primary"
                className="rounded-pill px-4"
                style={{ minWidth: '150px' }}
              >
                Edit Profile
              </Button>
              <Button
                variant="outline-danger"
                className="rounded-pill px-4"
                onClick={handleLogout}
                disabled={isLoggingOut}
                style={{ minWidth: '150px' }}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <h4 className="fw-bold mb-4">My Listings</h4>

      {userBooks.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4">
          {userBooks.map((book) => (
            <Col key={book._id}>
              <Book book={book} onLike={likeBook} />
            </Col>
          ))}
        </Row>
      ) : (
        <div
          className="text-center p-5 bg-white rounded-4 shadow-sm text-muted"
          style={{ marginTop: '100px' }}
        >
          <h5>You haven't posted any books yet.</h5>
          <Button variant="purple" className="mt-3 rounded-pill text-white">
            Upload Your First Book
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Profile;
