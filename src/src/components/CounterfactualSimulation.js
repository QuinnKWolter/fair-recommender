import React from 'react';
import styled from 'styled-components';

const SimulationWrapper = styled.div`
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  width: 90%;
  height: auto;
  text-align: left;
`;

const Header = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
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

const InteractionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 5px;
    display: flex;
    align-items: center;

    span {
      margin-left: 5px;
    }
  }
`;

const Stars = styled.div`
  display: flex;
  align-items: center;

  span {
    color: gold;
  }
`;

const Star = styled.span`
  font-size: 1rem;
  &:not(:last-child) {
    margin-right: 2px;
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

const CounterfactualSimulation = () => {
  const recentInteractions = [
    { title: "Little Mermaid, The", rating: 3 },
    { title: "Lord of the Rings: Fellowship of the Ring, The", rating: 5 },
    { title: "Happy Gilmore", rating: 1 }
  ];

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

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star key={i} style={{ color: i < rating ? 'gold' : 'lightgray' }}>★</Star>
      );
    }
    return stars;
  };

  return (
    <SimulationWrapper>
      <Header>Counterfactual Simulation</Header>
      <UserInfo>
        <img src="https://via.placeholder.com/50" alt="User" />
        <div>
          <span>User 4</span>
          <span>Gender: M</span>
          <span>Age Range: 35-45</span>
        </div>
      </UserInfo>

      <SectionTitle>Recent Interactions</SectionTitle>
      <InteractionList>
        {recentInteractions.map((interaction, index) => (
          <li key={index}>
            <Stars>{renderStars(interaction.rating)}</Stars>
            <span>{interaction.title}</span>
          </li>
        ))}
      </InteractionList>

      <SectionTitle>Categorical Preference</SectionTitle>
      <PreferenceList>
        {categoricalPreferences.map((preference, index) => (
          <PreferenceItem key={index}>
            <span>{preference.category}</span>
            <div style={{ '--bar-width': preference.width, '--bar-color': preference.color }} />
          </PreferenceItem>
        ))}
      </PreferenceList>
    </SimulationWrapper>
  );
};

export default CounterfactualSimulation;
