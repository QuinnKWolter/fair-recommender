import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Explorer from './components/Explorer';
import './App.css';

const Container = styled.div.attrs({
  className: 'container'
})`
  width: 80%;
  margin: 10px auto;
  // -- example --
  // display: grid;
  // grid-template-rows: 50px 900px 450px;
  // grid-template-columns: 15% 85%;
  // grid-template-areas:
  //  'e e'

  font-size: 0.9rem;
  font-family: sans-serif;
  color: #404040;
`;

function App() {
  const [ selectedUserId, setSelectedUserId ] = useState(2);
  const [ users, setUsers ] = useState();
  const [ meanPref, setMeanPref ] = useState();
  const [ group, setGroup ] = useState('stereotyping');
  const [ protos, setProtos ] = useState([]);
  const [ selectedAlgoEff, setAlgoEff ] = useState('stereotyping');
  const [ uv, setUVs ] = useState();

  const getData = () => {
    axios.get('http://localhost:8000/data/loadData/')
      .then((res) => {
        console.log('res: ', res.data);
        setUsers(res.data.users);
        setMeanPref(res.data.meanUV);
        setProtos(res.data.protos);
      }).catch(err => console.error('Error'))
  }

  useEffect(() => {
    // fetch function for loading data from API
    getData();
  }, []);

  if (typeof(users) == 'undefined')
    return <div />;

  return (
    <Container>
      <header>
        <h2>User Space</h2>
        {/* Dropdown menu for group */} 
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel 
            id="demo-select-small-label" 
            sx={{
              '&.MuiInputLabel-shrink':{
              }
            }}
          >Group</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            // defaultValue={'gender'}
            value={group}
            label="Group"
            onChange={(e) => {
              // if (e.target.value != group) {
                setGroup(e.target.value);
              // }
            }}
            // input={<StyledInput 
            //   label="Platform"
            // />}
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
            <MenuItem value='gender'>Gender</MenuItem>
            <MenuItem value='age'>Age</MenuItem>
            <MenuItem value='stereotyping'>Stereotyping</MenuItem>
            <MenuItem value='atypicality'>Atypicality</MenuItem>
            <MenuItem value='error'>Miscalbration</MenuItem>
          </Select>
        </FormControl>
        {/* Dropdown menu for algorithmic effects */} 
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel 
            id="demo-select-small-label" 
            sx={{
              '&.MuiInputLabel-shrink':{
              }
            }}
          >Algorithmic Effect</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            // defaultValue={'gender'}
            value={selectedAlgoEff}
            label="Algorithmic Effect"
            onChange={(e) => {
              // if (e.target.value != group) {
                setAlgoEff(e.target.value);
              // }
            }}
            // input={<StyledInput 
            //   label="Platform"
            // />}
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
            <MenuItem value='stereotyping'>Stereotyping</MenuItem>
            <MenuItem value='filterBubble'>Filter bubble</MenuItem>
            <MenuItem value='error'>Miscalbration</MenuItem>
          </Select>
        </FormControl>
        {/* Dropdown menu for selecting a focal user */} 
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel 
            id="demo-select-small-label" 
            sx={{
              '&.MuiInputLabel-shrink':{
              }
            }}
          >Selected user</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            // defaultValue={'gender'}
            value={selectedUserId}
            label="Selected user"
            onChange={(e) => {
              // if (e.target.value != group) {
                setSelectedUserId(e.target.value);
              // }
            }}
            // input={<StyledInput 
            //   label="Platform"
            // />}
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
            {users.map((u) => {
              return (
                <MenuItem value={u.userID}>User {u.userID}</MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </header>
      <Explorer 
          selectedUserId={selectedUserId}
          users={users}
          group={group}
          protos={protos}
          selectedAlgoEff={selectedAlgoEff}
          meanPref={meanPref}
      />
    </Container>
  );
}

export default App;
