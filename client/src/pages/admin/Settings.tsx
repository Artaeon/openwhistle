import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowLeft, Save, Loader2, Settings as SettingsIcon } from 'lucide-react';
import { getSettings, updateSettings } from '../../api/client';

export default function Settings() {
    const navigate = useNavigate();

    const [companyName, setCompanyName] = useState('');
    const [welcomeText, setWelcomeText] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        if (!token || userType !== 'admin') {
            navigate('/admin');
            return;
        }

        loadSettings();
    }, [navigate]);

    const loadSettings = async () => {
        const result = await getSettings();

        if (result.error) {
            setError(result.error);
            setLoading(false);
            return;
        }

        setCompanyName(result.data?.settings?.COMPANY_NAME || '');
        setWelcomeText(result.data?.settings?.WELCOME_TEXT || '');
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        setSaving(true);
        setError('');
        setSuccess('');

        const result = await updateSettings({
            COMPANY_NAME: companyName,
            WELCOME_TEXT: welcomeText,
        });

        if (result.error) {
            setError(result.error);
            setSaving(false);
            return;
        }

        setSuccess('Einstellungen wurden gespeichert');
        setSaving(false);

        setTimeout(() => setSuccess(''), 3000);
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
                            <span className="font-semibold">Einstellungen</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-3xl mx-auto px-6 py-8">
                <div className="card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <SettingsIcon className="w-6 h-6 text-primary-700" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-primary-700">Whitelabeling</h1>
                            <p className="text-gray-600">Passen Sie die Meldestelle an Ihr Unternehmen an</p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                                Firmenname
                            </label>
                            <input
                                id="companyName"
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="input"
                                placeholder="z.B. Mustermann GmbH"
                                disabled={saving}
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Wird im Header und Impressum angezeigt
                            </p>
                        </div>

                        <div>
                            <label htmlFor="welcomeText" className="block text-sm font-medium text-gray-700 mb-2">
                                Begrüßungstext
                            </label>
                            <textarea
                                id="welcomeText"
                                value={welcomeText}
                                onChange={(e) => setWelcomeText(e.target.value)}
                                className="input min-h-[100px] resize-y"
                                placeholder="Willkommenstext für die Startseite..."
                                disabled={saving}
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Wird auf der Startseite unter dem Titel angezeigt
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Speichern...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Einstellungen speichern
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
