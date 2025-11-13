import api from './api';

export const getKitchenOrders = () => {
  return api.get('/kitchen/active-orders');
};

export const updateOrderStatus = (orderId, status) => {
  return api.patch(`/kitchen/orders/${orderId}/status`, { status });
};

export const getTables = () => {
  return api.get('/staff/tables');
};

export const updateTableStatus = (tableId, status) => {
  return api.patch(`/staff/tables/${tableId}/status`, { status });
};

export const getActiveOrders = () => {
  return api.get('/staff/orders/active');
};

export const getOrderQueue = () => {
  return api.get('/kitchen/queue');
};

export const searchOrders = (params) => {
  return api.get('/staff/orders/search', { params });
};

export const getStats = () => {
  return api.get('/staff/stats');
};