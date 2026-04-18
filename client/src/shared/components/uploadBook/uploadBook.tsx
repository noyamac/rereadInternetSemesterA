import React, { useState } from 'react';
import type { AxiosError } from 'axios';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  InputGroup,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { booksApi } from '../../../api/books';
import type { BookCreatePayload } from '../../types/book.model';

const UploadBook: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    description: '',
    summery: '',
    imageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage('');
    setIsSubmitting(true);

    const payload: BookCreatePayload = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      summery: formData.summery.trim(),
      imageUrl: formData.imageUrl.trim() || undefined,
      date: new Date().toISOString(),
    };

    try {
      await booksApi.createBook(payload);
      navigate('/');
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      setErrorMessage(
        axiosError.response?.data?.error || 'Failed to upload book.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-2">
            <Card.Header className="bg-white border-0 pt-4 text-center">
              <h2 className="fw-bold">Sell Your Book</h2>
              <p className="text-muted">
                Fill out the details to reach potential buyers
              </p>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <p className="text-muted small mb-3">* Required fields</p>

                {errorMessage ? (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                ) : null}

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Book Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Enter book title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Author *</Form.Label>
                  <Form.Control
                    type="text"
                    name="author"
                    placeholder="Enter author name"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label className="fw-bold">Price *</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        type="number"
                        name="price"
                        placeholder="0.00"
                        min={0}
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-bold">Image URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="imageUrl"
                      placeholder="Temporary image URL"
                      value={formData.imageUrl}
                      onChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                      {/* TODO: replace this temporary URL field with real image upload */}
                    </Form.Text>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Detailed Summery *</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="summery"
                    rows={4}
                    placeholder="What is this book about?"
                    value={formData.summery}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    rows={3}
                    placeholder="Describe the book's condition"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button
                  variant="light-blue"
                  type="submit"
                  className="w-100 py-2 fw-bold shadow-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Listing Book...' : 'List Book for Sale'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UploadBook;
