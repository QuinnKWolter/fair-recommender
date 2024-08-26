import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import Explorer from './components/Explorer';
import UserDetails from './components/UserDetails';
import CounterfactualSimulation from './components/CounterfactualSimulation';
import './App.css';

const Container = styled.div.attrs({
  className: 'container'
})`
  width: 100%; /* Change to 100% to utilize full width */
  margin: auto;
  font-size: 0.9rem;
  font-family: sans-serif;
  color: #404040;
`;

const GridContainer = styled.div`
  display: flex;
  justify-content: space-between; /* Add this line */
  width: 100%;
`;

const UserSection = styled.div`
  flex: 1; /* Make each section take 1/3rd of the width */
  padding: 0px 10px;
  box-sizing: border-box;
`;

const CounterfactualSection = styled.div`
  flex: 1; /* Make each section take 1/3rd of the width */
  padding: 0px 10px;
  box-sizing: border-box;
`;

const ExplorerSection = styled.div`
  flex: 1; /* Make each section take 1/3rd of the width */
  padding: 0px 10px;
  box-sizing: border-box;
`;

function App() {
  const [selectedUserId, setSelectedUserId] = useState(4107);
  const [cfUserId, setCfUserId] = useState(549);
  const [users, setUsers] = useState();
  const [meanPref, setMeanPref] = useState([4.9327693, 6.887655]);
  const [group, setGroup] = useState('stereotype');
  const [selectedAlgoEff, setAlgoEff] = useState('all');
  const [protos, setProtos] = useState([]);
  const [clusterMode, setClusterMode] = useState('stereotype'); // 'all' or one of algorithmic effects

  const getData = () => {
    axios.get('http://localhost:8000/data/loadData/')
      .then((res) => {
        res.data.users.forEach((d, i) => {
          res.data.users[i].filterBubble = -d.filterBubble
        })
        setUsers(res.data.users);
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

  if (!users || !protos) return <div />;

  return (
    <Container>
      <GridContainer>
        <UserSection>
          <UserDetails
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            users={users}
          />
        </UserSection>
        <CounterfactualSection>
          <CounterfactualSimulation />
        </CounterfactualSection>
        <ExplorerSection>
          <Explorer
            selectedUserId={selectedUserId}
            cfUserId={cfUserId}
            users={users}
            group={group}
            protos={protos}
            selectedAlgoEff={selectedAlgoEff}
            meanPref={meanPref}
            setAlgoEff={setAlgoEff}
          />
        </ExplorerSection>
      </GridContainer>
    </Container>
  );
}

export default App;
