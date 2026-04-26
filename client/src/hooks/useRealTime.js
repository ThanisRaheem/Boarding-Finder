import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useRealTime = (userId, token) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [bookingUpdates, setBookingUpdates] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!userId || !token) return;

    const newSocket = io('/', {
      auth: {
        userId,
        token
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnectionStatus('connected');
      setSocket(newSocket);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnectionStatus('disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionStatus('error');
    });

    // Notification handlers
    newSocket.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
      
      // Show browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification(notification.message, {
          icon: '/favicon.ico',
          body: notification.type,
          tag: notification.bookingId
        });
      }
    });

    // Booking status updates
    newSocket.on('booking:status', (update) => {
      setBookingUpdates(prev => [update, ...prev.slice(0, 4)]);
    });

    // Chat messages
    newSocket.on('chat:message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Join user room
    newSocket.emit('join:user', userId);

    return () => {
      newSocket.close();
    };
  }, [userId, token]);

  const joinBookingRoom = (bookingId) => {
    if (socket && bookingId) {
      socket.emit('join:booking', bookingId);
    }
  };

  const leaveBookingRoom = (bookingId) => {
    if (socket && bookingId) {
      socket.emit('leave:booking', bookingId);
    }
  };

  const sendMessage = (bookingId, text) => {
    if (socket && bookingId && text) {
      socket.emit('chat:message', { bookingId, text });
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markNotificationRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  return {
    socket,
    connectionStatus,
    notifications,
    bookingUpdates,
    messages,
    joinBookingRoom,
    leaveBookingRoom,
    sendMessage,
    clearNotifications,
    markNotificationRead
  };
};

export default useRealTime;
