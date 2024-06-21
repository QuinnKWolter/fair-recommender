import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import UserRatingsCard from "./UserRatingsCard";
import UserCard from "./UserCard"; // Import the UserCard component

const ModalUserDetails = ({ userId, users }) => {
  const [details, setDetails] = useState(null);
  const [displayedDetails, setDisplayedDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [itemCount, setItemCount] = useState(10); // Initial number of items to display

  useEffect(() => {
    if (userId) {
      setLoading(true);
      const user = users.find((user) => user.userID === userId);
      if (user) {
        setDetails(user);
        setLoading(false);
      } else {
        setError("User not found");
        setLoading(false);
      }
    }
  }, [userId, users]);

  const handleScroll = (event) => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
    if (bottom) {
      setItemCount((prevItemCount) => prevItemCount + 10); // Load 10 more items
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box
      className="user-details-box"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start", // Change from "center" to "flex-start"
        gap: 2,
        overflowY: "auto",
        width: "100%", // Ensure it takes the full width of the parent
        height: "100%", // Ensure height to fill the parent container
      }}
      onScroll={handleScroll}
    >
      {details && (
        <>
          <UserCard user={details} /> {/* Display the UserCard at the top */}

          <Typography variant="h6">Recent Interactions</Typography>
          {displayedDetails.length > 0 ? (
            displayedDetails.map((detail, index) => (
              <UserRatingsCard key={index} detail={detail} />
            ))
          ) : (
            <Typography>No ratings available.</Typography>
          )}

          <Typography variant="h6">My Recommendations</Typography>
          {/* Render recommendations here */}
          {/* Example recommendations rendering */}
          {details.recommendations && details.recommendations.map((rec, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
              <Typography sx={{ minWidth: 100 }}>{rec.genre}</Typography>
              <Box sx={{ width: '100%', height: 10, bgcolor: 'gray', marginLeft: 1, borderRadius: 1, overflow: 'hidden' }}>
                <Box sx={{ width: `${rec.percentage}%`, height: '100%', bgcolor: rec.color }}></Box>
              </Box>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
};

export default ModalUserDetails;
