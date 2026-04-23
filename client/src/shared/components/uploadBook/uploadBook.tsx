import React, { useEffect, useState } from 'react';
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
import { fileApi } from '../../../api/file';
import type { BookCreatePayload } from '../../types/book.model';

const UploadBook: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    description: '',
    summary: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage('');
    setIsSubmitting(true);

    let uploadedImageUrl: string | undefined;

    try {
      if (imageFile) {
        const uploadResponse = await fileApi.uploadImage(imageFile);
        uploadedImageUrl = uploadResponse.url;
      }

    const payload: BookCreatePayload = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      summary: formData.summary.trim(),
      imageUrl: uploadedImageUrl,
      date: new Date().toISOString(),
    };

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
                    <Form.Label className="fw-bold">Book Image</Form.Label>
                    <Form.Control
                      type="file"
                      name="imageFile"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <Form.Text className="text-muted"></Form.Text>
                    {imagePreviewUrl ? (
                      <div className="mt-3">
                        <img
                          src={imagePreviewUrl}
                          alt="Selected preview"
                          style={{
                            width: '100%',
                            maxHeight: 220,
                            objectFit: 'cover',
                            borderRadius: 8,
                            border: '1px solid #dee2e6',
                          }}
                        />
                      </div>
                    ) : null}
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Detailed Summary *</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="summary"
                    rows={4}
                    placeholder="What is this book about?"
                    value={formData.summary}
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
