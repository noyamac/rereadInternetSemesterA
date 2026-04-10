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
import { booksApi } from '../../api/books';
import { userApi } from '../../api/user';
import type { BookPost } from '../../shared/types/book.model';
import type { UserProfile } from '../../shared/types/user.model';
import ConfirmDeleteModal from './confirmDeleteModal';
import EditBookModal, { type EditBookFields } from './editBookModal';
import MyListingsSection from './myListingsSection';

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userBooks, setUserBooks] = useState<BookPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState('');
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);
  const [confirmingBookId, setConfirmingBookId] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<BookPost | null>(null);
  const [editFields, setEditFields] = useState<EditBookFields>({
    title: '',
    author: '',
    price: 0,
    description: '',
    summery: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);

      try {
        //todo: change mock user id to real one from token
        const token =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQxMTkyZjU0YWMwMjQzZTMyYWY3YmQiLCJpYXQiOjE3NzU4Mzc4MTEsImV4cCI6MTc3NTg0MTQxMX0.klA_y6ORMRZ6lv8NdZqEh7X8mLk5FU99_dcMwIdSQXE';
        let userId = '69b812d44b853f46dd6910e5';

        if (token) {
          try {
            //todo: move to a function and decode with jwt library
            const payload = JSON.parse(atob(token.split('.')[1]));
            userId = payload.userId;
          } catch (error) {
            console.error('Error decoding token:', error);
          }
        }

        const [userData, booksData] = await Promise.all([
          userApi.getUser(userId),
          booksApi.getUserBooks(userId, token),
        ]);

        setToken(token);
        setUser(userData);
        setUserBooks(booksData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const removeBook = (bookId: string) => {
    if (!token || deletingBookId) return;
    setConfirmingBookId(bookId);
  };

  const openEdit = (book: BookPost) => {
    setEditingBook(book);
    setEditFields({
      title: book.title,
      author: book.author,
      price: book.price,
      description: book.description,
      summery: book.summery,
    });
  };

  const handleEditFieldChange = (
    field: keyof EditBookFields,
    value: string | number,
  ) => {
    setEditFields((currentFields) => ({ ...currentFields, [field]: value }));
  };

  const saveEdit = async () => {
    if (!editingBook || !token) return;
    setIsSaving(true);
    try {
      const updatedBook = await booksApi.updateBook(editingBook._id, token, editFields);
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
      await booksApi.deleteBook(bookId, token);
      setUserBooks((prevBooks) =>
        prevBooks.filter((book) => book._id !== bookId),
      );
    } catch (error) {
      console.error('Error deleting book:', error);
    } finally {
      setDeletingBookId(null);
    }
  };

  if (isLoading || !user) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '60vh' }}
      >
        <Spinner animation="border" variant="purple" />
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
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Button variant="outline-primary" className="rounded-pill px-4">
                Edit Profile
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <ConfirmDeleteModal
        show={!!confirmingBookId}
        title="Remove Post"
        message="Are you sure you want to remove this post?"
        confirmLabel="Yes, Remove"
        isProcessing={!!deletingBookId}
        onClose={() => setConfirmingBookId(null)}
        onConfirm={confirmRemove}
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
        onRemoveBook={removeBook}
        onEditBook={openEdit}
      />
    </Container>
  );
};

export default Profile;
