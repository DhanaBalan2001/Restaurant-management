import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const socket = io('https://restaurant-management-backend-5s96.onrender.com', {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('token')
      }
    });

    socket.on('connect', () => {
      console.log('Connected to notification system');
      const branchId = localStorage.getItem('branchId');
      if (branchId) {
        socket.emit('joinKitchen', branchId);
      }
    });

    socket.on('newOrder', (order) => {
      addNotification({
        type: 'order',
        message: `New order #${order.orderId} received`,
        time: new Date()
      });
    });

    socket.on('orderStatusChanged', (update) => {
      addNotification({
        type: 'status',
        message: `Order #${update.orderId} status changed to ${update.status}`,
        time: new Date()
      });
    });

    socket.on('lowStock', (item) => {
      addNotification({
        type: 'warning',
        message: `Low stock alert: ${item.name} (${item.quantity} remaining)`,
        time: new Date()
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!isOpen) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  return (
    <div className="notification-center">
      <button className="notification-toggle" onClick={handleOpen}>
        Notifications
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div key={index} className={`notification ${notification.type}`}>
                  <p>{notification.message}</p>
                  <small>{new Date(notification.time).toLocaleTimeString()}</small>
                </div>
              ))
            ) : (
              <p className="no-notifications">No new notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
