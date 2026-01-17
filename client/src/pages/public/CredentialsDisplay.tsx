import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Shield, AlertTriangle, Copy, Check } from 'lucide-react';

interface LocationState {
    caseId: string;
    password: string;
}

export default function CredentialsDisplay() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState | null;

    const [copiedCaseId, setCopiedCaseId] = useState(false);
    const [copiedPassword, setCopiedPassword] = useState(false);

    useEffect(() => {
        // Redirect if no credentials in state
        if (!state?.caseId || !state?.password) {
            navigate('/');
        }
    }, [state, navigate]);

    const copyToClipboard = async (text: string, type: 'caseId' | 'password') => {
        await navigator.clipboard.writeText(text);
        if (type === 'caseId') {
            setCopiedCaseId(true);
            setTimeout(() => setCopiedCaseId(false), 2000);
        } else {
            setCopiedPassword(true);
            setTimeout(() => setCopiedPassword(false), 2000);
        }
    };

    if (!state?.caseId || !state?.password) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <Shield className="w-8 h-8 text-primary-700" />
                        <span className="text-xl font-semibold text-primary-700">OpenWhistle</span>
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-2xl mx-auto px-6 py-12">
                <div className="card">
                    {/* Success message */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-primary-700 mb-2">
                            Hinweis erfolgreich übermittelt
                        </h1>
                        <p className="text-gray-600">
                            Ihr Hinweis wurde entgegengenommen. Bitte speichern Sie Ihre Zugangsdaten.
                        </p>
                    </div>

                    {/* Warning */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-amber-800">
                                    Wichtig: Zugangsdaten sichern
                                </h3>
                                <p className="text-amber-700 text-sm mt-1">
                                    Sie benötigen Ihren Zugriffsschlüssel und Ihre Sicherheits-PIN, um den Status
                                    Ihres Hinweises abzurufen und mit der Meldestelle zu kommunizieren.
                                    <strong> Diese Zugangsdaten können nicht wiederhergestellt werden.</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Credentials */}
                    <div className="space-y-4">
                        {/* Case ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Zugriffsschlüssel
                            </label>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 bg-gray-100 px-4 py-3 rounded-lg font-mono text-lg">
                                    {state.caseId}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(state.caseId, 'caseId')}
                                    className="btn-secondary px-4 py-3"
                                >
                                    {copiedCaseId ? (
                                        <Check className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <Copy className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sicherheits-PIN
                            </label>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 bg-gray-100 px-4 py-3 rounded-lg font-mono text-lg">
                                    {state.password}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(state.password, 'password')}
                                    className="btn-secondary px-4 py-3"
                                >
                                    {copiedPassword ? (
                                        <Check className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <Copy className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Link to="/login" className="btn-primary flex-1 text-center">
                            Zum Postfach
                        </Link>
                        <Link to="/" className="btn-secondary flex-1 text-center">
                            Zur Startseite
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
