import { useMemo, useState } from 'react';
import type { AxiosError } from 'axios';
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { fileApi } from '../../api/file';
import { storeTokens } from '../../shared/utils/authToken';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

const MIN_PASSWORD_LENGTH = 6;

type AuthMode = 'login' | 'register';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isDuplicateEmailError = (details: unknown): boolean => {
  const detailsText = JSON.stringify(details || {});
  return (
    detailsText.includes('E11000') &&
    (detailsText.includes('email_1') || detailsText.includes('email'))
  );
};

const isDuplicateUsernameError = (details: unknown): boolean => {
  const detailsText = JSON.stringify(details || {});
  return (
    detailsText.includes('E11000') &&
    (detailsText.includes('username_1') || detailsText.includes('username'))
  );
};

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null,
  );
  const [profilePicturePreview, setProfilePicturePreview] = useState('');

  const isRegister = mode === 'register';

  const validationMessage = useMemo(() => {
    if (isRegister && !username.trim()) {
      return 'Username is required.';
    }
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    return '';
  }, [email, isRegister, password.length, username]);

  const switchMode = () => {
    setMode((currentMode) => (currentMode === 'login' ? 'register' : 'login'));
    setErrorMessage('');
    setProfilePictureFile(null);
    setProfilePicturePreview('');
  };

  const handleProfilePictureChange = (file: File | null) => {
    if (profilePicturePreview) URL.revokeObjectURL(profilePicturePreview);
    if (!file) {
      setProfilePictureFile(null);
      setProfilePicturePreview('');
      return;
    }
    setProfilePictureFile(file);
    setProfilePicturePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const message = validationMessage;
    if (message) {
      setErrorMessage(message);
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (isRegister) {
        let profilePictureUrl: string | undefined;
        if (profilePictureFile) {
          const uploaded = await fileApi.uploadImage(profilePictureFile);
          profilePictureUrl = uploaded.url;
        }
        const response = await authApi.register({
          username: username.trim(),
          email: email.trim(),
          password,
          profilePicture: profilePictureUrl,
        });
        storeTokens(response.tokens);
      } else {
        const response = await authApi.login({
          email: email.trim(),
          password,
        });
        storeTokens(response.tokens);
      }

      window.dispatchEvent(new Event('auth-changed'));
      navigate('/', { replace: true });
    } catch (error) {
      const axiosError = error as AxiosError<{
        error?: string;
        details?: unknown;
      }>;
      const backendErrorText = `${axiosError.response?.data?.error || ''} ${JSON.stringify(axiosError.response?.data?.details || {})}`;

      if (isRegister) {
        if (
          axiosError.response?.data?.error === 'Username is already taken' ||
          isDuplicateUsernameError(axiosError.response?.data?.details) ||
          (backendErrorText.includes('E11000') &&
            backendErrorText.includes('username'))
        ) {
          setErrorMessage(
            'This username is already taken. Please choose another username.',
          );
          return;
        }

        if (
          axiosError.response?.data?.error === 'Email is already taken' ||
          isDuplicateEmailError(axiosError.response?.data?.details) ||
          (backendErrorText.includes('E11000') &&
            backendErrorText.includes('email'))
        ) {
          setErrorMessage(
            'This email is already taken. Please use another email.',
          );
          return;
        }
      }

      setErrorMessage(
        axiosError.response?.data?.error ||
          (isRegister ? 'Failed to register.' : 'Failed to login.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await authApi.googleLogin(
        credentialResponse.credential!,
      );
      storeTokens(response.tokens);
      window.dispatchEvent(new Event('auth-changed'));
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Google login error:', error);
      setErrorMessage('Google login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLoginError = () => {
    setErrorMessage('Google login failed. Please try again.');
  };

  return (
    <>
      <style>{`
        .toggle-auth-button {
          background-color: #fff !important;
          color: #304355 !important;
          border: 1px solid #304355 !important;
          border-radius: 0.375rem !important;
          font-weight: 500;
          transition: background-color 0.2s, color 0.2s, border-color 0.2s;
          box-shadow: none !important;
        }
        .toggle-auth-button:hover:not(:disabled) {
          background-color: #bed9f4 !important;
          color: #304355 !important;
          border-color: #304355 !important;
        }
      `}</style>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <Card className="shadow-sm border-2">
              <Card.Header className="bg-white border-0 pt-4 text-center">
                <h1 className="fw-bold mb-2" style={{ fontSize: '2.5rem' }}>
                  ReRead
                </h1>
                <p className="text-muted mb-2" style={{ fontSize: '0.95rem' }}>
                  Buy and sell used books with ease
                </p>
                <h4
                  className="fw-bold mb-0"
                  style={{ fontSize: '1.4rem', color: '#304355' }}
                >
                  {isRegister ? 'Join our community!' : 'Welcome Back!'}
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  {errorMessage ? (
                    <Alert variant="danger" className="mb-3">
                      {errorMessage}
                    </Alert>
                  ) : null}

                  {isRegister ? (
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Username *</Form.Label>
                      <Form.Control
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Enter username"
                        required
                      />
                    </Form.Group>
                  ) : null}

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Email *</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter email"
                      required
                    />
                  </Form.Group>

                  <Form.Group className={isRegister ? 'mb-3' : 'mb-4'}>
                    <Form.Label className="fw-bold">Password *</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                      minLength={MIN_PASSWORD_LENGTH}
                      required
                    />
                  </Form.Group>

                  {isRegister ? (
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold">
                        Profile Picture
                      </Form.Label>
                      {profilePicturePreview && (
                        <div className="text-center mb-2">
                          <img
                            src={profilePicturePreview}
                            alt="Preview"
                            className="rounded-circle border"
                            style={{
                              width: '72px',
                              height: '72px',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                      )}
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const input = event.target as HTMLInputElement;
                          handleProfilePictureChange(input.files?.[0] || null);
                        }}
                      />
                    </Form.Group>
                  ) : null}

                  <Button
                    variant="light-blue"
                    type="submit"
                    className="w-100 py-2 fw-bold shadow-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? isRegister
                        ? 'Registering...'
                        : 'Logging in...'
                      : isRegister
                        ? 'Register'
                        : 'Login'}
                  </Button>
                </Form>

                <div className="d-flex justify-content-center mt-4 mb-4">
                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginError}
                  />
                </div>

                <div className="text-center mt-4">
                  <Button
                    className="toggle-auth-button w-100 py-2"
                    onClick={switchMode}
                    disabled={isSubmitting}
                  >
                    {isRegister
                      ? 'Already have an account? Login'
                      : "Don't have an account? Register"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AuthPage;
