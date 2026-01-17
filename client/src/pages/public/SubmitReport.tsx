import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Upload, X, FileText, Loader2 } from 'lucide-react';
import { submitReport, getSettings } from '../../api/client';

const CATEGORIES = [
    { value: 'Korruption', label: 'Korruption / Bestechung' },
    { value: 'Diebstahl', label: 'Diebstahl / Unterschlagung' },
    { value: 'Belästigung', label: 'Belästigung / Diskriminierung' },
    { value: 'Datenschutz', label: 'Datenschutzverstöße' },
    { value: 'Sonstiges', label: 'Sonstiges' },
];

export default function SubmitReport() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Sonstiges');
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [companyName, setCompanyName] = useState('OpenWhistle');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const result = await getSettings();
        if (result.data?.settings?.COMPANY_NAME) {
            setCompanyName(result.data.settings.COMPANY_NAME);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        setFiles(prev => [...prev, ...newFiles].slice(0, 5));
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            setError('Bitte beschreiben Sie den Sachverhalt.');
            return;
        }

        setLoading(true);
        setError('');

        const result = await submitReport(content.trim(), category, files);

        if (result.error) {
            setError(result.error);
            setLoading(false);
            return;
        }

        // Navigate to credentials page with the data
        navigate('/credentials', {
            state: {
                caseId: result.data?.credentials.caseId,
                password: result.data?.credentials.password,
            },
            replace: true,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <Shield className="w-8 h-8 text-primary-700" />
                        <span className="text-xl font-semibold text-primary-700">{companyName}</span>
                    </Link>
                </div>
            </header>

            {/* Form */}
            <main className="max-w-2xl mx-auto px-6 py-12">
                <div className="card">
                    <h1 className="text-2xl font-bold text-primary-700 mb-2">
                        Hinweis abgeben
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Beschreiben Sie den Sachverhalt so detailliert wie möglich.
                        Sie können bei Bedarf Dokumente als Nachweise beifügen.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Category dropdown */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                Worum geht es? *
                            </label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="input"
                                disabled={loading}
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Content textarea */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                Beschreibung des Sachverhalts *
                            </label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="input min-h-[200px] resize-y"
                                placeholder="Bitte beschreiben Sie, was passiert ist, wann es passiert ist, wer beteiligt war und alle weiteren relevanten Details..."
                                disabled={loading}
                            />
                        </div>

                        {/* File upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Anlagen (optional)
                            </label>
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">
                                    Klicken Sie hier, um Dateien hochzuladen
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    PDF, DOC, Bilder, Excel (max. 10 MB pro Datei, bis zu 5 Dateien)
                                </p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xls,.xlsx,.csv,.zip,.rar,.7z"
                                disabled={loading}
                            />

                            {/* File list */}
                            {files.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {files.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2"
                                        >
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm text-gray-700 truncate max-w-xs">
                                                    {file.name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    ({(file.size / 1024).toFixed(1)} KB)
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="text-gray-400 hover:text-red-500"
                                                disabled={loading}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Wird gesendet...
                                </>
                            ) : (
                                'Hinweis abgeben'
                            )}
                        </button>

                        <p className="text-sm text-gray-500 text-center">
                            Mit dem Absenden dieses Hinweises bestätigen Sie, dass die angegebenen
                            Informationen nach bestem Wissen und Gewissen korrekt sind.
                        </p>
                    </form>
                </div>
            </main>
        </div>
    );
}
