import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMessageCircle, 
  FiSearch,
  FiMoreHorizontal,
  FiPlus,
  FiArrowLeft,
  FiInfo,
  FiPaperclip,
  FiX,
  FiImage,
  FiFile,
  FiEdit,
  FiCheck,
  FiAlertCircle,
  FiTrash2,
  FiCopy,
  FiClock,
  FiDownload
} from 'react-icons/fi';
import { IoSend, IoChatbubblesSharp } from "react-icons/io5";
import { MdOutlineReply } from "react-icons/md";
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { mockGroups, mockGroupMessages, mockGroupMembers, mockAuthUser } from '../../assets/mock';

// ============================================
// HELPER FUNCTIONS
// ============================================
const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now - date;
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInHours < 24) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } else if (diffInDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

const formatTimeOnly = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
};

const formatDateSeparator = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

const needsDateSeparator = (message, previousMessage) => {
  if (!previousMessage) return true;
  const messageDate = new Date(message.timestamp).toDateString();
  const previousDate = new Date(previousMessage.timestamp).toDateString();
  return messageDate !== previousDate;
};

const shouldGroupMessages = (message, previousMessage) => {
  if (!previousMessage) return false;
  if (message.senderId !== previousMessage.senderId) return false;
  const timeDiff = new Date(message.timestamp) - new Date(previousMessage.timestamp);
  return timeDiff < 60000;
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const extractUrls = (text) => {
  if (!text) return [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
};

// ============================================
// SUB-COMPONENTS
// ============================================

// Date Separator Component
const DateSeparator = ({ timestamp }) => (
  <div className="flex items-center justify-center my-4">
    <div className="bg-white backdrop-blur-sm rounded-full px-3 py-0.5 shadow-sm border border-primary/20">
      <span className="text-xs text-secondary font-semibold">
        {formatDateSeparator(timestamp)}
      </span>
    </div>
  </div>
);

// Chat List Item Component
const ChatListItem = ({ group, isActive, onClick, lastMessage, isLoadingMessages }) => {
  const isOnline = group.members > 0;
  return (
    <motion.div
      layout
      onClick={() => onClick(group)}
      className={cn(
        "flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 hover:bg-primary/5 border-b border-primary/10 rounded-xl mx-2 my-1",
        isActive && "bg-primary/10"
      )}
    >
      <div className="relative flex-shrink-0">
        <div
          className="w-12 h-12 rounded-full bg-cover bg-center border border-primary/20"
          style={{
            backgroundImage: group.icon_image_url 
              ? `url(${group.icon_image_url})` 
              : 'linear-gradient(135deg, #F9D769 0%, #E8C547 100%)'
          }}
        >
          {!group.icon_image_url && (
            <div className="w-full h-full flex items-center justify-center rounded-full text-secondary text-sm font-normal">
              {group.name?.charAt(0)?.toUpperCase() || 'G'}
            </div>
          )}
        </div>
        {isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-semibold text-secondary truncate">
            {group.name}
          </h3>
          <span className="text-xs text-secondary/60 flex-shrink-0">
            {lastMessage?.timestamp && formatMessageTime(lastMessage.timestamp)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-secondary/70 truncate">
            {lastMessage ? (
              <div className="flex items-center gap-1">
                {lastMessage.media ? (
                  <>
                    <FiImage className="w-3 h-3 text-secondary/60" />
                    <span>{lastMessage.text ? truncateText(lastMessage.text, 30) : 'Photo'}</span>
                  </>
                ) : (
                  <span>{truncateText(lastMessage.text || 'No messages', 40)}</span>
                )}
              </div>
            ) : (
              'No messages yet'
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Chat Message Component
const ChatMessage = ({ message, isOwn, showAvatar, showSenderName, currentUser, onContextMenu }) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const longPressTimerRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setLongPressTriggered(false);
    
    longPressTimerRef.current = setTimeout(() => {
      setLongPressTriggered(true);
      if (onContextMenu) {
        onContextMenu(e, message);
      }
    }, 500);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    if (deltaX > 10 || deltaY > 10) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (onContextMenu) {
      onContextMenu(e, message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-2 mb-1",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
    >
      {showAvatar && !isOwn && (
        <div 
          className="w-6 h-6 rounded-full bg-gradient-primary-soft flex items-center justify-center text-secondary text-xs font-bold flex-shrink-0 mt-auto border border-primary/20"
        >
          {message.senderUserName?.charAt(0)?.toUpperCase() || message.senderId?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      )}
      
      {!showAvatar && !isOwn && (
        <div className="w-6 flex-shrink-0"></div>
      )}

      <div className={cn(
        "max-w-xs lg:max-w-md",
        isOwn ? "items-end" : "items-start"
      )}>
        {showSenderName && !isOwn && (
          <div className="mb-1 ml-2">
            <span className="text-xs font-normal text-black">
              {message.senderUserName || 'Unknown User'}
            </span>
          </div>
        )}

        <div className={cn(
          "p-0.5 rounded-2xl relative shadow-sm",
          isOwn 
            ? "bg-primary text-secondary rounded-br-[0px]" 
            : "bg-white text-secondary rounded-bl-md",
          longPressTriggered && "ring-2 ring-primary/50"
        )}>
          {message.media && (
            <div className="mb-2">
              {message.media.media_type === 'IMAGE' && (
                <div className="relative">
                  <img 
                    src={message.media.media_url} 
                    alt="Shared image"
                    className="rounded-xl max-w-full h-auto cursor-pointer border border-primary/10"
                    onClick={() => window.open(message.media.media_url, '_blank')}
                  />
                </div>
              )}
              {message.media.media_type === 'FILE' && (
                <div className={cn(
                  "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors border",
                  isOwn 
                    ? "bg-primary/10 hover:bg-primary/20 border-primary/20" 
                    : "bg-secondary/5 hover:bg-secondary/10 border-secondary/20"
                )}
                onClick={() => window.open(message.media.media_url, '_blank')}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    isOwn ? "bg-primary/20" : "bg-secondary/10"
                  )}>
                    <FiFile className={cn("w-4 h-4", "text-secondary")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate text-secondary">
                      {message.media.filename || 'File attachment'}
                    </p>
                    <p className="text-xs text-secondary/60">
                      {message.media.size || 'Unknown size'}
                    </p>
                  </div>
                  <FiDownload className="w-3 h-3 text-secondary/60" />
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-end p-2 justify-between gap-5">
            <div className="flex-1">
              {message.text && (
                <div className="text-xs whitespace-pre-wrap break-words">
                  {message.text}
                </div>
              )}
            </div>

            <div className={cn(
              "flex items-center gap-1 justify-end",
              isOwn ? "text-secondary/70" : "text-secondary/60"
            )}>
              <span className="text-[10px]">{formatTimeOnly(message.timestamp)}</span>
              {isOwn && (
                <div className="ml-0.5">
                  {message.status === 'read' ? (
                    <div className="flex">
                      <FiCheck className="w-2.5 h-2.5 text-primary -mr-1" />
                      <FiCheck className="w-2.5 h-2.5 text-primary" />
                    </div>
                  ) : message.status === 'DELIVERED' ? (
                    <div className="flex">
                      <FiCheck className="w-2.5 h-2.5 text-secondary/60 -mr-1" />
                      <FiCheck className="w-2.5 h-2.5 text-secondary/60" />
                    </div>
                  ) : message.status === 'SENT' ? (
                    <FiCheck className="w-2.5 h-2.5 text-secondary/60" />
                  ) : (
                    <FiClock className="w-2.5 h-2.5 text-secondary/40" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Deleted Message Component
const DeletedMessage = ({ message, isOwn, showAvatar, showSenderName, currentUser, onRemoveDeleted }) => {
  const [showRemoveMenu, setShowRemoveMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const senderName = message.senderUserName || 'Someone';
  const deletedText = isOwn ? 'You deleted this message' : `${senderName} deleted this message`;

  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowRemoveMenu(true);
  };

  const handleRemoveForever = () => {
    onRemoveDeleted(message.messageId);
    setShowRemoveMenu(false);
    toast.success('Deleted message removed');
  };

  useEffect(() => {
    const handleClickOutside = () => setShowRemoveMenu(false);
    if (showRemoveMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showRemoveMenu]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex gap-2 mb-1 relative",
          isOwn ? "flex-row-reverse" : "flex-row"
        )}
        onContextMenu={handleContextMenu}
      >
        {showAvatar && !isOwn && (
          <div className="w-6 h-6 rounded-full bg-gradient-primary-soft flex items-center justify-center text-secondary text-xs font-bold flex-shrink-0 mt-auto border border-primary/20">
            {message.senderUserName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
        
        {!showAvatar && !isOwn && <div className="w-6 flex-shrink-0"></div>}

        <div className={cn("max-w-xs lg:max-w-md", isOwn ? "items-end" : "items-start")}>
          {showSenderName && !isOwn && (
            <div className="mb-1 ml-2">
              <span className="text-xs font-normal text-black">
                {message.senderUserName || 'Unknown User'}
              </span>
            </div>
          )}

          <div className={cn(
            "p-3 rounded-2xl relative shadow-sm border cursor-pointer",
            isOwn 
              ? "bg-gray-100 text-gray-500 rounded-br-md border-gray-200" 
              : "bg-gray-50 text-gray-500 rounded-bl-md border-gray-200"
          )}>
            <div className="flex items-center gap-2">
              <FiAlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="flex items-end justify-between gap-5 flex-1">
                <span className="text-xs font-normal italic">{deletedText}</span>
                <div className="flex items-center gap-1 justify-end text-gray-400">
                  <span className="text-[10px]">{formatTimeOnly(message.timestamp)}</span>
                  {isOwn && (
                    <div className="ml-0.5">
                      <FiCheck className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {showRemoveMenu && (
        <div 
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-[100]"
          style={{ 
            left: Math.min(menuPosition.x, window.innerWidth - 200), 
            top: Math.min(menuPosition.y, window.innerHeight - 100)
          }}
        >
          <button
            onClick={handleRemoveForever}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
            Remove deleted message
          </button>
        </div>
      )}
    </>
  );
};

// Message Context Menu Component
const MessageContextMenu = ({ isOpen, onClose, position, message, isOwn, onEdit, onDelete, onCopy, onReply }) => {
  const menuRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-xl shadow-lg border border-primary/20 py-2 z-50 min-w-[160px]"
      style={{
        top: position.y,
        left: position.x,
        transform: 'translate(-50%, -10px)'
      }}
    >
      <button
        onClick={() => { onCopy(message.text); onClose(); }}
        className="w-full px-4 py-2 text-left text-sm text-secondary hover:bg-primary/5 flex items-center gap-3"
      >
        <FiCopy className="w-4 h-4" />
        Copy
      </button>
      {isOwn && (
        <>
          <button
            onClick={() => { onEdit(message); onClose(); }}
            className="w-full px-4 py-2 text-left text-sm text-secondary hover:bg-primary/5 flex items-center gap-3"
          >
            <FiEdit className="w-4 h-4" />
            Edit
          </button>
          
          <button
            onClick={() => { onDelete(message); onClose(); }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
          >
            <FiTrash2 className="w-4 h-4" />
            Delete
          </button>
        </>
      )}
    </div>
  );
};

// Upload Progress Component
const UploadProgress = ({ fileName, progress, onCancel }) => {
  return (
    <div className="px-4 py-2 border-t border-primary/10 bg-primary/5">
      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-primary/20">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center relative">
          <FiFile className="w-5 h-5 text-secondary" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="18"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-primary/30"
              />
              <circle
                cx="20"
                cy="20"
                r="18"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 18}`}
                strokeDashoffset={`${2 * Math.PI * 18 * (1 - progress / 100)}`}
                className="text-primary transition-all duration-300"
              />
            </svg>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate text-secondary">{fileName}</p>
          <p className="text-xs text-secondary/60">Uploading... {progress}%</p>
        </div>
        
        <button
          onClick={onCancel}
          className="p-1 hover:bg-secondary/10 rounded-full transition-colors"
        >
          <FiX className="w-4 h-4 text-secondary" />
        </button>
      </div>
    </div>
  );
};

// ============================================
// MAIN GROUPS COMPONENT
// ============================================
const Groups = () => {
  const [groups, setGroups] = useState(mockGroups);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingMessage, setEditingMessage] = useState(null);
  const [contextMenu, setContextMenu] = useState({ isOpen: false, position: { x: 0, y: 0 }, message: null });
  const [hiddenDeletedMessages, setHiddenDeletedMessages] = useState(new Set());
  const [groupMessagesMap, setGroupMessagesMap] = useState(new Map());
  const [lastMessages, setLastMessages] = useState(new Map());
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setCurrentUser({
      id: "user_1",
      name: mockAuthUser.username,
      email: mockAuthUser.email
    });

    const messagesMap = new Map();
    const lastMsgsMap = new Map();
    
    Object.entries(mockGroupMessages).forEach(([groupId, msgs]) => {
      messagesMap.set(groupId, msgs);
      if (msgs.length > 0) {
        lastMsgsMap.set(groupId, msgs[msgs.length - 1]);
      }
    });
    
    setGroupMessagesMap(messagesMap);
    setLastMessages(lastMsgsMap);
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowChatList(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    const existingMessages = groupMessagesMap.get(group.group_id) || [];
    setMessages(existingMessages);
    
    if (isMobile) {
      setShowChatList(false);
    }

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
    }, 100);
  };

  const handleBackToChatList = () => {
    setShowChatList(true);
    setSelectedGroup(null);
    setMessages([]);
  };

  const handleCloseChat = () => {
    setSelectedGroup(null);
    setMessages([]);
    if (isMobile) {
      setShowChatList(true);
    }
  };

  const handleRemoveDeletedMessage = (messageId) => {
    setHiddenDeletedMessages(prev => new Set(prev).add(messageId));
    
    if (selectedGroup) {
      setMessages(prevMessages => prevMessages.filter(msg => msg.messageId !== messageId));
      
      setGroupMessagesMap(prevMap => {
        const newMap = new Map(prevMap);
        const currentMessages = newMap.get(selectedGroup.group_id) || [];
        const filteredMessages = currentMessages.filter(msg => msg.messageId !== messageId);
        newMap.set(selectedGroup.group_id, filteredMessages);
        return newMap;
      });
    }
  };

  const handleMessageContextMenu = (e, message) => {
    e.preventDefault();
    if (message.status === 'DELETED') return;
    
    const rect = e.currentTarget?.getBoundingClientRect();
    setContextMenu({
      isOpen: true,
      position: {
        x: e.clientX || (rect ? rect.left + rect.width / 2 : 0),
        y: e.clientY || (rect ? rect.top : 0)
      },
      message
    });
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setNewMessage(message.text);
    setContextMenu({ ...contextMenu, isOpen: false });
  };

  const handleDeleteMessage = (message) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.messageId === message.messageId 
            ? { ...msg, status: 'DELETED', deletedAt: new Date().toISOString() }
            : msg
        )
      );
      
      setGroupMessagesMap(prevMap => {
        const newMap = new Map(prevMap);
        const currentMessages = newMap.get(selectedGroup.group_id) || [];
        const updatedMessages = currentMessages.map(msg => 
          msg.messageId === message.messageId 
            ? { ...msg, status: 'DELETED', deletedAt: new Date().toISOString() }
            : msg
        );
        newMap.set(selectedGroup.group_id, updatedMessages);
        return newMap;
      });

      toast.success('Message deleted successfully');
    }
    setContextMenu({ ...contextMenu, isOpen: false });
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Message copied to clipboard');
    setContextMenu({ ...contextMenu, isOpen: false });
  };

  const handleReplyMessage = (message) => {
    setNewMessage(`@${message.senderUserName} `);
    setContextMenu({ ...contextMenu, isOpen: false });
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 30 * 1024 * 1024) {
        toast.error('File size cannot exceed 30MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !selectedGroup) return;

    if (selectedFile && !newMessage.trim()) {
      toast.error('Please add a message with the file');
      return;
    }

    const isEditMode = editingMessage !== null;
    
    if (isEditMode) {
      const updatedMessage = {
        ...editingMessage,
        text: newMessage,
        timestamp: new Date().toISOString()
      };

      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.messageId === editingMessage.messageId ? updatedMessage : msg
        )
      );
      
      setGroupMessagesMap(prevMap => {
        const newMap = new Map(prevMap);
        const currentMessages = newMap.get(selectedGroup.group_id) || [];
        const updatedMessages = currentMessages.map(msg => 
          msg.messageId === editingMessage.messageId ? updatedMessage : msg
        );
        newMap.set(selectedGroup.group_id, updatedMessages);
        return newMap;
      });

      setNewMessage('');
      setEditingMessage(null);
      toast.success('Message updated successfully');
      return;
    }

    const tempId = `msg_${Date.now()}_${Math.random()}`;
    
    const tempMessage = {
        messageId: tempId,
        text: newMessage,
        senderUserName: currentUser?.name || 'You',
        senderId: currentUser?.id,
        timestamp: new Date().toISOString(),
        status: 'SENT',
        conversationId: selectedGroup.group_id,
        receiverId: selectedGroup.group_id,
        media: selectedFile ? {
          media_url: URL.createObjectURL(selectedFile),
          media_type: selectedFile.type.startsWith('image/') ? 'IMAGE' : 'FILE',
          mime_type: selectedFile.type,
          size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB`,
          filename: selectedFile.name
        } : null
      };
  
      setMessages(prevMessages => [...prevMessages, tempMessage]);
      
      setGroupMessagesMap(prevMap => {
        const newMap = new Map(prevMap);
        const currentMessages = newMap.get(selectedGroup.group_id) || [];
        newMap.set(selectedGroup.group_id, [...currentMessages, tempMessage]);
        return newMap;
      });
      
      setLastMessages(prevMap => {
        const newMap = new Map(prevMap);
        newMap.set(selectedGroup.group_id, tempMessage);
        return newMap;
      });
  
      setNewMessage('');
      removeSelectedFile();
  
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
  
      toast.success('Message sent!');
    };
  
    const sortedGroups = [...groups].sort((a, b) => {
      const lastMessageA = lastMessages.get(a.group_id);
      const lastMessageB = lastMessages.get(b.group_id);
      
      if (!lastMessageA && !lastMessageB) return 0;
      if (!lastMessageA) return 1;
      if (!lastMessageB) return -1;
      
      return new Date(lastMessageB.timestamp) - new Date(lastMessageA.timestamp);
    });
  
    const filteredGroups = sortedGroups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const getLastMessage = (groupId) => {
      const lastMsg = lastMessages.get(groupId);
      if (lastMsg && lastMsg.status === 'DELETED') {
        return { ...lastMsg, text: 'This message was deleted' };
      }
      return lastMsg || null;
    };
  
    const renderMessages = () => {
      if (!messages.length) return null;
  
      const renderedMessages = [];
  
      messages.forEach((message, index) => {
        if (message.status === 'DELETED' && hiddenDeletedMessages.has(message.messageId)) {
          return;
        }
  
        const previousMessage = index > 0 ? messages[index - 1] : null;
        const isOwn = message.senderId === currentUser?.id;
        
        if (needsDateSeparator(message, previousMessage)) {
          renderedMessages.push(
            <DateSeparator key={`date-${message.timestamp}`} timestamp={message.timestamp} />
          );
        }
  
        const shouldGroup = shouldGroupMessages(message, previousMessage);
        const showAvatar = !shouldGroup;
        const showSenderName = !isOwn && !shouldGroup;
  
        if (message.status === 'DELETED') {
          renderedMessages.push(
            <div key={message.messageId} data-message-id={message.messageId}>
              <DeletedMessage
                message={message}
                isOwn={isOwn}
                showAvatar={showAvatar}
                showSenderName={showSenderName}
                currentUser={currentUser}
                onRemoveDeleted={handleRemoveDeletedMessage}
              />
            </div>
          );
        } else {
          renderedMessages.push(
            <div key={message.messageId} data-message-id={message.messageId}>
              <ChatMessage
                message={message}
                isOwn={isOwn}
                showAvatar={showAvatar}
                showSenderName={showSenderName}
                currentUser={currentUser}
                onContextMenu={handleMessageContextMenu}
              />
            </div>
          );
        }
      });
  
      return renderedMessages;
    };
  
    return (
      <div className="h-[calc(100vh-112px)] flex bg-primary-scale-50 relative rounded-2xl border-2 border-primary/20">
        <div className={cn(
          "bg-white border-r border-primary/20 flex flex-col transition-all duration-300 rounded-l-2xl",
          isMobile 
            ? (showChatList ? "w-full" : "hidden") 
            : "w-80"
        )}>
          <div className="p-4 bg-gradient-primary-soft text-secondary border-b border-primary/20 rounded-tl-2xl">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-sm font-bold">Social Gems Chat</h1>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-secondary/10 rounded-full transition-colors">
                  <FiPlus className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-secondary/10 rounded-full transition-colors">
                  <FiMoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary/60 w-4 h-4" />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs text-secondary placeholder-secondary/60"
              />
            </div>
          </div>
  
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <ChatListItem
                  key={group.group_id}
                  group={group}
                  isActive={selectedGroup?.group_id === group.group_id}
                  onClick={handleGroupSelect}
                  lastMessage={getLastMessage(group.group_id)}
                  isLoadingMessages={false}
                />
              ))
            ) : (
              <div className="p-4 text-center text-secondary/60">
                <FiMessageCircle className="w-12 h-12 mx-auto mb-4 text-secondary/30" />
                <p className="text-xs">No groups found</p>
              </div>
            )}
          </div>
  
          <div className="p-3 border-t border-primary/20 bg-primary/5 rounded-bl-2xl">
            <p className="text-xs text-secondary/60 text-center">
              {groups.length} groups • {selectedGroup ? `${messages.length} messages` : 'Select a group to chat'}
            </p>
          </div>
        </div>
  
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 bg-white",
          isMobile && showChatList ? "hidden" : "flex"
        )}>
          {selectedGroup ? (
            <>
              <div className="p-4 bg-gradient-primary-soft text-secondary flex items-center justify-between border-b border-primary/20">
                <div className="flex items-center gap-3">
                  {isMobile && (
                    <button
                      onClick={handleBackToChatList}
                      className="p-2 hover:bg-secondary/10 rounded-full transition-colors mr-2"
                    >
                      <FiArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                  <div
                    className="w-8 h-8 rounded-full bg-cover bg-center border border-primary/30"
                    style={{
                      backgroundImage: selectedGroup.icon_image_url 
                        ? `url(${selectedGroup.icon_image_url})` 
                        : 'linear-gradient(135deg, #F9D769 0%, #E8C547 100%)'
                    }}
                  >
                    {!selectedGroup.icon_image_url && (
                      <div className="w-full h-full flex items-center justify-center rounded-full text-secondary text-xs font-bold">
                        {selectedGroup.name?.charAt(0)?.toUpperCase() || 'G'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xs font-semibold">{selectedGroup.name}</h2>
                    <p className="text-xs text-secondary/80">
                      {selectedGroup.members} members
                    </p>
                  </div>
                </div>
  
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-secondary/10 rounded-full transition-colors">
                    <FiInfo className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleCloseChat}
                    className="p-2 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                    title="Close Chat"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>
  
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 bg-white scrollbar-hide"
              >
                {messages.length > 0 ? (
                  <>
                    {renderMessages()}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-secondary/60">
                    <div className="text-center">
                      <IoChatbubblesSharp className="w-16 h-16 mx-auto mb-4 text-secondary/30" />
                      <p className="text-sm mb-2">No messages here yet...</p>
                      <p className="text-xs">Send a message to start the conversation</p>
                    </div>
                  </div>
                )}
              </div>
  
              {uploadingFile && (
                <UploadProgress
                  fileName={selectedFile?.name || 'File'}
                  progress={uploadProgress}
                  onCancel={() => {
                    setUploadingFile(false);
                    removeSelectedFile();
                  }}
                />
              )}
  
              {selectedFile && !uploadingFile && (
                <div className="px-4 py-2 border-t border-primary/10 bg-primary/5">
                  <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-primary/20">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      {selectedFile.type.startsWith('image/') ? (
                        <FiImage className="w-4 h-4 text-secondary" />
                      ) : (
                        <FiFile className="w-4 h-4 text-secondary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate text-secondary">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-secondary/60">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={removeSelectedFile}
                      className="p-1 hover:bg-secondary/10 rounded-full transition-colors"
                    >
                      <FiX className="w-3 h-3 text-secondary" />
                    </button>
                  </div>
                </div>
              )}
  
              {editingMessage && (
                <div className="px-4 py-2 border-t border-primary/10 bg-yellow-50">
                  <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-yellow/20">
                    <div className="flex items-center gap-2">
                      <FiEdit className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs text-secondary">Editing message</span>
                    </div>
                    <button
                      onClick={() => {
                        setEditingMessage(null);
                        setNewMessage('');
                      }}
                      className="p-1 hover:bg-secondary/10 rounded-full transition-colors"
                    >
                      <FiX className="w-3 h-3 text-secondary" />
                    </button>
                  </div>
                </div>
              )}
  
              <div className="p-4 bg-white border-t border-primary/20">
                <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                  <button
                    type="button"
                    onClick={handleFileSelect}
                    disabled={uploadingFile || editingMessage}
                    className="p-3 text-secondary/60 hover:text-secondary hover:bg-secondary/10 rounded-full transition-all duration-200 disabled:opacity-50"
                  >
                    <FiPaperclip className="w-4 h-4" />
                  </button>
  
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,video/*,.pdf,.docx,.doc,.txt"
                  />
  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={editingMessage ? "Edit your message..." : "Type a message..."}
                      className="w-full pl-4 pr-12 py-3 bg-white border border-primary/30 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-xs text-secondary placeholder-secondary/60"
                      maxLength={1000}
                      disabled={uploadingFile}
                    />
                    
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || uploadingFile}
                      className={cn(
                        "absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-200",
                        newMessage.trim() && !uploadingFile
                          ? "bg-secondary text-white hover:shadow-lg"
                          : "bg-secondary/20 text-secondary/40 cursor-not-allowed"
                      )}
                    >
                      {editingMessage ? (
                        <FiCheck className="w-4 h-4" />
                      ) : (
                        <IoSend className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-primary-soft rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <IoChatbubblesSharp className="w-10 h-10 text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-secondary mb-2">
                  Social Gems Chat
                </h3>
                <p className="text-xs text-secondary/70 max-w-md">
                  Connect with your team and collaborate seamlessly.<br />
                  Select a group from the sidebar to start chatting.
                </p>
              </div>
            </div>
          )}
        </div>
  
        <MessageContextMenu
          isOpen={contextMenu.isOpen}
          onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
          position={contextMenu.position}
          message={contextMenu.message}
          isOwn={contextMenu.message?.senderId === currentUser?.id}
          onEdit={handleEditMessage}
          onDelete={handleDeleteMessage}
          onCopy={handleCopyMessage}
          onReply={handleReplyMessage}
        />
      </div>
    );
  };
  
  export default Groups;