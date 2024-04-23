import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import RangeSlider from "./RangeSlider";
import UserCard from "./UserCard";

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
  { userID: "5", gender: "M", age: "25", occupation: "20", zip_code: "55455" },
];

function ModalCompareUsers() {
  const [values, setValues] = useState({});

  const handleChange = (userId, genreId, newValue) => {
    setValues((prevState) => ({
      ...prevState,
      [`${userId}-${genreId}`]: newValue,
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap", // Allow content to wrap if necessary
        justifyContent: "center", // Center content horizontally
        alignItems: "center", // Center content vertically
        padding: "20px",
        gap: "20px", // Adds space between child components
      }}
    >
      {users.map((user) => (
        <Box
          key={user.userID}
          sx={{
            display: "flex",
            flexDirection: "column", // Stack content vertically
            alignItems: "center", // Center content horizontally within each user box
            maxWidth: 300, // Restrict maximum width to prevent stretching
            overflow: "auto", // Allow vertical scrolling within each user box
            padding: 2,
            maxHeight: "90vh",
          }}
        >
          <Typography
            variant="h6"
            sx={{ marginBottom: 2 }}
          >{`User ${user.userID}`}</Typography>
          <UserCard user={user} />
          {genres.map((genre) => (
            <RangeSlider
              key={genre.id}
              label={genre.name}
              value={values[`${user.userID}-${genre.id}`] || 50}
              onChange={(e, newValue) =>
                handleChange(user.userID, genre.id, newValue)
              }
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}

export default ModalCompareUsers;
