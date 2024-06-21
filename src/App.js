import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import './App.css'; // Import the CSS file

// Import your components
import Explorer from "./Explorer";
import LegendWidget from "./LegendWidget";
import Form from "./Form";
import ModalUserDetails from "./ModalUserDetails";

const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
  },
});

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    console.log("Selected User ID changed to:", selectedUserId);
  }, [selectedUserId]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/data/df_users_all_w_coords_bpr.json");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error loading JSON data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="app-container">
        <div className="left-panel">
          <Form
            users={users}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
          />
          <div className="user-details-container">
            <ModalUserDetails userId={selectedUserId} users={users} />
          </div>
        </div>
        <div className="center-panel">
          Center Panel
        </div>
        <div className="right-panel">
          <Explorer
            users={users}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
          />
          <LegendWidget />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
