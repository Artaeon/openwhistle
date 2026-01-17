import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowLeft, Send, Paperclip, FileText, Download, Loader2, X, CheckCircle, AlertTriangle, FileDown } from 'lucide-react';
import { getReportDetail, sendAdminMessage, updateReportStatus, sendConfirmation, getAttachmentUrl, getReportPdfUrl } from '../../api/client';

interface Message {
    id: string;
    senderType: 'WHISTLEBLOWER' | 'ADMIN';
    content: string;
    createdAt: string;
    attachments: Array<{ id: string; originalName: string }>;
}

export default function CaseDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [caseId, setCaseId] = useState('');
    const [status, setStatus] = useState<'NEW' | 'IN_PROGRESS' | 'CLOSED'>('NEW');
    const [receivedConfirmationSent, setReceivedConfirmationSent] = useState(false);
    const [createdAt, setCreatedAt] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [sendingConfirmation, setSendingConfirmation] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        if (!token || userType !== 'admin') {
            navigate('/admin');
            return;
        }

        loadReport();
    }, [id, navigate]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadReport = async () => {
        if (!id) return;

        const result = await getReportDetail(id);

        if (result.error) {
            setError(result.error);
            setLoading(false);
            return;
        }

        setCaseId(result.data!.caseId);
        setStatus(result.data!.status);
        setReceivedConfirmationSent(result.data!.receivedConfirmationSent);
        setCreatedAt(result.data!.createdAt);
        setMessages(result.data!.messages);
        setLoading(false);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() && files.length === 0) return;
        if (!id) return;

        setSending(true);

        const result = await sendAdminMessage(id, newMessage.trim(), files);

        if (result.error) {
            setError(result.error);
            setSending(false);
            return;
        }

        setMessages(prev => [...prev, result.data! as Message]);
        setNewMessage('');
        setFiles([]);
        setSending(false);

        // Update status if it was NEW
        if (status === 'NEW') {
            setStatus('IN_PROGRESS');
        }
    };

    const handleSendConfirmation = async () => {
        if (!id || receivedConfirmationSent) return;

        setSendingConfirmation(true);

        const result = await sendConfirmation(id);

        if (result.error) {
            setError(result.error);
            setSendingConfirmation(false);
            return;
        }

        setReceivedConfirmationSent(true);
        if (status === 'NEW') {
            setStatus('IN_PROGRESS');
        }
        setSendingConfirmation(false);

        // Reload to get the new message
        loadReport();
    };

    const handleStatusChange = async (newStatus: 'NEW' | 'IN_PROGRESS' | 'CLOSED') => {
        if (!id || newStatus === status) return;

        setUpdatingStatus(true);

        const result = await updateReportStatus(id, newStatus);

        if (result.error) {
            setError(result.error);
            setUpdatingStatus(false);
            return;
        }

        setStatus(newStatus);
        setUpdatingStatus(false);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('de-DE');
    };

    const getStatusLabel = (s: string) => {
        switch (s) {
            case 'NEW': return 'Neu';
            case 'IN_PROGRESS': return 'In Bearbeitung';
            case 'CLOSED': return 'Abgeschlossen';
            default: return s;
        }
    };

    const getStatusBadgeClass = (s: string) => {
        switch (s) {
            case 'NEW': return 'badge-new';
            case 'IN_PROGRESS': return 'badge-in-progress';
            case 'CLOSED': return 'badge-closed';
            default: return 'badge';
        }
    };

    const getDeadlineDays = () => {
        if (!createdAt) return 0;
        const created = new Date(createdAt);
        const deadline = new Date(created.getTime() + 7 * 24 * 60 * 60 * 1000);
        const now = new Date();
        const diffMs = deadline.getTime() - now.getTime();
        return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-700" />
            </div>
        );
    }

    const deadlineDays = getDeadlineDays();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-primary-700 text-white sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/admin/dashboard" className="hover:bg-white/10 rounded-lg p-2 -ml-2">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <Shield className="w-6 h-6" />
                            <span className="font-semibold">Vorgang: {caseId}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href={id ? getReportPdfUrl(id) : '#'}
                            className="flex items-center gap-2 text-white/80 hover:text-white text-sm"
                            download
                        >
                            <FileDown className="w-4 h-4" />
                            PDF exportieren
                        </a>
                        <span className={getStatusBadgeClass(status)}>
                            {getStatusLabel(status)}
                        </span>
                        <select
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value as 'NEW' | 'IN_PROGRESS' | 'CLOSED')}
                            disabled={updatingStatus}
                            className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1.5 text-sm"
                        >
                            <option value="NEW" className="text-gray-900">Neu</option>
                            <option value="IN_PROGRESS" className="text-gray-900">In Bearbeitung</option>
                            <option value="CLOSED" className="text-gray-900">Abgeschlossen</option>
                        </select>
                    </div>
                </div>
            </header>

            {/* Confirmation Warning */}
            {!receivedConfirmationSent && status !== 'CLOSED' && (
                <div className={`${deadlineDays <= 3 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'} border-b px-6 py-4`}>
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${deadlineDays <= 3 ? 'text-red-600' : 'text-amber-600'}`} />
                            <div>
                                <h3 className={`font-semibold ${deadlineDays <= 3 ? 'text-red-800' : 'text-amber-800'}`}>
                                    Gesetzliche Frist: Eingangsbestätigung ausstehend
                                </h3>
                                <p className={`text-sm ${deadlineDays <= 3 ? 'text-red-700' : 'text-amber-700'}`}>
                                    {deadlineDays > 0
                                        ? `Fällig in ${deadlineDays} Tag(en) (HinSchG § 17)`
                                        : 'Frist überschritten! Bitte umgehend bestätigen.'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleSendConfirmation}
                            disabled={sendingConfirmation}
                            className="btn-primary"
                        >
                            {sendingConfirmation ? (
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            ) : (
                                <CheckCircle className="w-5 h-5 mr-2" />
                            )}
                            Eingangsbestätigung senden
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Success */}
            {receivedConfirmationSent && (
                <div className="bg-green-50 border-b border-green-200 px-6 py-3">
                    <div className="max-w-6xl mx-auto flex items-center gap-2 text-green-800">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Eingangsbestätigung wurde versendet</span>
                    </div>
                </div>
            )}

            {/* Messages */}
            <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-6 overflow-y-auto">
                {error && (
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.senderType === 'ADMIN' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-lg px-4 py-3 ${message.senderType === 'ADMIN'
                                    ? 'bg-primary-700 text-white'
                                    : 'bg-white border border-gray-200'
                                    }`}
                            >
                                <div className="text-sm opacity-75 mb-1">
                                    {message.senderType === 'ADMIN' ? 'Meldestelle' : 'Hinweisgeber/in'}
                                </div>
                                <div className="whitespace-pre-wrap">{message.content}</div>
                                {message.attachments.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {message.attachments.map((att) => (
                                            <a
                                                key={att.id}
                                                href={getAttachmentUrl(att.id)}
                                                className={`flex items-center gap-2 text-sm ${message.senderType === 'ADMIN'
                                                    ? 'text-white/80 hover:text-white'
                                                    : 'text-primary-700 hover:underline'
                                                    }`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FileText className="w-4 h-4" />
                                                {att.originalName}
                                                <Download className="w-3 h-3" />
                                            </a>
                                        ))}
                                    </div>
                                )}
                                <div className={`text-xs mt-2 ${message.senderType === 'ADMIN' ? 'text-white/60' : 'text-gray-400'
                                    }`}>
                                    {formatDate(message.createdAt)}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input */}
            {status !== 'CLOSED' && (
                <div className="bg-white border-t border-gray-100 sticky bottom-0">
                    <div className="max-w-4xl mx-auto px-6 py-4">
                        {files.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {files.map((file, index) => (
                                    <div key={index} className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1 text-sm">
                                        <FileText className="w-3 h-3" />
                                        <span className="truncate max-w-[100px]">{file.name}</span>
                                        <button onClick={() => removeFile(index)}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="btn-secondary px-3 py-3"
                                disabled={sending}
                                title="Datei anhängen"
                            >
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                                className="hidden"
                            />
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="input flex-1"
                                placeholder="Ihre Antwort..."
                                disabled={sending}
                            />
                            <button
                                type="submit"
                                disabled={sending || (!newMessage.trim() && files.length === 0)}
                                className="btn-primary px-4 py-3"
                                title="Nachricht senden"
                            >
                                {sending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {status === 'CLOSED' && (
                <div className="bg-gray-100 border-t border-gray-200 py-4 text-center text-gray-600">
                    Dieser Vorgang ist abgeschlossen. Ändern Sie den Status, um zu antworten.
                </div>
            )}
        </div>
    );
}
