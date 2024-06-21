import React, { useState, useEffect } from "react";
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

const Form = ({ users, selectedUserId, setSelectedUserId }) => {
  // States for filters
  const [genderFilter, setGenderFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [occupationFilter, setOccupationFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  // Update filtered users whenever the filters or users change
  useEffect(() => {
    let results = users;
    if (genderFilter) {
      results = results.filter((user) => user.gender === genderFilter);
    }
    if (ageFilter) {
      results = results.filter((user) => user.age === ageFilter);
    }
    if (occupationFilter) {
      results = results.filter((user) => user.occupation === occupationFilter);
    }
    if (locationFilter) {
      results = results.filter((user) => user.zip_code === locationFilter);
    }
    setFilteredUsers(results);
  }, [users, genderFilter, ageFilter, occupationFilter, locationFilter]);

  const userIdOptions = filteredUsers.map((user) => ({
    value: user.userID,
    label: user.userID,
  }));

  const handleUserIdChange = (newValue) => {
    setSelectedUserId(newValue ? newValue.value : null);
  };

  return (
    <Paper
      sx={{
        width: '100%', // Ensure full width
        bgcolor: "rgba(255, 255, 255, 0.7)",
        boxShadow: 6,
        borderRadius: 2,
        padding: 2,
        overflow: "auto",
      }}
    >
      <Box sx={{ marginY: 1 }}>
        <Dropdown
          label="User ID"
          options={userIdOptions}
          onChange={handleUserIdChange}
          value={
            userIdOptions.find((option) => option.value === selectedUserId) ||
            null
          }
        />
        {/* <Dropdown
          label="Gender"
          options={genderOptions}
          onChange={(newValue) =>
            setGenderFilter(newValue ? newValue.value : "")
          }
        />
        <Dropdown
          label="Age"
          options={ageOptions}
          onChange={(newValue) => setAgeFilter(newValue ? newValue.value : "")}
        />
        <Dropdown
          label="Occupation"
          options={occupationOptions}
          onChange={(newValue) =>
            setOccupationFilter(newValue ? newValue.value : "")
          }
        />
        <Dropdown
          label="Location"
          options={locationOptions}
          onChange={(newValue) =>
            setLocationFilter(newValue ? newValue.value : "")
          }
        /> */}
      </Box>
    </Paper>
  );
};

export default Form;
