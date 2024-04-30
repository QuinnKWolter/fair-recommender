import React from "react";
import movieIcon from "./images/movie-icon.png";
import "./App.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

const RatingStars = ({ rating }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = totalStars - fullStars - hasHalfStar;

  return (
    <div className="rating-stars">
      {Array(fullStars).fill().map((_, i) => (
        <i key={`full-${i}`} className="bi bi-star-fill"></i>  // Full star icon
      ))}
      {hasHalfStar > 0 && (
        <i key="half-1" className="bi bi-star-half"></i>  // Half star icon
      )}
      {Array(emptyStars).fill().map((_, i) => (
        <i key={`empty-${i}`} className="bi bi-star"></i>  // Empty star icon
      ))}
    </div>
  );
};

const UserRatingsCard = ({ rating }) => {
  return (
    <div className="user-card" style={{ maxWidth: '400px' }}>
      <div className="user-info">
        <img src={movieIcon} alt="Movie Icon" className="movie-icon" />
        <div className="rating-details">
          <p><strong>User ID:</strong> {rating.userId}</p>
          <p><strong>Movie ID:</strong> {rating.movieId}</p>
          <p>
            <strong>Rating:</strong> 
            <RatingStars rating={parseFloat(rating.rating)} />
          </p>
          <p><strong>Date:</strong> {new Date(parseInt(rating.timestamp) * 1000).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default UserRatingsCard;