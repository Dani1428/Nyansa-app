import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Layouts
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Datasets from './pages/Datasets';
import Languages from './pages/Languages';
import Agriculture from './pages/Agriculture';
import About from './pages/About';
import Privacy from './pages/Privacy';
import LegalNotice from './pages/LegalNotice';
import TermsOfUse from './pages/TermsOfUse';

// Admin Pages
import DashboardOverview from './pages/admin/DashboardOverview';
import DatasetsManagement from './pages/admin/DatasetsManagement';
import ProjectRequests from './pages/admin/ProjectRequests';
import LanguagesExperts from './pages/admin/LanguagesExperts';
import AdminLogin from './pages/admin/AdminLogin';
import AdminSettings from './pages/admin/AdminSettings';
import ValidationConsole from './pages/admin/ValidationConsole';
import PaymentManagement from './pages/admin/PaymentManagement';
import MissionsManagement from './pages/admin/MissionsManagement';
import AgentsManagement from './pages/admin/AgentsManagement';
import ProtectedRoute from './components/admin/ProtectedRoute';

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="app-container">
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/datasets" element={<PublicLayout><Datasets /></PublicLayout>} />
          <Route path="/languages" element={<PublicLayout><Languages /></PublicLayout>} />
          <Route path="/agriculture" element={<PublicLayout><Agriculture /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
          <Route path="/legal" element={<PublicLayout><LegalNotice /></PublicLayout>} />
          <Route path="/terms" element={<PublicLayout><TermsOfUse /></PublicLayout>} />

          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="dashboard" element={<DashboardOverview />} />
              <Route path="datasets" element={<DatasetsManagement />} />
              <Route path="projects" element={<ProjectRequests />} />
              <Route path="languages" element={<LanguagesExperts />} />
              <Route path="validation" element={<ValidationConsole />} />
              <Route path="missions" element={<MissionsManagement />} />
              <Route path="agents" element={<AgentsManagement />} />
              <Route path="payments" element={<PaymentManagement />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
