import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export default function Imprint() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2 -ml-2">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Shield className="w-8 h-8 text-primary-700" />
                        <span className="text-xl font-semibold text-primary-700">OpenWhistle</span>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-3xl mx-auto px-6 py-12">
                <div className="card">
                    <h1 className="text-3xl font-bold text-primary-700 mb-8">Impressum</h1>

                    <div className="prose prose-gray max-w-none">
                        <h2 className="text-xl font-semibold text-gray-900 mt-0">Angaben gemäß § 5 TMG</h2>
                        <p className="text-gray-700">
                            [FIRMENNAME]<br />
                            [RECHTSFORM]<br />
                            [STRAßE UND HAUSNUMMER]<br />
                            [PLZ] [ORT], Deutschland
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8">Vertreten durch</h2>
                        <p className="text-gray-700">
                            [GESCHÄFTSFÜHRER/VORSTAND]
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8">Kontakt</h2>
                        <p className="text-gray-700">
                            Telefon: [TELEFONNUMMER]<br />
                            E-Mail: [E-MAIL-ADRESSE]
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8">Registereintrag</h2>
                        <p className="text-gray-700">
                            Eintragung im Handelsregister.<br />
                            Registergericht: [REGISTERGERICHT]<br />
                            Registernummer: [REGISTERNUMMER]
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8">Umsatzsteuer-ID</h2>
                        <p className="text-gray-700">
                            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                            [UST-IDNR]
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
                        <p className="text-gray-700">
                            [NAME DES VERANTWORTLICHEN]<br />
                            [STRAßE UND HAUSNUMMER]<br />
                            [PLZ] [ORT]
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8">Streitschlichtung</h2>
                        <p className="text-gray-700">
                            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                            <a href="https://ec.europa.eu/consumers/odr" className="text-primary-700 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                                https://ec.europa.eu/consumers/odr
                            </a>
                        </p>
                        <p className="text-gray-700">
                            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                            Verbraucherschlichtungsstelle teilzunehmen.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8">Haftung für Inhalte</h2>
                        <p className="text-gray-700">
                            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
                            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
                            jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen
                            oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                        </p>
                        <p className="text-gray-700">
                            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen
                            Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt
                            der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
                            Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-6">
                <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
                    <Link to="/privacy" className="hover:text-primary-700">Datenschutz</Link>
                    <span className="mx-2">|</span>
                    <Link to="/" className="hover:text-primary-700">Zurück zur Startseite</Link>
                </div>
            </footer>
        </div>
    );
}
