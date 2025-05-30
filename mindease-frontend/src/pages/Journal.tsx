import React from 'react';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import JournalEntry from '../components/journal/JournalEntry';
import JournalList from '../components/journal/JournalList';
import SharedJournals from '../components/journal/SharedJournals';

const Journal: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const [refreshFlag, setRefreshFlag] = React.useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEntryCreated = () => {
    setRefreshFlag(f => f + 1);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Journal
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            label="My Journal" 
            sx={{
              fontFamily: 'Montserrat, Arial, sans-serif',
              fontWeight: 700,
              color: tabValue === 0 ? '#2563eb' : '#64748b',
              fontSize: '1.1rem',
              textTransform: 'none',
              background: tabValue === 0 ? 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)' : 'none',
              borderRadius: '1rem 1rem 0 0',
              transition: 'all 0.2s',
            }}
          />
          <Tab 
            label="Community Journals" 
            sx={{
              fontFamily: 'Montserrat, Arial, sans-serif',
              fontWeight: 700,
              color: tabValue === 1 ? '#2563eb' : '#64748b',
              fontSize: '1.1rem',
              textTransform: 'none',
              background: tabValue === 1 ? 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)' : 'none',
              borderRadius: '1rem 1rem 0 0',
              transition: 'all 0.2s',
            }}
          />
        </Tabs>
      </Box>

      {tabValue === 0 ? (
        <>
          <JournalEntry onEntryCreated={handleEntryCreated} />
          <JournalList refreshFlag={refreshFlag} />
        </>
      ) : (
        <SharedJournals refreshFlag={refreshFlag} />
      )}
    </Container>
  );
};

export default Journal; 