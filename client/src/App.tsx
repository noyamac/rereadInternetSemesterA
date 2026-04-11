import { lazy, Suspense } from 'react';
import { Spinner } from 'react-bootstrap';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import NavigationBar from './shared/components/navbar/navbar';

const HomePage = lazy(() => import('./features/home/home'));
const AuthPage = lazy(() => import('./features/auth/authPage'));
const ProfilePage = lazy(() => import('./features/user/userProfile'));
const CommentsPage = lazy(() => import('./features/comments/commentsPage'));

function App() {
  const { authState, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center pt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const isLoggedIn = authState === 'loggedIn';

  return (
    <Router>
      {isLoggedIn ? <NavigationBar /> : null}

      <main className="bg-light min-vh-100">
        <Suspense
          fallback={
            <div className="d-flex justify-content-center pt-5">
              <Spinner animation="border" variant="primary" />
            </div>
          }
        >
          <Routes>
            {isLoggedIn ? (
              <>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                  path="/view/:bookId/comments"
                  element={<CommentsPage />}
                />
                <Route path="/welcome" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route path="/welcome" element={<AuthPage />} />
                <Route path="*" element={<Navigate to="/welcome" replace />} />
              </>
            )}
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}

export default App;
