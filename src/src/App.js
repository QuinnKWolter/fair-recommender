import React, { useEffect, useState, useRef } from 'react';
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
  const [ selectedUserId, setSelectedUserId ] = useState(4107);
  const [ cfUserId, setCfUserId ] = useState(549);
  const [ users, setUsers ] = useState();
  const [ meanPref, setMeanPref ] = useState([ 4.9327693, 6.887655 ]);
  const [ group, setGroup ] = useState('stereotype');
  const [ selectedAlgoEff, setAlgoEff ] = useState('all');
  const [ protos, setProtos ] = useState([]);
  const [ actualUVs, setActualUVs ] = useState([]);
  const [ predUVs, setPredUVs ] = useState([]);
  const [ categories, setCategories ] = useState([]);
  const [ clusterMode, setClusterMode ] = useState('stereotype'); // 'all' or one of algorithmic effects

  const getData = () => {
    axios.get('http://localhost:8000/data/loadData/')
      .then((res) => {
        res.data.users.forEach((d, i) => {
          res.data.users[i].filterBubble = -d.filterBubble
        })
        setUsers(res.data.users);
        setActualUVs(res.data.actualUVs);
        setPredUVs(res.data.predUVs);
        setCategories(res.data.categories);
        setProtos(res.data.users.filter(d => d['is_proto_' + clusterMode] != 'False'));
      }).catch(err => console.error('Error'))
  }
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      getData();
    }
  }, []);

  if ((typeof(users) == 'undefined') | (typeof(protos) == 'undefined'))
    return <div />;

  return (
    <Container>
      <header>
        <h2>User Space</h2>
        {/* Dropdown menu for selecting a focal user */} 
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small-label" sx={{ '&.MuiInputLabel-shrink': {}}}>Selected user</InputLabel>
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
        cfUserId={cfUserId}
        users={users}
        group={group}
        protos={protos}
        selectedAlgoEff={selectedAlgoEff}
        meanPref={meanPref}
        setAlgoEff={setAlgoEff}
        actualUVs={actualUVs}
        predUVs={predUVs}
        categories={categories}
      />
    </Container>
  );
}

export default App;
