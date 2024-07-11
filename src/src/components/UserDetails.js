import React from 'react';
import styled from 'styled-components';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const UserDetailsWrapper = styled.div`
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  width: 90%;
  height: auto;
  text-align: left;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 20px;
  }

  div {
    display: flex;
    flex-direction: column;

    span {
      font-weight: bold;
      margin-bottom: 5px;
    }
  }
`;

const SectionTitle = styled.h3`
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 1.2rem;
`;

const InteractionsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 5px;
  }
`;

const PreferenceList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PreferenceItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;

  span {
    width: 30%;
    font-style: italic;
  }

  div {
    width: 70%;
    height: 10px;
    background-color: #eee;
    position: relative;
    border-radius: 5px;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background-color: var(--bar-color);
      border-radius: 5px;
      width: var(--bar-width);
    }
  }
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 7px;
  margin-top: 10px;
  background-color: orange;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
`;

const UserSelectionSection = styled.div`
  margin-bottom: 20px;
`;

const UserDetails = ({ selectedUserId, setSelectedUserId, users }) => {
  const categoricalPreferences = [
    { category: 'Romance', width: '80%', color: 'purple' },
    { category: 'Sci-Fi', width: '70%', color: 'lightgray' },
    { category: 'Adventure', width: '60%', color: 'lightgray' },
    { category: 'Comedy', width: '50%', color: 'lightgray' },
    { category: 'Animation', width: '40%', color: 'lightgray' },
    { category: 'Drama', width: '50%', color: 'lightgray' },
    { category: 'Thriller', width: '70%', color: 'lightgray' },
    { category: 'War', width: '40%', color: 'lightgray' },
    { category: 'Children', width: '60%', color: 'lightgray' },
    { category: 'Crime', width: '30%', color: 'lightgray' },
    { category: 'Horror', width: '10%', color: 'red' },
    { category: 'Film-Noir', width: '60%', color: 'lightgray' },
    { category: 'Mystery', width: '50%', color: 'lightgray' },
    { category: 'Action', width: '50%', color: 'lightgray' },
    { category: 'Musical', width: '40%', color: 'lightgray' },
    { category: 'Western', width: '30%', color: 'lightgray' },
    { category: 'Documentary', width: '60%', color: 'lightgray' },
    { category: 'Fantasy', width: '50%', color: 'lightgray' }
  ];

  return (
    <UserDetailsWrapper>
      <UserSelectionSection>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small-label" sx={{ '&.MuiInputLabel-shrink': {} }}>Selected user</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={selectedUserId}
            label="Selected user"
            onChange={(e) => setSelectedUserId(e.target.value)}
            sx={{
              height: '2.5rem',
              color: 'black',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'gray'
              },
              '& .MuiSvgIcon-root': {
                color: 'gray'
              },
            }}
          >
            {users.map((u) => (
              <MenuItem key={u.userID} value={u.userID}>User {u.userID}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </UserSelectionSection>

      <UserInfo>
        <img src="https://via.placeholder.com/50" alt="User" />
        <div>
          <span>User 2</span>
          <span>Gender: F</span>
          <span>Age Range: 35-45</span>
        </div>
      </UserInfo>
      <Button>If I were...</Button>

      <SectionTitle>Recent Interactions</SectionTitle>
      <InteractionsList>
        <li>1. "Little Mermaid, The" ★★★★☆</li>
        <li>2. "Naked Gun: From the Files of Police Squad!, The" ★★★★☆</li>
        <li>3. "Happy Gilmore" ★★★★☆</li>
      </InteractionsList>

      <SectionTitle>Categorical Preference</SectionTitle>
      <PreferenceList>
        {categoricalPreferences.map((preference, index) => (
          <PreferenceItem key={index}>
            <span>{preference.category}</span>
            <div style={{ '--bar-width': preference.width, '--bar-color': preference.color }} />
          </PreferenceItem>
        ))}
      </PreferenceList>

      <Button>If I prefer...</Button>
    </UserDetailsWrapper>
  );
};

export default UserDetails;
