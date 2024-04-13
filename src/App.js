import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Explorer from "./Explorer";
import LegendWidget from "./LegendWidget";
import Form from "./Form";
import Header from "./Header";
import CustomModal from "./CustomModal";
import ModalUserDetails from "./ModalUserDetails";
import ModalCompareUsers from "./ModalCompareUsers";
import ModalInformation from "./ModalInformation";

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
  const [modalState, setModalState] = useState({
    userDetail: false,
    compareUsers: false,
    information: false,
  });

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

  const handleOpenModal = (modal) => {
    setModalState((prev) => ({ ...prev, [modal]: true }));
  };

  const handleCloseModal = (modal) => {
    setModalState((prev) => ({ ...prev, [modal]: false }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Header onOpenModal={handleOpenModal} />
      <CustomModal
        open={modalState.userDetail}
        handleClose={() => handleCloseModal("userDetail")}
        title="User Detail"
        content={<ModalUserDetails />}
      />
      <CustomModal
        open={modalState.compareUsers}
        handleClose={() => handleCloseModal("compareUsers")}
        title="Compare Users"
        content={<ModalCompareUsers />}
      />
      <CustomModal
        open={modalState.information}
        handleClose={() => handleCloseModal("information")}
        title="Information"
        content={<ModalInformation />}
      />
      <div className="App">
        {users.length > 0 ? <Explorer users={users} /> : <div>Loading...</div>}
        <LegendWidget />
        <Form users={users} />
      </div>
    </ThemeProvider>
  );
}

export default App;
