import React, { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import JournalEntry from '../components/journal/JournalEntry';
import JournalList from '../components/journal/JournalList';
import SharedJournals from '../components/journal/SharedJournals';
import { useAppSelector } from '../store/hooks';
import { useNavigate } from 'react-router-dom';

const Journal: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const entries = useAppSelector(state => state.journal.entries);
  const [refreshFlag, setRefreshFlag] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
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
          <Tab label="My Journal" />
          <Tab label="Community Journals" />
        </Tabs>
      </Box>

      {tabValue === 0 ? (
        <>
          <JournalEntry onEntryCreated={handleEntryCreated} />
          <JournalList refreshFlag={refreshFlag} />
        </>
      ) : (
        <SharedJournals />
      )}
    </Container>
  );
};

export default Journal; 