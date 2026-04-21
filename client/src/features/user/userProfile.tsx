import React, { useEffect, useState } from 'react';
import {
  Alert,
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
import type { BookPost } from '../../shared/types/book.model';
import type { UserProfile } from '../../shared/types/user.model';
import ConfirmDeleteModal from './confirmDeleteModal';
import EditBookModal, { type EditBookFields } from './editBookModal';
import EditProfileModal, { type EditProfileFields } from './editProfileModal';
import MyListingsSection from './myListingsSection';
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
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);
  const [confirmingBookId, setConfirmingBookId] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<BookPost | null>(null);
  const [editFields, setEditFields] = useState<EditBookFields>({
    title: '',
    author: '',
    price: 0,
    description: '',
    summary: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileFields, setProfileFields] = useState<EditProfileFields>({
    username: '',
    profilePicture: '',
  });
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
        setProfileFields({
          username: userData.username,
          profilePicture: userData.profilePicture || '',
        });
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

  const removeBook = (bookId: string) => {
    if (deletingBookId) return;
    setConfirmingBookId(bookId);
  };

  const openEdit = (book: BookPost) => {
    setEditingBook(book);
    setEditFields({
      title: book.title,
      author: book.author,
      price: book.price,
      description: book.description,
      summary: book.summary,
    });
  };

  const handleEditFieldChange = (
    field: keyof EditBookFields,
    value: string | number,
  ) => {
    setEditFields((currentFields) => ({ ...currentFields, [field]: value }));
  };

  const saveEdit = async () => {
    if (!editingBook) return;
    setIsSaving(true);
    try {
      const updatedBook = await booksApi.updateBook(
        editingBook._id,
        editFields,
      );
      setUserBooks((prevUserBooks) =>
        prevUserBooks.map((currentBook) =>
          currentBook._id === editingBook._id
            ? { ...currentBook, ...updatedBook }
            : currentBook,
        ),
      );
      setEditingBook(null);
    } catch (error) {
      console.error('Error updating book:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmRemove = async () => {
    if (!confirmingBookId) return;
    const bookId = confirmingBookId;
    setConfirmingBookId(null);
    setDeletingBookId(bookId);
    try {
      await booksApi.deleteBook(bookId);
      setUserBooks((prevBooks) =>
        prevBooks.filter((book) => book._id !== bookId),
      );
    } catch (error) {
      console.error('Error deleting book:', error);
    } finally {
      setDeletingBookId(null);
    }
  };

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

  const openEditProfile = () => {
    if (!user) return;

    setProfileError('');
    setProfileSuccess('');
    setProfileFields({
      username: user.username,
      profilePicture: user.profilePicture || '',
    });
    setIsEditingProfile(true);
  };

  const handleProfileFieldChange = (
    field: keyof EditProfileFields,
    value: string,
  ) => {
    setProfileFields((currentFields) => ({ ...currentFields, [field]: value }));
  };

  const saveProfile = async () => {
    if (!user) return;

    const trimmedUsername = profileFields.username.trim();

    if (!trimmedUsername) {
      setProfileError('Username is required.');
      return;
    }

    setProfileError('');
    setProfileSuccess('');
    setIsSavingProfile(true);

    try {
      const updatedUser = await userApi.updateUser(user._id, {
        username: trimmedUsername,
        profilePicture: profileFields.profilePicture.trim() || undefined,
      });

      setUser(updatedUser);
      setProfileFields({
        username: updatedUser.username,
        profilePicture: updatedUser.profilePicture || '',
      });
      setIsEditingProfile(false);
      setProfileSuccess('Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileError('Failed to save profile changes.');
    } finally {
      setIsSavingProfile(false);
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
                onClick={openEditProfile}
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

      {profileSuccess ? (
        <Alert
          variant="success"
          className="rounded-4 border-0 shadow-sm mb-4"
          onClose={() => setProfileSuccess('')}
          dismissible
        >
          {profileSuccess}
        </Alert>
      ) : null}

      <ConfirmDeleteModal
        show={!!confirmingBookId}
        title="Remove Post"
        message="Are you sure you want to remove this post?"
        confirmLabel="Yes, Remove"
        isProcessing={!!deletingBookId}
        onClose={() => setConfirmingBookId(null)}
        onConfirm={confirmRemove}
      />

      <EditProfileModal
        show={isEditingProfile}
        fields={profileFields}
        isSaving={isSavingProfile}
        errorMessage={profileError}
        onClose={() => setIsEditingProfile(false)}
        onSave={saveProfile}
        onFieldChange={handleProfileFieldChange}
      />

      <EditBookModal
        show={!!editingBook}
        fields={editFields}
        isSaving={isSaving}
        onClose={() => setEditingBook(null)}
        onSave={saveEdit}
        onFieldChange={handleEditFieldChange}
      />

      <MyListingsSection
        books={userBooks}
        deletingBookId={deletingBookId}
        onLikeBook={likeBook}
        onRemoveBook={removeBook}
        onEditBook={openEdit}
      />
    </Container>
  );
};

export default Profile;
