import React from 'react';
import ReservationForm from '../../components/reservation/ReservationForm';
import '../../assets/styles/createreservationpage.css';

const CreateReservationPage = () => {
  return (
    <div className="create-reservation-page">
      <div className="create-reservation-header">
        <h1>Make a Reservation</h1>
      </div>
      <div className="create-reservation-content">
        <ReservationForm />
      </div>
    </div>
  );
};

export default CreateReservationPage;
