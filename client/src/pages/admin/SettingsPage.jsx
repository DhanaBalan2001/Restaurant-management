import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
// import api from '../../services/api';
import '../../assets/styles/settingspage.css';

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    restaurantInfo: {
      name: 'Restaurant Name',
      address: '123 Main St, City, Country',
      phone: '+1 (123) 456-7890',
      email: 'contact@restaurant.com',
      openingHours: {
        monday: { open: '09:00', close: '22:00', closed: false },
        tuesday: { open: '09:00', close: '22:00', closed: false },
        wednesday: { open: '09:00', close: '22:00', closed: false },
        thursday: { open: '09:00', close: '22:00', closed: false },
        friday: { open: '09:00', close: '23:00', closed: false },
        saturday: { open: '10:00', close: '23:00', closed: false },
        sunday: { open: '10:00', close: '22:00', closed: false }
      },
      logo: '',
      description: 'A fine dining restaurant serving delicious meals.'
    },
    reservations: {
      enabled: true,
      maxPartySize: 10,
      minAdvanceHours: 2,
      maxAdvanceDays: 30,
      timeSlotInterval: 30, // in minutes
      autoConfirm: false
    },
    orders: {
      enabled: true,
      deliveryEnabled: true,
      takeoutEnabled: true,
      minOrderAmount: 10,
      deliveryFee: 5,
      deliveryMinimum: 15,
      estimatedDeliveryTime: 45, // in minutes
      estimatedPickupTime: 20 // in minutes
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      newOrderNotifications: true,
      reservationNotifications: true,
      lowInventoryNotifications: true
    },
    taxes: {
      taxRate: 10, // percentage
      includeTaxInPrice: false
    }
  });
  const [activeTab, setActiveTab] = useState('restaurantInfo');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // In a real app, you would fetch settings from your API
      // const response = await api.get('/admin/settings');
      // setSettings(response.data);
      
      // For now, we'll just use the default settings
      setLoading(false);
    } catch (err) {
      setError('Failed to load settings');
      setLoading(false);
      toast.error('Failed to load settings');
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, parent, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...prev[section][parent],
          [field]: value
        }
      }
    }));
  };

  const handleOpeningHoursChange = (day, field, value) => {
    setSettings(prev => ({
      ...prev,
      restaurantInfo: {
        ...prev.restaurantInfo,
        openingHours: {
          ...prev.restaurantInfo.openingHours,
          [day]: {
            ...prev.restaurantInfo.openingHours[day],
            [field]: field === 'closed' ? !prev.restaurantInfo.openingHours[day].closed : value
          }
        }
      }
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // In a real app, you would save settings to your API
      // await api.put('/admin/settings', settings);
      
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-page loading">
        <div className="spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="settings-page error">
        <p>{error}</p>
        <button onClick={fetchSettings} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h2>Settings</h2>
        <button 
          className="save-settings-btn"
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
      
      <div className="settings-container">
        <div className="settings-tabs">
          <button 
            className={`tab-btn ${activeTab === 'restaurantInfo' ? 'active' : ''}`}
            onClick={() => setActiveTab('restaurantInfo')}
          >
            Restaurant Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            Reservations
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button 
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button 
            className={`tab-btn ${activeTab === 'taxes' ? 'active' : ''}`}
            onClick={() => setActiveTab('taxes')}
          >
            Taxes
          </button>
        </div>
        
        <div className="settings-content">
          {activeTab === 'restaurantInfo' && (
            <div className="settings-section">
              <h3>Restaurant Information</h3>
              
              <div className="form-group">
                <label htmlFor="restaurantName">Restaurant Name</label>
                <input
                  type="text"
                  id="restaurantName"
                  value={settings.restaurantInfo.name}
                  onChange={(e) => handleInputChange('restaurantInfo', 'name', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="restaurantAddress">Address</label>
                <textarea
                  id="restaurantAddress"
                  value={settings.restaurantInfo.address}
                  onChange={(e) => handleInputChange('restaurantInfo', 'address', e.target.value)}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="restaurantPhone">Phone</label>
                  <input
                    type="tel"
                    id="restaurantPhone"
                    value={settings.restaurantInfo.phone}
                    onChange={(e) => handleInputChange('restaurantInfo', 'phone', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="restaurantEmail">Email</label>
                  <input
                    type="email"
                    id="restaurantEmail"
                    value={settings.restaurantInfo.email}
                    onChange={(e) => handleInputChange('restaurantInfo', 'email', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="restaurantDescription">Description</label>
                <textarea
                  id="restaurantDescription"
                  value={settings.restaurantInfo.description}
                  onChange={(e) => handleInputChange('restaurantInfo', 'description', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="restaurantLogo">Logo URL</label>
                <input
                  type="text"
                  id="restaurantLogo"
                  value={settings.restaurantInfo.logo}
                  onChange={(e) => handleInputChange('restaurantInfo', 'logo', e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              
              <h4>Opening Hours</h4>
              <div className="opening-hours">
                {Object.entries(settings.restaurantInfo.openingHours).map(([day, hours]) => (
                  <div key={day} className="opening-hours-row">
                    <div className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                    <div className="hours-inputs">
                      <label className="closed-checkbox">
                        <input
                          type="checkbox"
                          checked={hours.closed}
                          onChange={() => handleOpeningHoursChange(day, 'closed')}
                        />
                        <span>Closed</span>
                      </label>
                      
                      {!hours.closed && (
                        <>
                          <div className="time-input">
                            <label>Open</label>
                            <input
                              type="time"
                              value={hours.open}
                              onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                              disabled={hours.closed}
                            />
                          </div>
                          <div className="time-input">
                            <label>Close</label>
                            <input
                              type="time"
                              value={hours.close}
                              onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                              disabled={hours.closed}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'reservations' && (
            <div className="settings-section">
              <h3>Reservation Settings</h3>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.reservations.enabled}
                    onChange={(e) => handleInputChange('reservations', 'enabled', e.target.checked)}
                  />
                  Enable Reservations
                </label>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="maxPartySize">Maximum Party Size</label>
                  <input
                    type="number"
                    id="maxPartySize"
                    min="1"
                    value={settings.reservations.maxPartySize}
                    onChange={(e) => handleInputChange('reservations', 'maxPartySize', parseInt(e.target.value))}
                    disabled={!settings.reservations.enabled}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="timeSlotInterval">Time Slot Interval (minutes)</label>
                  <select
                    id="timeSlotInterval"
                    value={settings.reservations.timeSlotInterval}
                    onChange={(e) => handleInputChange('reservations', 'timeSlotInterval', parseInt(e.target.value))}
                    disabled={!settings.reservations.enabled}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="minAdvanceHours">Minimum Advance Hours</label>
                  <input
                    type="number"
                    id="minAdvanceHours"
                    min="0"
                    value={settings.reservations.minAdvanceHours}
                    onChange={(e) => handleInputChange('reservations', 'minAdvanceHours', parseInt(e.target.value))}
                    disabled={!settings.reservations.enabled}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="maxAdvanceDays">Maximum Advance Days</label>
                  <input
                    type="number"
                    id="maxAdvanceDays"
                    min="1"
                    value={settings.reservations.maxAdvanceDays}
                    onChange={(e) => handleInputChange('reservations', 'maxAdvanceDays', parseInt(e.target.value))}
                    disabled={!settings.reservations.enabled}
                  />
                </div>
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.reservations.autoConfirm}
                    onChange={(e) => handleInputChange('reservations', 'autoConfirm', e.target.checked)}
                    disabled={!settings.reservations.enabled}
                  />
                  Auto-confirm Reservations
                </label>
              </div>
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div className="settings-section">
              <h3>Order Settings</h3>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.orders.enabled}
                    onChange={(e) => handleInputChange('orders', 'enabled', e.target.checked)}
                  />
                  Enable Online Orders
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.orders.deliveryEnabled}
                    onChange={(e) => handleInputChange('orders', 'deliveryEnabled', e.target.checked)}
                    disabled={!settings.orders.enabled}
                  />
                  Enable Delivery
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.orders.takeoutEnabled}
                    onChange={(e) => handleInputChange('orders', 'takeoutEnabled', e.target.checked)}
                    disabled={!settings.orders.enabled}
                  />
                  Enable Takeout
                </label>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="minOrderAmount">Minimum Order Amount ($)</label>
                  <input
                    type="number"
                    id="minOrderAmount"
                    min="0"
                    step="0.01"
                    value={settings.orders.minOrderAmount}
                    onChange={(e) => handleInputChange('orders', 'minOrderAmount', parseFloat(e.target.value))}
                    disabled={!settings.orders.enabled}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="deliveryFee">Delivery Fee ($)</label>
                  <input
                    type="number"
                    id="deliveryFee"
                    min="0"
                    step="0.01"
                    value={settings.orders.deliveryFee}
                    onChange={(e) => handleInputChange('orders', 'deliveryFee', parseFloat(e.target.value))}
                    disabled={!settings.orders.enabled || !settings.orders.deliveryEnabled}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="deliveryMinimum">Delivery Minimum ($)</label>
                  <input
                    type="number"
                    id="deliveryMinimum"
                    min="0"
                    step="0.01"
                    value={settings.orders.deliveryMinimum}
                    onChange={(e) => handleInputChange('orders', 'deliveryMinimum', parseFloat(e.target.value))}
                    disabled={!settings.orders.enabled || !settings.orders.deliveryEnabled}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="estimatedDeliveryTime">Estimated Delivery Time (minutes)</label>
                  <input
                    type="number"
                    id="estimatedDeliveryTime"
                    min="0"
                    value={settings.orders.estimatedDeliveryTime}
                    onChange={(e) => handleInputChange('orders', 'estimatedDeliveryTime', parseInt(e.target.value))}
                    disabled={!settings.orders.enabled || !settings.orders.deliveryEnabled}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="estimatedPickupTime">Estimated Pickup Time (minutes)</label>
                <input
                  type="number"
                  id="estimatedPickupTime"
                  min="0"
                  value={settings.orders.estimatedPickupTime}
                  onChange={(e) => handleInputChange('orders', 'estimatedPickupTime', parseInt(e.target.value))}
                  disabled={!settings.orders.enabled || !settings.orders.takeoutEnabled}
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Settings</h3>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                  />
                  Enable Email Notifications
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.smsNotifications}
                    onChange={(e) => handleInputChange('notifications', 'smsNotifications', e.target.checked)}
                  />
                  Enable SMS Notifications
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.newOrderNotifications}
                    onChange={(e) => handleInputChange('notifications', 'newOrderNotifications', e.target.checked)}
                  />
                  New Order Notifications
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.reservationNotifications}
                    onChange={(e) => handleInputChange('notifications', 'reservationNotifications', e.target.checked)}
                  />
                  Reservation Notifications
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.lowInventoryNotifications}
                    onChange={(e) => handleInputChange('notifications', 'lowInventoryNotifications', e.target.checked)}
                  />
                  Low Inventory Notifications
                </label>
              </div>
            </div>
          )}

          {activeTab === 'taxes' && (
            <div className="settings-section">
              <h3>Tax Settings</h3>
              
              <div className="form-group">
                <label htmlFor="taxRate">Tax Rate (%)</label>
                <input
                  type="number"
                  id="taxRate"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.taxes.taxRate}
                  onChange={(e) => handleInputChange('taxes', 'taxRate', parseFloat(e.target.value))}
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.taxes.includeTaxInPrice}
                    onChange={(e) => handleInputChange('taxes', 'includeTaxInPrice', e.target.checked)}
                  />
                  Include Tax in Displayed Prices
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;