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
  width: 80%;
  margin: 10px auto;
  font-size: 0.9rem;
  font-family: sans-serif;
  color: #404040;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  width: 100%;
`;

const UserSection = styled.div`
  grid-column: 1 / span 1;
`;

const CounterfactualSection = styled.div`
  grid-column: 2 / span 1;
`;

const ExplorerSection = styled.div`
  grid-column: 3 / span 1;
`;

function App() {
  const [selectedUserId, setSelectedUserId] = useState(2);
  const [cfUserId, setCfUserId] = useState(11);
  const [users, setUsers] = useState();
  const [meanPref, setMeanPref] = useState([4.9327693, 6.887655]);
  const [group, setGroup] = useState('stereotype');
  const [protos, setProtos] = useState([]);
  const [selectedAlgoEff, setAlgoEff] = useState('stereotype');

  const getData = () => {
    axios.get('http://localhost:8000/data/loadData/')
      .then((res) => {
        const protos = res.data.users.filter(d => d.is_proto === true);
        setUsers(res.data.users);
        setProtos(protos);
      }).catch(err => console.error('Error', err));
  };

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
