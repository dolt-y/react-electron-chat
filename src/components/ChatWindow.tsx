import React, { useState, useRef, useEffect } from 'react';
import './ChatLayout.scss';

type Message = {
  text?: string;
  self: boolean;
  nickname: string;
  time: string;
  type: 'text' | 'image' | 'file';
  url?: string;
  fileName?: string;
};

const emojis = [
  '😄','😂','😍','😢','😎','👍','🎉','❤️',
  '😉','😋','😇','😱','😭','😡','🤔','🙄',
  '😴','🤗','😏','😜','🤩','🤯','🥳','😶'
];

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: '你好！', self: false, nickname: 'Alice', time: '09:00', type: 'text' },
    { text: '你好啊！', self: true, nickname: 'Me', time: '09:01', type: 'text' },
    { text: '这是发送的图片示例', self: false, nickname: 'Alice', time: '09:02', type: 'text' },
    { self: false, nickname: 'Alice', time: '09:02', type: 'image', url: 'https://via.placeholder.com/150' },
  ]);
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [emojiPage, setEmojiPage] = useState(0);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const EMOJI_PER_PAGE = 12;
  const totalPages = Math.ceil(emojis.length / EMOJI_PER_PAGE);

  const sendTextMessage = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([...messages, { text: input, self: true, nickname: 'Me', time, type: 'text' }]);
    setInput('');
    setShowEmoji(false);
  };

  const sendFileMessage = (file: File) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const type = file.type.startsWith('image/') ? 'image' : 'file';
    const url = type === 'image' ? URL.createObjectURL(file) : undefined;
    setMessages([...messages, { self: true, nickname: 'Me', time, type, url, fileName: file.name }]);
  };

  const addEmoji = (emoji: string) => setInput(prev => prev + emoji);

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((m, idx) => (
          <div key={idx} className={`chat-message ${m.self ? 'self' : 'other'}`}>
            <div className="avatar" />
            <div className="bubble">
              <div className="nickname">{m.nickname}</div>
              {m.type === 'text' && <div>{m.text}</div>}
              {m.type === 'image' && m.url && (
                <img src={m.url} alt="img" className="chat-image" onClick={() => setPreviewImg(m.url)} />
              )}
              {m.type === 'file' && m.fileName && (
                <a href={m.url || '#'} download={m.fileName} className="chat-file">{m.fileName}</a>
              )}
              <div className="timestamp">{m.time}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <div className="emoji-btn" onClick={() => setShowEmoji(prev => !prev)}>😊</div>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={e => e.key === 'Enter' && sendTextMessage()}
        />
        <label className="file-btn">
          📎
          <input type="file" style={{ display: 'none' }} onChange={e => e.target.files && sendFileMessage(e.target.files[0])} />
        </label>
        <button onClick={sendTextMessage}>Send</button>
      </div>

      {showEmoji && (
        <div className="emoji-panel">
          <div className="emoji-grid">
            {emojis.slice(emojiPage * EMOJI_PER_PAGE, (emojiPage + 1) * EMOJI_PER_PAGE).map((emoji, idx) => (
              <span key={idx} onClick={() => addEmoji(emoji)} className="emoji-item">{emoji}</span>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="emoji-pagination">
              <button disabled={emojiPage === 0} onClick={() => setEmojiPage(p => p - 1)}>◀</button>
              <span>{emojiPage + 1}/{totalPages}</span>
              <button disabled={emojiPage === totalPages - 1} onClick={() => setEmojiPage(p => p + 1)}>▶</button>
            </div>
          )}
        </div>
      )}

      {previewImg && (
        <div className="image-preview" onClick={() => setPreviewImg(null)}>
          <img src={previewImg} alt="preview" />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
