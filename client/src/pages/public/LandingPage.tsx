import { Link } from 'react-router-dom';
import { Shield, Lock, MessageSquare, FileCheck } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="w-8 h-8 text-primary-700" />
                        <span className="text-xl font-semibold text-primary-700">OpenWhistle</span>
                    </div>
                    <nav className="flex items-center gap-4">
                        <Link to="/login" className="text-gray-600 hover:text-primary-700 font-medium">
                            Postfach abrufen
                        </Link>
                        <Link to="/admin" className="text-gray-600 hover:text-primary-700 font-medium">
                            Administration
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-6 py-24">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-5xl font-bold text-primary-700 mb-6">
                        Interne Meldestelle
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                        Melden Sie Missstände sicher und vertraulich. Ihre Identität wird geschützt
                        und Ihre Meldung wird gemäß den gesetzlichen Vorgaben des Hinweisgeberschutzgesetzes (HinSchG) bearbeitet.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link to="/submit" className="btn-primary text-lg px-8 py-4">
                            Hinweis abgeben
                        </Link>
                        <Link to="/login" className="btn-outline text-lg px-8 py-4">
                            Postfach abrufen
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-primary-700 mb-16">
                        So funktioniert es
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="card text-center">
                            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FileCheck className="w-7 h-7 text-primary-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                1. Hinweis abgeben
                            </h3>
                            <p className="text-gray-600">
                                Beschreiben Sie den Sachverhalt und fügen Sie bei Bedarf
                                Dokumente hinzu. Keine persönlichen Daten erforderlich.
                            </p>
                        </div>

                        <div className="card text-center">
                            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Lock className="w-7 h-7 text-primary-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                2. Zugangsdaten speichern
                            </h3>
                            <p className="text-gray-600">
                                Sie erhalten einen Zugriffsschlüssel und eine Sicherheits-PIN.
                                Bewahren Sie diese sicher auf, um Ihr Postfach abzurufen.
                            </p>
                        </div>

                        <div className="card text-center">
                            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MessageSquare className="w-7 h-7 text-primary-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                3. Sicher kommunizieren
                            </h3>
                            <p className="text-gray-600">
                                Nutzen Sie Ihre Zugangsdaten, um anonym mit unserer
                                Meldestelle zu kommunizieren.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <Shield className="w-16 h-16 text-accent-600 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-primary-700 mb-6">
                            Ihre Vertraulichkeit ist uns wichtig
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Dieses System wurde mit Fokus auf Datenschutz entwickelt. Wir protokollieren
                            keine IP-Adressen, verwenden keine Tracking-Cookies und alle Kommunikation
                            erfolgt verschlüsselt. Ihre Anonymität ist gewährleistet.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                            <span className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Verschlüsselte Kommunikation
                            </span>
                            <span className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Keine IP-Protokollierung
                            </span>
                            <span className="flex items-center gap-2">
                                <FileCheck className="w-4 h-4" />
                                HinSchG-konform
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-8">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} Interne Meldestelle. Alle Rechte vorbehalten.
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                            <Link to="/imprint" className="text-gray-500 hover:text-primary-700">
                                Impressum
                            </Link>
                            <Link to="/privacy" className="text-gray-500 hover:text-primary-700">
                                Datenschutz
                            </Link>
                        </div>
                    </div>
                    <p className="text-center text-gray-400 text-xs mt-4">
                        Dieses Hinweisgebersystem entspricht den Anforderungen der EU-Richtlinie 2019/1937 und des Hinweisgeberschutzgesetzes (HinSchG).
                    </p>
                </div>
            </footer>
        </div>
    );
}
