import React from 'react';
import { Box, Typography, List, ListItem, Avatar, Paper } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { styled } from '@mui/system';

const SimulationWrapper = styled(Paper)({
  padding: '0px 20px 10px 20px',
  marginTop: '5px',
  width: '90%',
  height: 'auto',
  textAlign: 'left',
  borderRadius: '10px',
});

const Header = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '20px',
});

const UserInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '20px',

  '& img': {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginRight: '20px',
  },

  '& div': {
    display: 'flex',
    flexDirection: 'column',

    '& span': {
      fontWeight: 'bold',
      marginBottom: '5px',
    },
  },
});

const SectionTitle = styled(Typography)({
  marginTop: '20px',
  marginBottom: '0px',
  fontSize: '1.2rem',
});

const InteractionList = styled(List)({
  display: 'flex',
  overflowX: 'auto',
  padding: 0,
  margin: 0,

  '& li': {
    display: 'block',
    minWidth: '200px',
    marginRight: '10px',
  },
});

const Stars = styled('div')({
  display: 'flex',
  alignItems: 'center',

  '& span': {
    color: 'gold',
  },
});

const Star = styled(StarIcon)({
  fontSize: '1rem',
  marginRight: '2px',
});

const StarBorder = styled(StarBorderIcon)({
  fontSize: '1rem',
  marginRight: '2px',
});

const PreferenceList = styled(List)({
  padding: 0,
  margin: 0,
});

const PreferenceItem = styled(ListItem)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '3px', // Reduced margin-bottom
  height: '15px', // Reduced height for each item

  '& span': {
    width: '30%',
    fontStyle: 'italic',
    fontSize: '0.8rem', // Reduced font size
  },

  '& div': {
    width: '70%',
    height: '5px', // Reduced height for the bar
    backgroundColor: '#eee',
    position: 'relative',
    borderRadius: '2px', // Reduced border radius

    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      backgroundColor: 'var(--bar-color)',
      borderRadius: '2px',
      width: 'var(--bar-width)',
    },
  },
});

const CounterfactualSimulation = () => {
  const recentInteractions = [
    { title: "Inception", rating: 4 },
    { title: "The Godfather", rating: 5 },
    { title: "Pulp Fiction", rating: 2 }
  ];

  const categoricalPreferences = [
    { category: 'Action', width: '52.73%', color: 'lightgray' },
    { category: 'Adventure', width: '55.42%', color: 'lightgray' },
    { category: 'Animation', width: '46.56%', color: 'lightgray' },
    { category: 'Children', width: '74.19%', color: 'lightgray' },
    { category: 'Comedy', width: '50.43%', color: 'lightgray' },
    { category: 'Crime', width: '26.38%', color: 'lightgray' },
    { category: 'Documentary', width: '66.18%', color: 'lightgray' },
    { category: 'Drama', width: '53.69%', color: 'lightgray' },
    { category: 'Fantasy', width: '53.96%', color: 'lightgray' },
    { category: 'Film-Noir', width: '64.08%', color: 'lightgray' },
    { category: 'Horror', width: '10%', color: 'red' },
    { category: 'I-MAX', width: '43.38%', color: 'lightgray' },
    { category: 'Musical', width: '37.31%', color: 'lightgray' },
    { category: 'Mystery', width: '53.98%', color: 'lightgray' },
    { category: 'Romance', width: '80%', color: 'blue' },
    { category: 'Sci-Fi', width: '76.43%', color: 'lightgray' },
    { category: 'Thriller', width: '65.24%', color: 'lightgray' },
    { category: 'War', width: '38.59%', color: 'lightgray' },
    { category: 'Western', width: '27.13%', color: 'lightgray' },
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < rating ? <Star key={i} /> : <StarBorder key={i} />
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
          <span>User 549</span>
          <span>Gender: M</span>
          <span>Age Range: 25-35</span>
        </div>
      </UserInfo>

      <SectionTitle>Recent Interactions</SectionTitle>
      <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <InteractionList sx={{ display: 'flex', flexDirection: 'column', whiteSpace: 'nowrap' }}>
          {recentInteractions.map((interaction, index) => (
            <ListItem key={index} sx={{ display: 'inline-block', verticalAlign: 'top', minWidth: '200px', whiteSpace: 'normal', margin: '0px', padding: '0px 0px 10px 5px' }}>
              <Typography noWrap>{interaction.title}</Typography>
              <Stars>{renderStars(interaction.rating)}</Stars>
            </ListItem>
          ))}
        </InteractionList>
      </Box>

      <SectionTitle>Genre Preferences</SectionTitle>
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
