import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../../services/auth';
import { loginSchema } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import './authform.css';

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await login(values);
        loginSuccess({
          id: response.userId,
          username: response.username,
          email: response.email,
          role: response.role
        });
        toast.success('Login successful!');
        
        // Redirect based on role
        if (response.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (response.role === 'staff') {
          navigate('/staff/dashboard');
        } else {
          navigate('/menu');
        }
      } catch (error) {
        toast.error(error.message || 'Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="auth-form-container">
      <h2>Login to Your Account</h2>
      <form onSubmit={formik.handleSubmit} className="auth-form">
        <Input
          label="Username"
          id="username"
          name="username"
          type="text"
          placeholder="Enter your username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.username}
          touched={formik.touched.username}
          required
          autoComplete="username"
        />
        
        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.password}
          touched={formik.touched.password}
          required
          autoComplete="current-password"
        />
        
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      
      <div className="auth-links">
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;