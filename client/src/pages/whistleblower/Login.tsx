import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Loader2 } from 'lucide-react';
import { whistleblowerLogin } from '../../api/client';

export default function WhistleblowerLogin() {
    const navigate = useNavigate();

    const [caseId, setCaseId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!caseId.trim() || !password.trim()) {
            setError('Bitte geben Sie Zugriffsschlüssel und Sicherheits-PIN ein.');
            return;
        }

        setLoading(true);
        setError('');

        const result = await whistleblowerLogin(caseId.trim(), password.trim());

        if (result.error) {
            setError(result.error);
            setLoading(false);
            return;
        }

        // Store token and navigate to inbox
        localStorage.setItem('token', result.data!.token);
        localStorage.setItem('userType', 'whistleblower');
        localStorage.setItem('caseId', result.data!.caseId);

        navigate('/inbox');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <Shield className="w-8 h-8 text-primary-700" />
                        <span className="text-xl font-semibold text-primary-700">OpenWhistle</span>
                    </Link>
                </div>
            </header>

            {/* Login Form */}
            <main className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="card max-w-md w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-primary-700 mb-2">
                            Postfach abrufen
                        </h1>
                        <p className="text-gray-600">
                            Geben Sie Ihre Zugangsdaten ein, um den Status Ihres Hinweises und Nachrichten abzurufen.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="caseId" className="block text-sm font-medium text-gray-700 mb-2">
                                Zugriffsschlüssel
                            </label>
                            <input
                                id="caseId"
                                type="text"
                                value={caseId}
                                onChange={(e) => setCaseId(e.target.value)}
                                className="input"
                                placeholder="WH-XXX-XXX"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Sicherheits-PIN
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                placeholder="Ihre Sicherheits-PIN eingeben"
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
                                'Postfach öffnen'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/submit" className="text-primary-700 hover:underline text-sm">
                            Neuen Hinweis abgeben
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
