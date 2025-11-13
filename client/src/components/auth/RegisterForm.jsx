import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register } from '../../services/auth';
import { registerSchema } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import './authform.css';

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'customer'
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await register(values);
        loginSuccess({
          id: response.userId,
          username: response.username,
          email: response.email,
          role: response.role
        });
        toast.success('Registration successful!');
        navigate('/menu');
      } catch (error) {
        toast.error(error.message || 'Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="auth-form-container">
      <h2>Create an Account</h2>
      <form onSubmit={formik.handleSubmit} className="auth-form">
        <Input
          label="Username"
          id="username"
          name="username"
          type="text"
          placeholder="Choose a username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.username}
          touched={formik.touched.username}
          required
          autoComplete="username"
        />
        
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.email}
          touched={formik.touched.email}
          required
          autoComplete="email"
        />
        
        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.password}
          touched={formik.touched.password}
          required
          autoComplete="new-password"
        />
        
        <Input
          label="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.confirmPassword}
          touched={formik.touched.confirmPassword}
          required
          autoComplete="new-password"
        />
        
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Register'}
        </Button>
      </form>
      
      <div className="auth-links">
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;