import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Loader2 } from 'lucide-react';
import { adminLogin } from '../../api/client';

export default function AdminLogin() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setError('Bitte geben Sie Benutzername und Passwort ein.');
            return;
        }

        setLoading(true);
        setError('');

        const result = await adminLogin(username.trim(), password.trim());

        if (result.error) {
            setError(result.error);
            setLoading(false);
            return;
        }

        // Store token and navigate to dashboard
        localStorage.setItem('token', result.data!.token);
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('adminUsername', result.data!.username);

        navigate('/admin/dashboard');
    };

    return (
        <div className="min-h-screen bg-primary-700 flex flex-col">
            {/* Header */}
            <header className="px-6 py-4">
                <Link to="/" className="flex items-center gap-2 w-fit">
                    <Shield className="w-8 h-8 text-white" />
                    <span className="text-xl font-semibold text-white">OpenWhistle</span>
                </Link>
            </header>

            {/* Login Form */}
            <main className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="card max-w-md w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-primary-700 mb-2">
                            Meldestellen-Portal
                        </h1>
                        <p className="text-gray-600">
                            Anmeldung für Meldestellenbeauftragte
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Benutzername
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input"
                                placeholder="Benutzername eingeben"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Passwort
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                placeholder="Passwort eingeben"
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Anmeldung läuft...
                                </>
                            ) : (
                                'Anmelden'
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
