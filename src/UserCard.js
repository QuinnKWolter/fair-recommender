import React from 'react';
import personIcon from './images/person-icon.png'; // Import the person image icon
import './modalcompareusers.css';

const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <div className="user-info">
        <img src={personIcon} alt="Person Icon" className="person-icon" />
        <div className="user-details">
          <p><strong>User ID:</strong> {user.userID}</p>
          <p><strong>Gender:</strong> {user.gender}</p>
          <p><strong>Age:</strong> {user.age}</p>
          <p><strong>Occupation:</strong> {user.occupation}</p>
          <p><strong>Zip Code:</strong> {user.zip_code}</p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
