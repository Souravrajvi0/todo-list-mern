import { Navigate, Route, Routes } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Search from './pages/Search';

function RequireOnboard({ children }) {
  const done = localStorage.getItem('todo_onboarded') === '1';
  if (!done) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="app-shell">
      <TaskProvider>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route
            path="/home"
            element={
              <RequireOnboard>
                <Home />
              </RequireOnboard>
            }
          />
          <Route
            path="/search"
            element={
              <RequireOnboard>
                <Search />
              </RequireOnboard>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TaskProvider>
    </div>
  );
}
