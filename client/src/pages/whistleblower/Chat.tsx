import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Send, Paperclip, LogOut, FileText, Download, Loader2, X } from 'lucide-react';
import { getWhistleblowerMessages, sendWhistleblowerMessage, getAttachmentUrl } from '../../api/client';

interface Message {
    id: string;
    senderType: 'WHISTLEBLOWER' | 'ADMIN';
    content: string;
    createdAt: string;
    attachments: Array<{ id: string; originalName: string }>;
}

export default function WhistleblowerChat() {
    const navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [caseId, setCaseId] = useState('');
    const [status, setStatus] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        if (!token || userType !== 'whistleblower') {
            navigate('/login');
            return;
        }

        loadMessages();
    }, [navigate]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadMessages = async () => {
        const result = await getWhistleblowerMessages();

        if (result.error) {
            if (result.error === 'Invalid token') {
                handleLogout();
            } else {
                setError(result.error);
            }
            setLoading(false);
            return;
        }

        setCaseId(result.data!.caseId);
        setStatus(result.data!.status);
        setMessages(result.data!.messages);
        setLoading(false);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() && files.length === 0) return;

        setSending(true);

        const result = await sendWhistleblowerMessage(newMessage.trim(), files);

        if (result.error) {
            setError(result.error);
            setSending(false);
            return;
        }

        setMessages(prev => [...prev, result.data! as Message]);
        setNewMessage('');
        setFiles([]);
        setSending(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('caseId');
        navigate('/login');
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('de-DE');
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'NEW': return 'Neu';
            case 'IN_PROGRESS': return 'In Bearbeitung';
            case 'CLOSED': return 'Abgeschlossen';
            default: return status;
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'NEW': return 'badge-new';
            case 'IN_PROGRESS': return 'badge-in-progress';
            case 'CLOSED': return 'badge-closed';
            default: return 'badge';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-700" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <Shield className="w-8 h-8 text-primary-700" />
                        <span className="text-xl font-semibold text-primary-700">OpenWhistle</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Vorgang</div>
                            <div className="font-medium text-primary-700">{caseId}</div>
                        </div>
                        <span className={getStatusBadgeClass(status)}>{getStatusLabel(status)}</span>
                        <button onClick={handleLogout} className="btn-secondary px-3 py-2" title="Abmelden">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

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
                            className={`flex ${message.senderType === 'WHISTLEBLOWER' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-lg px-4 py-3 ${message.senderType === 'WHISTLEBLOWER'
                                        ? 'bg-primary-700 text-white'
                                        : 'bg-white border border-gray-200'
                                    }`}
                            >
                                <div className="text-sm opacity-75 mb-1">
                                    {message.senderType === 'WHISTLEBLOWER' ? 'Sie' : 'Meldestelle'}
                                </div>
                                <div className="whitespace-pre-wrap">{message.content}</div>
                                {message.attachments.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {message.attachments.map((att) => (
                                            <a
                                                key={att.id}
                                                href={getAttachmentUrl(att.id)}
                                                className={`flex items-center gap-2 text-sm ${message.senderType === 'WHISTLEBLOWER'
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
                                <div className={`text-xs mt-2 ${message.senderType === 'WHISTLEBLOWER' ? 'text-white/60' : 'text-gray-400'
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
                                placeholder="Ihre Nachricht..."
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
                    Dieser Vorgang wurde abgeschlossen. Es können keine weiteren Nachrichten gesendet werden.
                </div>
            )}
        </div>
    );
}
