import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import RegisterForm from '../../components/auth/RegisterForm';
import './authpage.css';
import logoImage from '../../assets/Fine Dine-in.png'

const RegisterPage = () => {
  const { isAuth } = useAuth();

  // Redirect if already logged in
  if (isAuth) {
    return <Navigate to="/menu" />;
  }

  return (
    <div className="auth-page container-fluid">
      <div className="auth-container row justify-content-center align-items-center">
        <div className="auth-content col-12 col-md-8 col-lg-6">
          <div className="auth-logo text-center">
            <img src={logoImage} alt="Restaurant Logo" className="img-fluid" />
            <h1 className="mt-3">Fine Dine-In</h1>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;