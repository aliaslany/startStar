import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, ArrowRight, BookOpen, Loader2, RefreshCw, Send, Paperclip, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

type ChatMessage = {
  id: string;
  role: 'user' | 'model';
  parts: Array<{ text?: string, inlineData?: { mimeType: string, data: string } }>;
  displayFile?: { name: string, size: number, type: string }; // For UI only
  text?: string; // For UI display
};

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Handle Textarea resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [inputValue]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('فرمت فایل پشتیبانی نمی‌شود. لطفاً PDF یا عکس (JPG/PNG) آپلود کنید.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert('حجم فایل نباید بیشتر از 20 مگابایت باشد.');
      return;
    }
    setSelectedFile(file);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if ((!inputValue.trim() && !selectedFile) || isProcessing) return;

    const textToSend = inputValue.trim() || (selectedFile ? 'لطفاً این امتحان را حل کنید.' : '');
    
    // Prepare the new user message
    const newUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: textToSend,
      parts: [],
    };

    if (selectedFile) {
      newUserMessage.displayFile = {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      };
    }

    // Add to UI
    setMessages(prev => [...prev, newUserMessage]);
    
    // Prepare history payload (excluding the current file, which is sent separately)
    const historyToSent = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text || '' }] // We omit files from history payload to save tokens for now
    }));

    setInputValue('');
    const fileToSend = selectedFile;
    setSelectedFile(null);
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('text', textToSend);
    formData.append('messages', JSON.stringify(historyToSent));
    if (fileToSend) {
      formData.append('file', fileToSend);
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('خطا در ارتباط با سرور.');
      if (!response.body) throw new Error('ReadableStream not supported.');

      // Add a placeholder message for the assistant
      const assistantMessageId = crypto.randomUUID();
      setMessages(prev => [
        ...prev,
        { id: assistantMessageId, role: 'model', text: '', parts: [] }
      ]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  setMessages(prev => prev.map(msg => {
                    if (msg.id === assistantMessageId) {
                      return { ...msg, text: (msg.text || '') + parsed.text };
                    }
                    return msg;
                  }));
                } else if (parsed.error) {
                  setMessages(prev => prev.map(msg => {
                    if (msg.id === assistantMessageId) {
                      return { ...msg, text: (msg.text || '') + `\n\n**خطا:** ${parsed.error}` };
                    }
                    return msg;
                  }));
                }
              } catch (e) {
                // Ignore parse errors on incomplete chunks
              }
            }
          }
        }
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: 'model', text: `خطایی رخ داد: ${err.message}`, parts: [] }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0B0F19] text-gray-100 font-sans selection:bg-indigo-500/30" dir="rtl"
         onDragOver={handleDragOver}
         onDragLeave={handleDragLeave}
         onDrop={handleDrop}>
      
      {/* Global Drag & Drop Overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F19]/80 backdrop-blur-sm border-4 border-indigo-500 border-dashed m-4 rounded-3xl"
          >
            <div className="text-center pointer-events-none flex flex-col items-center">
              <div className="bg-indigo-500/20 p-6 rounded-full mb-4 animate-bounce">
                <Upload className="w-16 h-16 text-indigo-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">فایل امتحان را رها کنید</h2>
              <p className="text-indigo-200">PDF یا تصاویر (JPG, PNG)</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="flex-none bg-[#0B0F19]/80 backdrop-blur-md border-b border-gray-800/50 p-4 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="bg-indigo-500/20 p-2.5 rounded-xl border border-indigo-500/20">
            <BookOpen className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">ExamBuddy</h1>
            <p className="text-sm text-gray-400">دستیار هوشمند امتحانات شما</p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 z-10 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-6 pb-6">
          
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center text-center mt-20 md:mt-32 px-4"
            >
              <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-6 ring-1 ring-indigo-500/20">
                <BookOpen className="w-10 h-10 text-indigo-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">چگونه می‌توانم کمکتان کنم؟</h2>
              <p className="text-gray-400 max-w-md text-lg">
                فایل امتحان (PDF یا عکس) را آپلود کنید یا سوال خود را بپرسید تا با هم حلش کنیم.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 w-full max-w-2xl">
                <div className="bg-gray-800/40 border border-gray-700/50 p-4 rounded-2xl flex items-start gap-3">
                  <div className="bg-emerald-500/10 p-2 rounded-lg shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-right">
                    <h3 className="text-white font-medium mb-1">حل قدم‌به‌قدم</h3>
                    <p className="text-sm text-gray-400">توضیح کامل راه‌حل برای یادگیری بهتر</p>
                  </div>
                </div>
                <div className="bg-gray-800/40 border border-gray-700/50 p-4 rounded-2xl flex items-start gap-3">
                  <div className="bg-purple-500/10 p-2 rounded-lg shrink-0">
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-right">
                    <h3 className="text-white font-medium mb-1">پشتیبانی از عکس و PDF</h3>
                    <p className="text-sm text-gray-400">تشخیص دقیق متون فارسی در تصاویر</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'
                  }`}>
                    {msg.role === 'user' ? <span className="text-sm font-bold text-white">شما</span> : <BookOpen className="w-4 h-4 text-white" />}
                  </div>

                  {/* Bubble */}
                  <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    
                    {/* File Attachment Preview */}
                    {msg.displayFile && (
                      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-3 flex items-center gap-3 w-64 shadow-sm">
                        <div className="bg-indigo-500/20 p-2 rounded-xl">
                          {msg.displayFile.type.includes('image') ? (
                            <ImageIcon className="w-6 h-6 text-indigo-400" />
                          ) : (
                            <FileText className="w-6 h-6 text-indigo-400" />
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium text-gray-200 truncate" dir="ltr">{msg.displayFile.name}</p>
                          <p className="text-xs text-gray-500">{(msg.displayFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                    )}

                    {/* Text Message */}
                    {msg.text && (
                      <div className={`relative px-5 py-3.5 rounded-3xl ${
                        msg.role === 'user' 
                          ? 'bg-indigo-600 text-white rounded-br-sm' 
                          : 'bg-gray-800 border border-gray-700/50 text-gray-200 rounded-bl-sm shadow-sm'
                      }`}>
                        <div className={`prose prose-sm max-w-none dir-rtl ${msg.role === 'user' ? 'prose-invert prose-p:text-white' : 'prose-invert prose-indigo markdown-body'}`}>
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                    
                    {/* Loading indicator for model when text is empty */}
                    {msg.role === 'model' && !msg.text && isProcessing && (
                      <div className="bg-gray-800 border border-gray-700/50 rounded-3xl rounded-bl-sm px-5 py-4">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-none p-4 bg-[#0B0F19]/80 backdrop-blur-md border-t border-gray-800/50 z-20">
        <div className="max-w-4xl mx-auto">
          
          {/* File Preview before send */}
          <AnimatePresence>
            {selectedFile && (
              <motion.div 
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: 10, height: 0 }}
                className="mb-3 flex items-center gap-3 bg-gray-800/80 border border-gray-700 w-fit p-2 pr-3 rounded-2xl"
              >
                <div className="bg-indigo-500/20 p-1.5 rounded-lg shrink-0">
                   {selectedFile.type.includes('image') ? (
                      <ImageIcon className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <FileText className="w-4 h-4 text-indigo-400" />
                    )}
                </div>
                <span className="text-sm text-gray-300 max-w-[200px] truncate" dir="ltr">{selectedFile.name}</span>
                <button 
                  onClick={removeFile}
                  className="p-1.5 hover:bg-gray-700 rounded-full transition-colors ml-1 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative flex items-end gap-2 bg-gray-800/50 border border-gray-700 rounded-3xl p-2 transition-colors focus-within:bg-gray-800 focus-within:border-indigo-500/50 shadow-sm">
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,image/jpeg,image/png,image/webp"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="p-3 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-full transition-colors shrink-0 disabled:opacity-50"
              title="پیوست فایل (PDF, تصویر)"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              placeholder="سوال خود را بپرسید یا فایل امتحان را آپلود کنید..."
              className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-[150px] py-3 text-gray-100 placeholder:text-gray-500 scrollbar-thin disabled:opacity-50"
              rows={1}
            />

            <button
              onClick={handleSend}
              disabled={(!inputValue.trim() && !selectedFile) || isProcessing}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors shrink-0 disabled:opacity-50 disabled:bg-gray-700 disabled:text-gray-400 disabled:hover:bg-gray-700 flex items-center justify-center"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 rotate-180 ml-0.5" /> // Rotate for RTL direction
              )}
            </button>
          </div>
          
          <div className="text-center mt-3">
            <p className="text-xs text-gray-500">
              ExamBuddy ممکن است اشتباه کند. همیشه پاسخ‌ها را بررسی کنید.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
