import React, { useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  Image, 
  Send,
  Save,
  Type,
  Paperclip
} from 'lucide-react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

interface EmailEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (content: { subject: string; body: string }) => void;
  initialSubject?: string;
  toEmail?: string;
}

export const EmailEditor: React.FC<EmailEditorProps> = ({
  isOpen,
  onClose,
  onSend,
  initialSubject = '',
  toEmail = ''
}) => {
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState('');
  const [showVariables, setShowVariables] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const variables = [
    { name: 'First Name', value: '{{firstName}}' },
    { name: 'Last Name', value: '{{lastName}}' },
    { name: 'Company', value: '{{company}}' },
    { name: 'Date', value: '{{date}}' },
    { name: 'Time', value: '{{time}}' }
  ];

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertVariable = (variable: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const span = document.createElement('span');
      span.className = 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded font-mono text-sm';
      span.textContent = variable;
      
      range.insertNode(span);
      range.setStartAfter(span);
      range.setEndAfter(span);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    setShowVariables(false);
  };

  const handleSend = () => {
    if (!subject.trim() || !body.trim()) return;
    
    onSend({
      subject,
      body: editorRef.current?.innerHTML || body
    });
    
    // Reset form
    setSubject('');
    setBody('');
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
  };

  const handleSave = () => {
    // Save as draft functionality
    console.log('Saving draft...', { subject, body: editorRef.current?.innerHTML });
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compose Email" size="xl">
      <div className="space-y-4">
        {/* To Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            To
          </label>
          <input
            type="email"
            value={toEmail}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Subject Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Editor Toolbar */}
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-2 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => formatText('bold')}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('italic')}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('underline')}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                <Underline className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
              <button
                onClick={() => formatText('insertUnorderedList')}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('createLink', prompt('Enter URL:') || '')}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                <Link className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                <Paperclip className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowVariables(!showVariables)}
                  icon={Type}
                >
                  Variables
                </Button>
                
                {showVariables && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Insert Variable
                      </p>
                      {variables.map((variable) => (
                        <button
                          key={variable.value}
                          onClick={() => insertVariable(variable.value)}
                          className="w-full text-left px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          {variable.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <Button variant="ghost" size="sm" onClick={handleSave} icon={Save}>
                Save
              </Button>
            </div>
          </div>

          {/* Editor Content */}
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[300px] p-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
            style={{ wordWrap: 'break-word' }}
            onInput={(e) => setBody((e.target as HTMLDivElement).innerHTML)}
            placeholder="Type your message..."
          />
        </div>

        {/* Send Button */}
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Press Ctrl+Enter to send
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSend}
              disabled={!subject.trim() || !body.trim()}
              icon={Send}
            >
              Send Email
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};