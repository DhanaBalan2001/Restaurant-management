import React from 'react';
import { useStaff } from '../../context/StaffContext';
import './staffnotifications.css';

const StaffNotifications = () => {
  const { notifications, removeNotification } = useStaff();

  return (
    <div className="staff-notifications">
      {notifications.map(notification => (
        <div key={notification.id} className="notification">
          <span>{notification.message}</span>
          <button onClick={() => removeNotification(notification.id)}>×</button>
        </div>
      ))}
    </div>
  );
};

export default StaffNotifications;
