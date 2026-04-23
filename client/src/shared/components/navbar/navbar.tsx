import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { userApi } from '../../../api/user';
import type { UserProfile } from '../../types/user.model';
import {
  getStoredAccessToken,
  getUserIdFromToken,
} from '../../utils/authToken';

const DEFAULT_PROFILE_PICTURE = '/public/photos/default-profile-picture.jpg';

const NavigationBar: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getStoredAccessToken();
        if (!token) return;

        const userId = getUserIdFromToken(token);
        if (!userId) return;

        const userData = await userApi.getUser(userId);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching navbar user data:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <Navbar
      bg="light-blue"
      variant="dark"
      expand="lg"
      sticky="top"
      className="shadow-sm"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          📚 BookMarket
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="text-white">
              Feed
            </Nav.Link>
            <Nav.Link as={Link} to="/upload" className="text-white">
              Sell a Book
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/profile"
              className="text-white d-flex align-items-center gap-2"
            >
              My Profile
              {user?.profilePicture && (
                <img
                  src={user.profilePicture || DEFAULT_PROFILE_PICTURE}
                  alt={user.username}
                  className="rounded-circle"
                  style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                  onError={(event) => {
                    const image = event.currentTarget;
                    if (image.src.includes(DEFAULT_PROFILE_PICTURE)) {
                      image.onerror = null;
                      return;
                    }
                    image.onerror = null;
                    image.src = DEFAULT_PROFILE_PICTURE;
                  }}
                />
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
