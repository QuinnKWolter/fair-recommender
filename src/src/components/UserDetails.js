import React from 'react';
import { Box, Typography, List, ListItem, Avatar, Paper, MenuItem, FormControl, Select, InputLabel, Button as MuiButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { styled } from '@mui/system';

const UserDetailsWrapper = styled(Paper)({
  padding: '0px 20px 10px 20px',
  marginTop: '5px',
  width: '90%',
  height: 'auto',
  textAlign: 'left',
  borderRadius: '10px',
});

const HeaderContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0px',
});

const Header = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginTop: '-20px',
});

const UserInfoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '20px',
  marginTop: '-2px',
});

const UserInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',

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

const SectionTitleContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '20px',
  marginBottom: '0px',
});

const SectionTitle = styled(Typography)({
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
  marginBottom: '3px',
  height: '15px',

  '& span': {
    width: '30%',
    fontStyle: 'italic',
    fontSize: '0.8rem',
  },

  '& div': {
    position: 'relative',
    width: '70%',
    height: '5px',
    backgroundColor: '#eee',
    borderRadius: '2px',

    '& .bar-original': {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      backgroundColor: 'lightgray',
      borderRadius: '2px',
      zIndex: 1,
    },

    '& .bar-adjusted': {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      borderRadius: '2px',
      zIndex: 2,
    },

    '& .bar-original-blue': {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      backgroundColor: 'lightgray',
      borderRadius: '2px',
      zIndex: 2,
    },

    '& .bar-adjusted-blue': {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      borderRadius: '2px',
      zIndex: 1,
    },
  },
});

const StyledButton = styled(MuiButton)({
  display: 'block',
  width: '40%',
  padding: '5px',
  backgroundColor: 'orange',
  border: 'none',
  borderRadius: '4px',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '-15px',
});

const UserDetails = ({ selectedUserId, setSelectedUserId, users }) => {
  const recentInteractions = [
    { title: "Little Mermaid, The", rating: 3 },
    { title: "Lord of the Rings: Fellowship of the Ring, The", rating: 5 },
    { title: "Happy Gilmore", rating: 1 },
  ];

  const categoricalPreferences = [
    { category: 'Action', width: '54.73%', color: 'lightgray', original: '54.73%' },
    { category: 'Adventure', width: '56.42%', color: 'lightgray', original: '56.42%' },
    { category: 'Animation', width: '45.56%', color: 'lightgray', original: '45.56%' },
    { category: 'Children', width: '68.19%', color: 'lightgray', original: '68.19%' },
    { category: 'Comedy', width: '45.43%', color: 'lightgray', original: '45.43%' },
    { category: 'Crime', width: '33.38%', color: 'lightgray', original: '33.38%' },
    { category: 'Documentary', width: '56.18%', color: 'lightgray', original: '56.18%' },
    { category: 'Drama', width: '54.69%', color: 'lightgray', original: '54.69%' },
    { category: 'Fantasy', width: '51.96%', color: 'lightgray', original: '51.96%' },
    { category: 'Film-Noir', width: '58.08%', color: 'lightgray', original: '58.08%' },
    { category: 'Horror', width: '10%', color: 'red', original: '50%' },
    { category: 'I-MAX', width: '36.38%', color: 'lightgray', original: '36.38%' },
    { category: 'Musical', width: '38.31%', color: 'lightgray', original: '38.31%' },
    { category: 'Mystery', width: '54.98%', color: 'lightgray', original: '54.98%' },
    { category: 'Romance', width: '80%', color: 'blue', original: '50%' },
    { category: 'Sci-Fi', width: '71.43%', color: 'lightgray', original: '71.43%' },
    { category: 'Thriller', width: '66.24%', color: 'lightgray', original: '66.24%' },
    { category: 'War', width: '41.59%', color: 'lightgray', original: '41.59%' },
    { category: 'Western', width: '28.13%', color: 'lightgray', original: '28.13%' },
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
    <UserDetailsWrapper>
      <HeaderContainer>
        <Header>User Details</Header>
        <FormControl sx={{ m: 1, minWidth: 120, marginTop: '10px' }} size="small">
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
      </HeaderContainer>

      <UserInfoContainer>
        <UserInfo>
          <img src="https://via.placeholder.com/50" alt="User" />
          <div>
            <span>User 4107</span>
            <span>Gender: F</span>
            <span>Age Range: 25-35</span>
          </div>
        </UserInfo>
        <StyledButton>If I were...</StyledButton>
      </UserInfoContainer>

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

      <SectionTitleContainer>
        <SectionTitle>Genre Preferences</SectionTitle>
        <StyledButton>If I preferred...</StyledButton>
      </SectionTitleContainer>

      <PreferenceList>
        {categoricalPreferences.map((preference, index) => (
          <PreferenceItem key={index}>
            <span>{preference.category}</span>
            <div>
              {preference.color === 'blue' ? (
                <>
                  <div 
                    className="bar-adjusted-blue" 
                    style={{ width: preference.width, backgroundColor: preference.color }} 
                  />
                  <div 
                    className="bar-original-blue" 
                    style={{ width: preference.original }} 
                  />
                </>
              ) : (
                <>
                  <div 
                    className="bar-original" 
                    style={{ width: preference.original }} 
                  />
                  <div 
                    className="bar-adjusted" 
                    style={{ width: preference.width, backgroundColor: preference.color }} 
                  />
                </>
              )}
            </div>
          </PreferenceItem>
        ))}
      </PreferenceList>
    </UserDetailsWrapper>
  );
};

export default UserDetails;
