import React from "react";
import Dropdown from "./Dropdown";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const ageOptions = [
  { value: "", label: "None" },
  { value: "1", label: "Under 18" },
  { value: "18", label: "18-24" },
  { value: "25", label: "25-34" },
  { value: "35", label: "35-44" },
  { value: "45", label: "45-54" },
  { value: "55", label: "55-64" },
  { value: "65", label: "65+" },
];

const genderOptions = [
  { value: "", label: "None" },
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
];

const locationOptions = [
  { value: "", label: "None" },
  { value: "ny", label: "New York" },
  { value: "ca", label: "California" },
  { value: "tx", label: "Texas" },
];

const occupationOptions = [
  { value: "", label: "None" },
  { value: "0", label: "Other or Unspecified" },
  { value: "1", label: "Academic/Educator" },
  { value: "2", label: "Artist" },
  { value: "3", label: "Clerical/Admin" },
  { value: "4", label: "College/Grad Student" },
  { value: "5", label: "Customer Service" },
  { value: "6", label: "Doctor/Health Care" },
  { value: "7", label: "Executive/Managerial" },
  { value: "8", label: "Farmer" },
  { value: "9", label: "Homemaker" },
  { value: "10", label: "K-12 Student" },
  { value: "11", label: "Lawyer" },
  { value: "12", label: "Programmer" },
  { value: "13", label: "Retired" },
  { value: "14", label: "Sales/Marketing" },
  { value: "15", label: "Scientist" },
  { value: "16", label: "Self-Employed" },
  { value: "17", label: "Technician/Engineer" },
  { value: "18", label: "Tradesman/Craftsman" },
  { value: "19", label: "Unemployed" },
  { value: "20", label: "Writer" },
];

const genreOptions = [
  { value: "", label: "None" },
  { value: "action", label: "Action" },
  { value: "adventure", label: "Adventure" },
  { value: "animation", label: "Animation" },
  { value: "children", label: "Children's" },
  { value: "comedy", label: "Comedy" },
  { value: "crime", label: "Crime" },
  { value: "documentary", label: "Documentary" },
  { value: "drama", label: "Drama" },
  { value: "fantasy", label: "Fantasy" },
  { value: "film-noir", label: "Film-Noir" },
  { value: "horror", label: "Horror" },
  { value: "imax", label: "IMAX" },
  { value: "musical", label: "Musical" },
  { value: "mystery", label: "Mystery" },
  { value: "romance", label: "Romance" },
  { value: "sci-fi", label: "Sci-Fi" },
  { value: "thriller", label: "Thriller" },
  { value: "war", label: "War" },
  { value: "western", label: "Western" },
];

const Form = ({ users }) => {
  const userIdOptions = users.map((user) => ({
    value: user.userID,
    label: user.userID,
  }));

  return (
    <Paper
      sx={{
        position: "fixed",
        right: 20,
        bottom: 20,
        width: 300,
        bgcolor: "rgba(255, 255, 255, 0.7)",
        boxShadow: 6,
        borderRadius: 2,
        padding: 2,
        overflow: "auto",
        zIndex: "tooltip",
      }}
    >
      <Box sx={{ marginY: 1 }}>
        <Dropdown label="User ID" options={userIdOptions} />
        <Dropdown label="Age" options={ageOptions} />
        <Dropdown label="Gender" options={genderOptions} />
        <Dropdown label="Location" options={locationOptions} />
        <Dropdown label="Occupation" options={occupationOptions} />
        <Dropdown label="Top Genre" options={genreOptions} />
        <Button variant="contained" color="success" sx={{ mt: 2 }}>
          Search
        </Button>
      </Box>
    </Paper>
  );
};

export default Form;
