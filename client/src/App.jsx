import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { StaffProvider } from './context/StaffContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/layout/Navbar';
import AdminLayout from './components/admin/AdminLayout';
import StaffLayout from './components/staff/StaffLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MenuPage from './pages/menu/MenuPage';
import CheckoutPage from './pages/checkout/CheckOutPage';
import OrderConfirmationPage from './pages/checkout/OrderConfirmationPage';
import OrdersPage from './pages/orders/OrdersPage';
import OrderDetailPage from './pages/orders/OrderDetailPage';
import CreateReservationPage from './pages/reservation/CreateReservationPage';
import ReservationsPage from './pages/reservation/ReservationsPage';
import ReservationDetailPage from './pages/reservation/ReservationDetailPage';
import ReservationConfirmationPage from './pages/reservation/ReservationConfirmationPage';

// Payment Pages
import PaymentPage from './pages/payment/PaymentPage';
import PaymentSuccessPage from './pages/payment/PaymentSuccessPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import MenuManagementPage from './pages/admin/MenuManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import ReservationManagementPage from './pages/admin/ReservationManagementPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import SettingsPage from './pages/admin/SettingsPage';

// Staff Pages
import StaffDashboardPage from './pages/staff/StaffDashboardPage';
import KitchenDisplayPage from './pages/staff/KitchenDisplayPage';
import OrderProcessingPage from './pages/staff/OrderProcessingPage';
import TableManagementPage from './pages/staff/TableManagementPage';
import StaffNotifications from './components/staff/StaffNotifications';

import NotFoundPage from './pages/NotFoundPage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuth, user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <StaffProvider>
        <Router>
          <div className="app">
            <Routes>
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="menu" element={<MenuManagementPage />} />
                <Route path="orders" element={<OrderManagementPage />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="reservations" element={<ReservationManagementPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Staff Routes */}
              <Route
                path="/staff"
                element={
                  <ProtectedRoute allowedRoles={['staff']}>
                    <StaffLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/staff/dashboard" />} />
                <Route path="dashboard" element={<StaffDashboardPage />} />
                <Route path="kitchen" element={<KitchenDisplayPage />} />
                <Route path="orders" element={<OrderProcessingPage />} />
                <Route path="tables" element={<TableManagementPage />} />
              </Route>

              {/* Public Routes with Navbar */}
              <Route path="/" element={<><Navbar /><HomePage /></>} />
              <Route path="/login" element={<><Navbar /><LoginPage /></>} />
              <Route path="/register" element={<><Navbar /><RegisterPage /></>} />
              <Route path="/menu" element={<><Navbar /><MenuPage /></>} />

              {/* Payment Routes */}
              <Route 
                path="/payment/:reservationId" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <><Navbar /><PaymentPage /></>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/payment/success" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <><Navbar /><PaymentSuccessPage /></>
                  </ProtectedRoute>
                } 
              />

              {/* Protected Customer Routes */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <><Navbar /><CheckoutPage /></>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-confirmation"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <><Navbar /><OrderConfirmationPage /></>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <><Navbar /><OrdersPage /></>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <><Navbar /><OrderDetailPage /></>
                  </ProtectedRoute>
                }
              />

              {/* Reservation Routes */}
              <Route
                path="/reservations/create"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <><Navbar /><CreateReservationPage /></>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reservations"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <><Navbar /><ReservationsPage /></>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reservations/:id"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <><Navbar /><ReservationDetailPage /></>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reservations/confirmation"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <><Navbar /><ReservationConfirmationPage /></>
                  </ProtectedRoute>
                }
              />

              {/* 404 Page */}
              <Route path="*" element={<><Navbar /><NotFoundPage /></>} />
            </Routes>

            <StaffNotifications />

            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </StaffProvider>
    </AuthProvider>
  );
};

export default App;
