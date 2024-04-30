import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function ModalInformation() {
  // Using an object to track which sections are open
  const [openSections, setOpenSections] = useState({});

  const sections = {
    gettingStarted: "We believe that everyone deserves to enjoy movies that cater to their unique tastes and preferences. Our system is designed to provide fair and non-biased movie recommendations by giving you, the user, full control to explore and discover movies that interest you. We don't believe in hiding anything from you, and that's why we strive to be transparent and open about our recommendations. With our user-centric approach, we aim to provide you with the best movie recommendations that match your interests and preferences, without any hidden biases or preconceptions.",
    keyTerms: {
      "Stereotyping": "A generalized view or preconception about attributes or characteristics that are or ought to be possessed by, or the roles that are or should be performed by, members of a particular social group.",
      "Miscalibration": "The mismatch between a model's confidence and its accuracy.",
      "Filter Bubble": "A state of intellectual isolation that can result from personalized searches when a website algorithm selectively guesses what information a user would like to see.",
      "Popularity Bias": "The tendency of a system to recommend items that are more popular than others."
    },
    contributors: [
      "Dr. Yu-Ru Lin",
      "Yongsu An",
      "Quinn K Wolter",
      "Jonilyn Dick",
      "Janet Dick"
    ]
  };

  const toggleSection = (section) => {
    // Toggle the open state of the section
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderContent = (content) => {
    if (typeof content === 'object' && !Array.isArray(content)) {
      return (
        Object.entries(content).map(([term, definition], index) => (
          <Accordion key={index} expanded={openSections[term] || false} onChange={() => toggleSection(term)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{term}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{definition}</Typography>
            </AccordionDetails>
          </Accordion>
        ))
      );
    } else if (Array.isArray(content)) {
      return <div>{content.map((item, index) => <Typography key={index}>&#8226; {item}</Typography>)}</div>;
    } else {
      return <Typography>{content}</Typography>;
    }
  };

  return (
    <div style={{ width: '100%', margin: 'auto', padding: '20px', backgroundColor: 'white' }}>
      <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '20px' }}>Welcome to our fair recommender system!</h2>
      {Object.keys(sections).map((section) => (
        <div key={section}>
          <Typography
            style={{
              cursor: 'pointer',
              fontSize: '20px',
              userSelect: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() => toggleSection(section)}
          >
            &#9654; {section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')}
          </Typography>
          {openSections[section] && renderContent(sections[section])}
        </div>
      ))}
    </div>
  );
}

export default ModalInformation;
