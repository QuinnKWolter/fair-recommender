import React, { useState } from "react";
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
  {
    userID: "1",
    gender: "F",
    age: "1",
    occupation: "10",
    zip_code: "48067",
  },
  {
    userID: "5",
    gender: "M",
    age: "25",
    occupation: "20",
    zip_code: "55455",
  },
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
    <div style={{ display: "flex", whiteSpace: "nowrap" }}>
      {users.map((user, index) => (
        <div key={user.userID} style={{ marginRight: "20px" }}>
          <div className="user-slider-container" style={{ marginBottom: "20px", marginLeft: "20px" }}>
            <UserCard user={user} />
            <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "hidden" }}>
              {genres.map((genre) => (
                <div key={genre.id} style={{ margin: "10px" }}>
                  <h3>{genre.name}</h3>
                  <RangeSlider
                    value={values[`${user.userID}-${genre.id}`] || 50}
                    onChange={(event, newValue) =>
                      handleChange(user.userID, genre.id, newValue)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ModalCompareUsers;
