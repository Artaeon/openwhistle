import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowLeft, Copy, Check, Users } from 'lucide-react';

export default function EmployeeInfo() {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        if (!token || userType !== 'admin') {
            navigate('/admin');
        }
    }, [navigate]);

    const employeeText = `Liebe Mitarbeitende,

wir haben eine interne Meldestelle gemäß dem Hinweisgeberschutzgesetz (HinSchG) eingerichtet. Diese ermöglicht es Ihnen, Verstöße gegen Rechtsvorschriften oder ethische Richtlinien sicher und vertraulich zu melden.

Sie erreichen die Meldestelle unter:
[URL IHRER MELDESTELLE]

Wie funktioniert es?
1. Besuchen Sie die oben genannte Website
2. Klicken Sie auf "Hinweis abgeben"
3. Beschreiben Sie den Sachverhalt (bei Bedarf können Sie Dokumente beifügen)
4. Notieren Sie sich den Zugriffsschlüssel und die Sicherheits-PIN, um später Nachrichten abzurufen

Ihre Anonymität ist gewährleistet. Es werden keine IP-Adressen oder andere identifizierende Daten gespeichert.

Bei Fragen zur Nutzung der Meldestelle wenden Sie sich bitte an die Geschäftsführung.

Mit freundlichen Grüßen
Die Geschäftsführung`;

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(employeeText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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
                            <span className="font-semibold">Mitarbeiter-Info</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary-700" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-primary-700">Mitarbeiter-Kommunikation</h1>
                            <p className="text-gray-600">Vorlage zur Information Ihrer Belegschaft</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h2 className="font-semibold text-gray-900 mb-4">So nutzen Sie diese Vorlage:</h2>
                        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                            <li>Kopieren Sie den untenstehenden Text</li>
                            <li>Ersetzen Sie <code className="bg-gray-200 px-1 rounded">[URL IHRER MELDESTELLE]</code> durch Ihre tatsächliche URL</li>
                            <li>Versenden Sie die Information an Ihre Mitarbeiter per E-Mail oder Intranet</li>
                            <li>Optional: Hängen Sie die Information im Betrieb aus</li>
                        </ol>
                    </div>

                    <div className="border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
                            <span className="text-sm font-medium text-gray-700">Vorlage: Mitarbeiterinformation</span>
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 text-sm text-primary-700 hover:bg-gray-200 px-3 py-1 rounded"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 text-green-600" />
                                        <span className="text-green-600">Kopiert!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Text kopieren
                                    </>
                                )}
                            </button>
                        </div>
                        <pre className="p-4 text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed overflow-x-auto">
                            {employeeText}
                        </pre>
                    </div>

                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-800 mb-2">💡 Tipp</h3>
                        <p className="text-blue-700 text-sm">
                            Gemäß HinSchG § 13 müssen Beschäftigte über das Bestehen der internen Meldestelle
                            sowie über die Verfahren für externe Meldungen informiert werden. Diese Information
                            sollte leicht zugänglich und verständlich sein.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
