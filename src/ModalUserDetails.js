import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import UserRatingsCard from "./UserRatingsCard";

const ModalUserDetails = ({ userId, isOpen }) => {
  const [details, setDetails] = useState([]);
  const [displayedDetails, setDisplayedDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [itemCount, setItemCount] = useState(10); // Initial number of items to display

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      fetch("/data/movies.json")
        .then((res) => res.json())
        .then((movies) => {
          fetch("/data/ratings.json")
            .then((res) => res.json())
            .then((ratings) => {
              const userRatings = ratings[userId] || [];
              const sortedRatings = userRatings.sort((a, b) => b[2] - a[2]);
              const combinedDetails = sortedRatings.map((rating) => ({
                ...rating,
                movieDetails: movies[rating[0]],
              }));
              setDetails(combinedDetails);
              setDisplayedDetails(combinedDetails.slice(0, itemCount));
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching ratings:", error);
              setError("Failed to load data!");
              setLoading(false);
            });
        })
        .catch((error) => {
          console.error("Error fetching movies:", error);
          setError("Failed to load data!");
          setLoading(false);
        });
    }
  }, [userId, isOpen, itemCount]);

  const handleScroll = (event) => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
    if (bottom) {
      setItemCount((prevItemCount) => prevItemCount + 10); // Load 10 more items
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        overflowY: "auto",
        height: "70vh",
        onScroll: handleScroll,
      }}
    >
      <Typography variant="h6">User Ratings</Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : displayedDetails.length > 0 ? (
        displayedDetails.map((detail, index) => (
          <UserRatingsCard key={index} detail={detail} />
        ))
      ) : (
        <Typography>No ratings available.</Typography>
      )}
    </Box>
  );
};

export default ModalUserDetails;
