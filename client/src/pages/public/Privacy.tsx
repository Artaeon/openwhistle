import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export default function Privacy() {
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
                    <h1 className="text-3xl font-bold text-primary-700 mb-8">Datenschutzerklärung</h1>

                    <div className="prose prose-gray max-w-none">
                        <h2 className="text-xl font-semibold text-gray-900 mt-0">1. Datenschutz auf einen Blick</h2>

                        <h3 className="text-lg font-semibold text-gray-900 mt-6">Allgemeine Hinweise</h3>
                        <p className="text-gray-700">
                            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen
                            Daten passiert, wenn Sie dieses Hinweisgebersystem nutzen. Personenbezogene Daten sind alle Daten,
                            mit denen Sie persönlich identifiziert werden können.
                        </p>

                        <h3 className="text-lg font-semibold text-gray-900 mt-6">Datenerfassung auf dieser Website</h3>
                        <p className="text-gray-700">
                            <strong>Wer ist verantwortlich für die Datenerfassung?</strong><br />
                            Die Datenverarbeitung erfolgt durch den Betreiber der Meldestelle. Dessen Kontaktdaten
                            können Sie dem Impressum entnehmen.
                        </p>
                        <p className="text-gray-700">
                            <strong>Wie erfassen wir Ihre Daten?</strong><br />
                            Die Nutzung des Hinweisgebersystems ist bewusst so gestaltet, dass keine persönlichen Daten
                            erfasst werden müssen. Sie können Hinweise vollständig anonym abgeben. Sofern Sie sich
                            entscheiden, persönliche Daten in Ihrer Meldung anzugeben, geschieht dies freiwillig.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8">2. Verantwortliche Stelle</h2>
                        <p className="text-gray-700">
                            Die verantwortliche Stelle für die Datenverarbeitung ist:<br /><br />
                            [FIRMENNAME]<br />
                            [STRAßE UND HAUSNUMMER]<br />
                            [PLZ] [ORT]<br /><br />
                            Telefon: [TELEFONNUMMER]<br />
                            E-Mail: [E-MAIL-ADRESSE]
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8">3. Besondere Datenschutzanforderungen für Hinweisgebersysteme</h2>
                        <p className="text-gray-700">
                            Dieses Hinweisgebersystem wurde in Übereinstimmung mit dem Hinweisgeberschutzgesetz (HinSchG)
                            und den Anforderungen der DSGVO entwickelt. Folgende Maßnahmen werden getroffen:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li><strong>Anonymität:</strong> Die Identität von Hinweisgebern wird geschützt. Eine Meldung ist auch ohne Angabe persönlicher Daten möglich.</li>
                            <li><strong>Keine IP-Protokollierung:</strong> IP-Adressen werden nicht gespeichert.</li>
                            <li><strong>Verschlüsselung:</strong> Alle Daten werden verschlüsselt übertragen und gespeichert.</li>
                            <li><strong>Zugangsbeschränkung:</strong> Nur autorisierte Personen haben Zugriff auf die Meldungen.</li>
                            <li><strong>Keine Tracking-Cookies:</strong> Es werden keine Tracking- oder Analyse-Cookies verwendet.</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8">4. Verarbeitete Daten</h2>
                        <p className="text-gray-700">
                            Bei der Nutzung des Hinweisgebersystems werden folgende Daten verarbeitet:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Inhalt der Meldung (Sachverhaltsbeschreibung)</li>
                            <li>Hochgeladene Dateien als Nachweise</li>
                            <li>Kommunikation zwischen Hinweisgeber und Meldestelle</li>
                            <li>Technische Zugangsdaten (Zugriffsschlüssel und Sicherheits-PIN)</li>
                        </ul>
                        <p className="text-gray-700">
                            <strong>Ausdrücklich nicht erfasst werden:</strong> IP-Adressen, Browserinformationen,
                            Standortdaten oder andere Daten, die zur Identifizierung des Hinweisgebers führen könnten.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8">5. Speicherdauer</h2>
                        <p className="text-gray-700">
                            Meldungen und zugehörige Daten werden entsprechend den gesetzlichen Dokumentationspflichten
                            nach dem Hinweisgeberschutzgesetz für die Dauer von drei Jahren nach Abschluss des Verfahrens
                            gespeichert. Danach werden sie gelöscht, sofern keine darüber hinausgehenden Aufbewahrungspflichten bestehen.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8">6. Ihre Rechte</h2>
                        <p className="text-gray-700">
                            Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
                            Datenübertragbarkeit und Widerspruch. Bitte beachten Sie, dass aufgrund der Anonymität des
                            Systems eine Zuordnung von Anfragen zu bestimmten Meldungen möglicherweise nicht erfolgen kann.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8">7. Beschwerderecht bei der Aufsichtsbehörde</h2>
                        <p className="text-gray-700">
                            Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung
                            Ihrer personenbezogenen Daten zu beschweren.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8">8. Kontakt Datenschutzbeauftragter</h2>
                        <p className="text-gray-700">
                            [DATENSCHUTZBEAUFTRAGTER]<br />
                            [STRAßE UND HAUSNUMMER]<br />
                            [PLZ] [ORT]<br />
                            E-Mail: [E-MAIL-ADRESSE]
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-6">
                <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
                    <Link to="/imprint" className="hover:text-primary-700">Impressum</Link>
                    <span className="mx-2">|</span>
                    <Link to="/" className="hover:text-primary-700">Zurück zur Startseite</Link>
                </div>
            </footer>
        </div>
    );
}
