import { useState, useRef, useEffect } from 'react';
import './AIChat.css';

export default function AIChat({ lessonTitle, lessonContent }) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('ai-api-key') || '');
  const [keySet, setKeySet] = useState(() => !!localStorage.getItem('ai-api-key'));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('ai-api-key', apiKey.trim());
      setKeySet(true);
      setMessages([{
        role: 'assistant',
        content: `Hi! I'm your AI physics tutor. Ask me anything about **${lessonTitle || 'this lesson'}** and I'll help explain it.`,
      }]);
    }
  };

  const clearKey = () => {
    localStorage.removeItem('ai-api-key');
    setApiKey('');
    setKeySet(false);
    setMessages([]);
  };

  const buildSystemPrompt = () => {
    let context = `You are a friendly, encouraging physics tutor helping a student with a lesson called "${lessonTitle}".`;
    if (lessonContent) {
      const topics = lessonContent.sections
        ?.filter((s) => s.content)
        .map((s) => s.content)
        .join('\n\n');
      if (topics) {
        context += `\n\nHere is the lesson content for reference:\n${topics.substring(0, 3000)}`;
      }
    }
    context += '\n\nKeep explanations clear, concise, and appropriate for a high school physics student. Use analogies when helpful. If the student asks about something outside physics, gently redirect them.';
    return context;
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = newMessages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          system: buildSystemPrompt(),
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantText = data.content?.[0]?.text || 'Sorry, I couldn\'t generate a response.';
      setMessages([...newMessages, { role: 'assistant', content: assistantText }]);
    } catch (err) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: `Error: ${err.message}. Please check your API key and try again.`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      <button
        className={`ai-chat-fab ${isOpen ? 'fab-active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="AI Tutor"
      >
        {isOpen ? '✕' : 'AI'}
      </button>

      {isOpen && (
        <div className="ai-chat-panel">
          <div className="ai-chat-header">
            <span className="ai-chat-title">AI Physics Tutor</span>
            {keySet && (
              <button className="ai-key-clear" onClick={clearKey} title="Change API key">
                Change Key
              </button>
            )}
          </div>

          {!keySet ? (
            <div className="ai-key-setup">
              <p className="ai-key-info">
                Enter your Anthropic API key to chat with an AI tutor that can explain concepts from this lesson.
              </p>
              <p className="ai-key-note">
                Your key is stored locally in your browser and never sent to our servers.
              </p>
              <input
                type="password"
                className="ai-key-input"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                onKeyDown={(e) => e.key === 'Enter' && saveKey()}
              />
              <button className="btn-primary ai-key-btn" onClick={saveKey} disabled={!apiKey.trim()}>
                Save & Start Chatting
              </button>
            </div>
          ) : (
            <>
              <div className="ai-chat-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`ai-msg ai-msg-${msg.role}`}>
                    <div
                      className="ai-msg-content"
                      dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                    />
                  </div>
                ))}
                {loading && (
                  <div className="ai-msg ai-msg-assistant">
                    <div className="ai-msg-content ai-typing">Thinking...</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="ai-chat-input-area">
                <input
                  type="text"
                  className="ai-chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about this lesson..."
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  disabled={loading}
                />
                <button
                  className="ai-send-btn"
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                >
                  →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
