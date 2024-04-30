import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import RangeSlider from "./RangeSlider";
import UserCard from "./UserCard";
import UserRatingsCard from "./UserRatingsCard";


const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Adventure" },
  { id: 3, name: "Animation" },
  { id: 4, name: "Children" },
  { id: 5, name: "Comedy" },
  { id: 6, name: "Crime" },
  { id: 7, name: "Documentary" },
  { id: 8, name: "Drama" },
  { id: 9, name: "Fantasy" },
  { id: 10, name: "Film-Noir" },
  { id: 11, name: "Horror" },
  { id: 12, name: "I-MAX" },
  { id: 13, name: "Musical" },
  { id: 14, name: "Mystery" },
  { id: 15, name: "Romance" },
  { id: 16, name: "Sci-Fi" },
  { id: 17, name: "Thriller" },
  { id: 18, name: "War" },
  { id: 19, name: "Western" },
];

const users = [
  { userID: "1", gender: "F", age: "1", occupation: "10", zip_code: "48067" },
];

const userRatings = {
  "1": [
    ["1193", "5", "978300760"],
    ["661", "3.5", "978302109"],
    ["914", "3", "978301968"],
  ],
};


function ModalUserDetails() {
  const [values, setValues] = useState({});
  const user = users[0];

  const handleChange = (genreId, newValue) => {
    setValues((prevState) => ({
      ...prevState,
      [genreId]: newValue,
    }));
  };

  // Sort the ratings by timestamp in descending order before rendering
  const validRatings = userRatings[user.userID] || [];
  validRatings.sort((a, b) => b[2] - a[2]); // Sort by the third element (timestamp)

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "start",
        padding: "20px",
        gap: "20px",
        overflow: "auto",
        maxHeight: "90vh",
      }}
    >
      <Box sx={{ maxWidth: 300 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          {`User ${user.userID}`}
        </Typography>
        <UserCard user={user} />
        {genres.map((genre) => (
          <RangeSlider
            key={genre.id}
            label={genre.name}
            value={values[genre.id] || 50}
            onChange={(e, newValue) => handleChange(genre.id, newValue)}
          />
        ))}
      </Box>
      <Box sx={{ maxWidth: 300 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          User Ratings
        </Typography>
        {validRatings.length > 0 ? (
          validRatings.map((rating, index) => (
            <UserRatingsCard key={index} rating={{
              movieId: rating[0],
              rating: rating[1],
              timestamp: rating[2]
            }} />
          ))
        ) : (
          <p>No ratings available.</p>
        )}
      </Box>
    </Box>
  );
}

export default ModalUserDetails;