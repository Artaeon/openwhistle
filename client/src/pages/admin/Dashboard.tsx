import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, LogOut, Loader2, ChevronRight, Clock, MessageSquare, AlertTriangle, Users, Settings } from 'lucide-react';
import { getReports } from '../../api/client';

interface Report {
    id: string;
    caseId: string;
    status: 'NEW' | 'IN_PROGRESS' | 'CLOSED';
    category: string;
    receivedConfirmationSent: boolean;
    createdAt: string;
    messageCount: number;
}

export default function AdminDashboard() {
    const navigate = useNavigate();

    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        if (!token || userType !== 'admin') {
            navigate('/admin');
            return;
        }

        loadReports();
    }, [navigate]);

    const loadReports = async () => {
        const result = await getReports();

        if (result.error) {
            if (result.error === 'Invalid token') {
                handleLogout();
            } else {
                setError(result.error);
            }
            setLoading(false);
            return;
        }

        setReports(result.data!.reports);
        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('adminUsername');
        navigate('/admin');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'NEW': return 'Neu';
            case 'IN_PROGRESS': return 'In Bearbeitung';
            case 'CLOSED': return 'Abgeschlossen';
            default: return status;
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'NEW': return 'badge-new';
            case 'IN_PROGRESS': return 'badge-in-progress';
            case 'CLOSED': return 'badge-closed';
            default: return 'badge';
        }
    };

    const getDeadlineDays = (createdAt: string) => {
        const created = new Date(createdAt);
        const deadline = new Date(created.getTime() + 7 * 24 * 60 * 60 * 1000);
        const now = new Date();
        const diffMs = deadline.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
        return diffDays;
    };

    const needsConfirmation = (report: Report) => {
        return !report.receivedConfirmationSent && report.status !== 'CLOSED';
    };

    const newReportsCount = reports.filter(r => r.status === 'NEW').length;
    const urgentReports = reports.filter(r => needsConfirmation(r) && getDeadlineDays(r.createdAt) <= 3);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-700" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-primary-700 text-white">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="w-8 h-8" />
                        <span className="text-xl font-semibold">Meldestellen-Portal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/admin/settings" className="flex items-center gap-2 text-white/80 hover:text-white">
                            <Settings className="w-5 h-5" />
                            Einstellungen
                        </Link>
                        <Link to="/admin/users" className="flex items-center gap-2 text-white/80 hover:text-white">
                            <Users className="w-5 h-5" />
                            Benutzer
                        </Link>
                        <Link to="/admin/employee-info" className="flex items-center gap-2 text-white/80 hover:text-white">
                            <Users className="w-5 h-5" />
                            Mitarbeiter-Info
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-white/80 hover:text-white">
                            <LogOut className="w-5 h-5" />
                            Abmelden
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Urgent Warning */}
                {urgentReports.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-amber-800">
                                    Aktion erforderlich: {urgentReports.length} Hinweis(e) ohne Eingangsbestätigung
                                </h3>
                                <p className="text-amber-700 text-sm mt-1">
                                    Gemäß HinSchG § 17 muss die Eingangsbestätigung innerhalb von 7 Tagen nach Meldungseingang erfolgen.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    <div className="card">
                        <div className="text-sm text-gray-500 mb-1">Gesamte Hinweise</div>
                        <div className="text-3xl font-bold text-primary-700">{reports.length}</div>
                    </div>
                    <div className="card">
                        <div className="text-sm text-gray-500 mb-1">Neue Hinweise</div>
                        <div className="text-3xl font-bold text-blue-600">{newReportsCount}</div>
                    </div>
                    <div className="card">
                        <div className="text-sm text-gray-500 mb-1">In Bearbeitung</div>
                        <div className="text-3xl font-bold text-amber-600">
                            {reports.filter(r => r.status === 'IN_PROGRESS').length}
                        </div>
                    </div>
                </div>

                {/* Reports List */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Alle Hinweise</h2>

                    {error && (
                        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                            {error}
                        </div>
                    )}

                    {reports.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            Noch keine Hinweise eingegangen.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {reports.map((report) => {
                                const deadlineDays = getDeadlineDays(report.createdAt);
                                const needsAction = needsConfirmation(report);

                                return (
                                    <Link
                                        key={report.id}
                                        to={`/admin/case/${report.id}`}
                                        className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-6 px-6 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-mono font-medium text-primary-700">
                                                    {report.caseId}
                                                </span>
                                                <span className={getStatusBadgeClass(report.status)}>
                                                    {getStatusLabel(report.status)}
                                                </span>
                                                {needsAction && (
                                                    <span className={`badge ${deadlineDays <= 3 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                                        Bestätigung ausstehend
                                                        {deadlineDays > 0 ? ` (${deadlineDays} Tage)` : ' (überfällig!)'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {formatDate(report.createdAt)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageSquare className="w-4 h-4" />
                                                    {report.messageCount} Nachrichten
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
