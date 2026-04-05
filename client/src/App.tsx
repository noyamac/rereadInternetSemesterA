import { lazy, Suspense } from 'react';
import { Spinner } from 'react-bootstrap';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import NavigationBar from './shared/components/navbar/navbar';
import UploadBook from './shared/components/uploadBook/uploadBook';

const HomePage = lazy(() => import('./features/home/home'));
const ProfilePage = lazy(() => import('./features/user/userProfile'));

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
            <Route path="/upload" element={<UploadBook />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}

export default App;
