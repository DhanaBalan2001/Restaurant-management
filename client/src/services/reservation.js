import api from './api';

export const getAvailableTimeSlots = async (date, guestCount) => {
  try {
    const response = await api.get('/reservations/available-slots', {
      params: { date, guestCount }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch available time slots' };
  }
};

export const createReservation = async (reservationData) => {   
  return api.post('/reservations/create', {     
    date: reservationData.date,     
    timeSlot: reservationData.timeSlot,     
    guestCount: parseInt(reservationData.guestCount),     
    customerName: reservationData.customerName,     
    customerEmail: reservationData.customerEmail,     
    customerPhone: reservationData.customerPhone,     
    specialRequests: reservationData.specialRequests, 
    table: reservationData.table  
  }); 
};

export const getCustomerReservations = async () => {
  try {
    const response = await api.get('/customer/reservations');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch reservations' };
  }
};

export const cancelReservation = async (reservationId) => {
  try {
    const response = await api.patch(`/reservations/${reservationId}/status`, {
      status: 'cancelled'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to cancel reservation' };
  }
};