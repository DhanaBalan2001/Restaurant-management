import React, { createContext, useState, useContext, useEffect } from 'react';
import { socket } from '../services/socket';

const StaffContext = createContext();

export const StaffProvider = ({ children }) => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on('new_order', handleNewOrder);
    socket.on('order_update', handleOrderUpdate);
    socket.on('table_update', handleTableUpdate);

    return () => {
      socket.off('new_order');
      socket.off('order_update');
      socket.off('table_update');
    };
  }, []);

  const handleNewOrder = (order) => {
    setActiveOrders(prev => [...prev, order]);
    addNotification(`New order received: #${order.orderNumber}`);
  };

  const handleOrderUpdate = (update) => {
    setActiveOrders(prev => 
      prev.map(order => 
        order._id === update.orderId 
          ? { ...order, status: update.status }
          : order
      )
    );
  };

  const handleTableUpdate = (update) => {
    setTables(prev =>
      prev.map(table =>
        table._id === update.tableId
          ? { ...table, status: update.status }
          : table
      )
    );
  };

  const addNotification = (message) => {
    setNotifications(prev => [...prev, { id: Date.now(), message }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <StaffContext.Provider value={{
      activeOrders,
      tables,
      notifications,
      removeNotification
    }}>
      {children}
    </StaffContext.Provider>
  );
};

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
};
