import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowLeft, Plus, Trash2, Loader2, Users } from 'lucide-react';
import { getUsers, createUser, deleteUser } from '../../api/client';

interface AdminUser {
    id: string;
    username: string;
    email: string | null;
    isSuper: boolean;
    createdAt: string;
}

export default function UserManagement() {
    const navigate = useNavigate();

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        if (!token || userType !== 'admin') {
            navigate('/admin');
            return;
        }

        loadUsers();
    }, [navigate]);

    const loadUsers = async () => {
        const result = await getUsers();

        if (result.error) {
            setError(result.error);
            setLoading(false);
            return;
        }

        setUsers(result.data!.users);
        setLoading(false);
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newUsername.trim() || !newPassword.trim()) {
            setFormError('Benutzername und Passwort sind erforderlich');
            return;
        }

        if (newPassword.length < 8) {
            setFormError('Passwort muss mindestens 8 Zeichen lang sein');
            return;
        }

        setFormLoading(true);
        setFormError('');

        const result = await createUser(newUsername.trim(), newEmail.trim() || undefined, newPassword);

        if (result.error) {
            setFormError(result.error);
            setFormLoading(false);
            return;
        }

        setUsers(prev => [...prev, result.data!.user]);
        setNewUsername('');
        setNewEmail('');
        setNewPassword('');
        setShowForm(false);
        setFormLoading(false);
    };

    const handleDeleteUser = async (id: string, username: string) => {
        if (!confirm(`Möchten Sie den Benutzer "${username}" wirklich löschen?`)) {
            return;
        }

        const result = await deleteUser(id);

        if (result.error) {
            setError(result.error);
            return;
        }

        setUsers(prev => prev.filter(u => u.id !== id));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

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
                    <div className="flex items-center gap-4">
                        <Link to="/admin/dashboard" className="hover:bg-white/10 rounded-lg p-2 -ml-2">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <Shield className="w-6 h-6" />
                            <span className="font-semibold">Benutzerverwaltung</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                <Users className="w-6 h-6 text-primary-700" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-primary-700">Administratoren</h1>
                                <p className="text-gray-600">{users.length} Benutzer registriert</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="btn-primary"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Benutzer anlegen
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                            {error}
                        </div>
                    )}

                    {/* Create User Form */}
                    {showForm && (
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Neuen Benutzer anlegen</h3>
                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Benutzername *
                                        </label>
                                        <input
                                            type="text"
                                            value={newUsername}
                                            onChange={(e) => setNewUsername(e.target.value)}
                                            className="input"
                                            placeholder="benutzername"
                                            disabled={formLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            E-Mail (für Benachrichtigungen)
                                        </label>
                                        <input
                                            type="email"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            className="input"
                                            placeholder="email@example.com"
                                            disabled={formLoading}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Passwort * (min. 8 Zeichen)
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="input"
                                        placeholder="••••••••"
                                        disabled={formLoading}
                                    />
                                </div>
                                {formError && (
                                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                                        {formError}
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="btn-primary"
                                    >
                                        {formLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        ) : null}
                                        Benutzer erstellen
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="btn-secondary"
                                    >
                                        Abbrechen
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Users List */}
                    <div className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <div key={user.id} className="flex items-center justify-between py-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">{user.username}</span>
                                        {user.isSuper && (
                                            <span className="badge bg-primary-100 text-primary-800">Hauptadmin</span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {user.email || 'Keine E-Mail'} • Erstellt: {formatDate(user.createdAt)}
                                    </div>
                                </div>
                                {!user.isSuper && (
                                    <button
                                        onClick={() => handleDeleteUser(user.id, user.username)}
                                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                                        title="Benutzer löschen"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
