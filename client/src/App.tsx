import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
import SubmitReport from './pages/public/SubmitReport';
import CredentialsDisplay from './pages/public/CredentialsDisplay';
import Imprint from './pages/public/Imprint';
import Privacy from './pages/public/Privacy';
import WhistleblowerLogin from './pages/whistleblower/Login';
import WhistleblowerChat from './pages/whistleblower/Chat';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCaseDetail from './pages/admin/CaseDetail';
import EmployeeInfo from './pages/admin/EmployeeInfo';
import UserManagement from './pages/admin/UserManagement';
import Settings from './pages/admin/Settings';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/submit" element={<SubmitReport />} />
                <Route path="/credentials" element={<CredentialsDisplay />} />
                <Route path="/imprint" element={<Imprint />} />
                <Route path="/privacy" element={<Privacy />} />

                {/* Whistleblower routes */}
                <Route path="/login" element={<WhistleblowerLogin />} />
                <Route path="/inbox" element={<WhistleblowerChat />} />

                {/* Admin routes */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/case/:id" element={<AdminCaseDetail />} />
                <Route path="/admin/employee-info" element={<EmployeeInfo />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/settings" element={<Settings />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
