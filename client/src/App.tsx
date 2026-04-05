import { lazy, Suspense } from 'react';
import { Spinner } from 'react-bootstrap';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import NavigationBar from './shared/components/navbar/navbar';

const HomePage = lazy(() => import('./features/home/home'));
const ProfilePage = lazy(() => import('./features/user/userProfile'));
const CommentsPage = lazy(() => import('./features/comments/commentsPage'));

function App() {
  return (
    <Router>
      <NavigationBar />

      <main className="bg-light min-vh-100">
        <Suspense
          fallback={
            <div className="d-flex justify-content-center pt-5">
              <Spinner animation="border" variant="primary" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/book/:bookId/comments" element={<CommentsPage />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}

export default App;
