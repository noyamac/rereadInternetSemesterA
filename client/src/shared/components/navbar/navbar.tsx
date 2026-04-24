import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavigationBar: React.FC = () => {
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
            <Nav.Link as={Link} to="/profile" className="text-white">
              My Profile
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
