import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { startNewConversation } from '../api/messageApi';

const MessageButton = ({ itemId, ownerId, className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleMessageClick = async (e) => {
    e?.stopPropagation?.();
    if (!itemId || !ownerId) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Create the first message (starts a conversation on this backend)
      await startNewConversation(ownerId, itemId, 'Hello, I am interested in this item.');
      // Navigate to chat with that user, scoped to this item
      navigate(`/messages/${ownerId}?itemId=${itemId}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      setError('Failed to start conversation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleMessageClick}
      disabled={isLoading}
      className={`message-button ${className} ${isLoading ? 'loading' : ''}`}
      title="Message about this item"
    >
      <MessageSquare size={16} />
      <span>{isLoading ? 'Loading...' : 'Message'}</span>
      {error && <span className="error-message">{error}</span>}
    </button>
  );
};

export default MessageButton;
