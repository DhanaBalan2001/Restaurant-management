import React from 'react';
import { FaChartLine, FaCalendar, FaUtensils, FaMoneyBillWave } from 'react-icons/fa';

const DashboardCard = ({ title, value, icon, trend }) => {
  const getIcon = () => {
    switch(icon) {
      case 'money': return <FaMoneyBillWave />;
      case 'chart': return <FaChartLine />;
      case 'calendar': return <FaCalendar />;
      case 'orders': return <FaUtensils />;
      default: return null;
    }
  };

  return (
    <div className="dashboard-card">
      <div className="card-icon">{getIcon()}</div>
      <div className="card-content">
        <h3>{title}</h3>
        <p className="value">{value}</p>
        {trend && <span className={`trend ${trend > 0 ? 'up' : 'down'}`}>
          {trend}%
        </span>}
      </div>
    </div>
  );
};

export default DashboardCard;
