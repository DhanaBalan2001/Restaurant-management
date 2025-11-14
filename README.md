# 🍽️ Fine Dine-in Restaurant Management System

<div align="center">

![Fine Dine-in Logo](client/src/assets/Fine%20Dine-in.png)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-brightgreen?style=for-the-badge&logo=netlify)](https://restaurant-management-dhanabalan.netlify.app)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real%20Time-black?style=for-the-badge&logo=socket.io)](https://socket.io/)

*A comprehensive, full-stack restaurant management solution with real-time features, AI-powered insights, and multi-role architecture*

</div>

## 🌟 Overview

Fine Dine-in is a cutting-edge restaurant management system that revolutionizes how restaurants operate. Built with modern technologies and featuring real-time capabilities, it provides a seamless experience for customers, staff, and administrators.

### ✨ Key Highlights

- 🚀 **Real-time Operations** - Live order tracking, kitchen displays, and instant notifications
- 🤖 **AI-Powered Analytics** - Machine learning insights for business optimization
- 💳 **Multi-Payment Gateway** - Stripe & Razorpay integration for global payments
- 📱 **Responsive Design** - Perfect experience across all devices
- 🔐 **Role-Based Access** - Secure multi-tier user management
- 🌐 **Multi-Branch Support** - Scalable for restaurant chains
- 📊 **Advanced Analytics** - Comprehensive reporting and insights

## 🎯 Features

### 👥 Multi-Role Architecture

#### 🛡️ Admin Dashboard
- **Analytics & Insights** - Revenue tracking, customer analytics, performance metrics
- **Menu Management** - Dynamic menu creation, pricing, categories
- **Staff Management** - Employee onboarding, role assignment, performance tracking
- **Branch Management** - Multi-location support and coordination
- **Inventory Control** - Stock management, supplier tracking, automated alerts
- **User Management** - Customer data, loyalty programs, feedback analysis

#### 👨‍🍳 Staff Portal
- **Kitchen Display System** - Real-time order management and preparation tracking
- **Order Processing** - Status updates, preparation time estimation
- **Table Management** - Seating arrangements, availability tracking
- **Real-time Notifications** - Instant alerts for new orders and updates

#### 🍽️ Customer Experience
- **Interactive Menu** - Beautiful, searchable menu with detailed descriptions
- **Smart Reservations** - Table booking with availability checking
- **Order Management** - Cart functionality, order tracking, history
- **Secure Payments** - Multiple payment options with secure processing
- **Loyalty Program** - Points system and rewards tracking

### 🔧 Technical Features

#### 🌐 Real-time Communication
- **Socket.io Integration** - Live updates across all user roles
- **Push Notifications** - Instant alerts for orders, reservations, and updates
- **Live Order Tracking** - Real-time status updates from kitchen to customer

#### 🤖 AI & Machine Learning
- **TensorFlow.js Integration** - Predictive analytics and insights
- **Demand Forecasting** - AI-powered inventory and staffing predictions
- **Customer Behavior Analysis** - Personalized recommendations

#### 💰 Payment Processing
- **Stripe Integration** - International payment processing
- **Razorpay Support** - Local payment gateway for Indian market
- **Secure Transactions** - PCI-compliant payment handling

#### 📊 Advanced Analytics
- **Revenue Analytics** - Detailed financial reporting and trends
- **Customer Insights** - Behavior analysis and segmentation
- **Performance Metrics** - Staff efficiency and restaurant KPIs
- **Interactive Charts** - Visual data representation with custom charts

## 🛠️ Technology Stack

### Frontend
```
⚛️  React 19.0.0          - Modern UI library with latest features
🎨  CSS3 & Flexbox        - Responsive, modern styling
🧭  React Router DOM      - Client-side routing
📝  Formik & Yup          - Form handling and validation
🎯  React Icons           - Beautiful icon library
🔔  React Toastify        - Elegant notifications
📅  React DatePicker      - Date/time selection components
⚡  Vite                  - Lightning-fast build tool
🎨  React Spinners        - Loading animations
```

### Backend
```
🚀  Node.js & Express     - High-performance server
🍃  MongoDB & Mongoose    - NoSQL database with ODM
🔐  JWT & Bcrypt          - Secure authentication
🌐  Socket.io             - Real-time communication
📧  Nodemailer            - Email service integration
🤖  TensorFlow.js         - Machine learning capabilities
💳  Stripe & Razorpay     - Payment processing
📝  Swagger               - API documentation
🧪  Jest & Supertest      - Testing framework
📊  Winston               - Advanced logging
```

### DevOps & Deployment
```
🌐  Netlify              - Frontend deployment
☁️   Cloud Hosting        - Backend deployment
🔄  Git & GitHub          - Version control
📦  npm                   - Package management
🔧  ESLint                - Code quality
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/restaurant-management.git
cd restaurant-management
```

2. **Backend Setup**
```bash
cd server
npm install
```

3. **Environment Configuration**
```bash
# Create .env file in server directory
MONGODB=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
PORT=5000
```

4. **Frontend Setup**
```bash
cd ../client
npm install
```

5. **Start Development Servers**
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

6. **Access the Application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 📱 Screenshots & Demo

### 🏠 Homepage
Beautiful landing page with restaurant branding and easy navigation

### 📋 Menu Management
Intuitive admin interface for managing menu items, categories, and pricing

### 👨‍🍳 Kitchen Display
Real-time order management system for kitchen staff

### 📊 Analytics Dashboard
Comprehensive analytics with interactive charts and insights

### 💳 Payment Integration
Secure payment processing with multiple gateway support

## 🏗️ Architecture

### Frontend Architecture
```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── staff/          # Staff portal components
│   ├── customer/       # Customer-facing components
│   └── common/         # Shared components
├── pages/              # Route-based page components
├── services/           # API integration services
├── context/            # React Context providers
├── hooks/              # Custom React hooks
└── utils/              # Utility functions
```

### Backend Architecture
```
server/
├── controllers/        # Business logic handlers
├── models/            # MongoDB schemas
├── routes/            # API route definitions
├── services/          # External service integrations
├── middleware/        # Custom middleware
└── utils/             # Helper functions
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Multi-tier permission system
- **Password Encryption** - Bcrypt hashing for secure password storage
- **Input Validation** - Comprehensive data validation with Joi
- **CORS Protection** - Cross-origin request security
- **Rate Limiting** - API abuse prevention
- **SQL Injection Prevention** - MongoDB injection protection

## 📈 Performance Optimizations

- **Code Splitting** - Lazy loading for optimal bundle sizes
- **Image Optimization** - Compressed assets for faster loading
- **Caching Strategies** - Efficient data caching mechanisms
- **Database Indexing** - Optimized MongoDB queries
- **Real-time Updates** - Efficient Socket.io event handling

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests (if configured)
cd client
npm test
```

## 📚 API Documentation

The API is fully documented using Swagger. Access the interactive documentation at:
`http://localhost:5000/api-docs`

### Key Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/menu` - Fetch menu items
- `POST /api/orders` - Create new order
- `GET /api/reservations` - Fetch reservations
- `POST /api/payments/stripe` - Process Stripe payment

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Dhanabalan**
- GitHub: [@DhanaBalan](https://github.com/DhanaBalan2001)

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the flexible database solution
- Stripe & Razorpay for payment processing
- Socket.io for real-time capabilities
- All open-source contributors

## 📞 Support

For support, email support@finedine.com or join our Slack channel.

---

<div align="center">

**⭐ Star this repository if you found it helpful! ⭐**

Made with ❤️ by [Dhanabalan](https://github.com/yourusername)

</div>
