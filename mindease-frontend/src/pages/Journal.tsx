import React from 'react';
import { Container, Heading, Tabs } from '@chakra-ui/react';
import JournalEntry from '../components/journal/JournalEntry';
import JournalList from '../components/journal/JournalList';
import SharedJournals from '../components/journal/SharedJournals';

const Journal: React.FC = () => {
  const [tabValue, setTabValue] = React.useState('my');
  const [refreshFlag, setRefreshFlag] = React.useState(0);

  const handleTabChange = (details: any) => {
    setTabValue(details.value);
  };

  const handleEntryCreated = () => {
    setRefreshFlag(f => f + 1);
  };

  return (
    <Container maxW="container.lg">
      <Heading as="h1" size="lg" mb={4}>
        Journal
      </Heading>

      <Tabs.Root value={tabValue} onValueChange={handleTabChange} variant="unstyled">
        <Tabs.List
          mb={5}
          px={1}
          py={1}
          rounded="xl"
          className="inline-flex bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <Tabs.Trigger
            value="my"
            fontFamily="Montserrat, Arial, sans-serif"
            fontWeight={700}
            fontSize="1rem"
            textTransform="none"
            px={4}
            py={2}
            rounded="lg"
            transition="all 200ms ease"
            textDecoration="none"
            borderBottom="none"
            outline="none"
            _hover={{ bg: 'gray.200', _dark: { bg: 'gray.700' } }}
            _selected={{
              bg: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
              color: 'white',
              boxShadow: 'sm',
              borderBottom: 'none',
            }}
          >
            My Journal
          </Tabs.Trigger>
          <Tabs.Trigger
            value="community"
            fontFamily="Montserrat, Arial, sans-serif"
            fontWeight={700}
            fontSize="1rem"
            textTransform="none"
            px={4}
            py={2}
            rounded="lg"
            transition="all 200ms ease"
            textDecoration="none"
            borderBottom="none"
            outline="none"
            _hover={{ bg: 'gray.200', _dark: { bg: 'gray.700' } }}
            _selected={{
              bg: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
              color: 'white',
              boxShadow: 'sm',
              borderBottom: 'none',
            }}
          >
            Community Journals
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="my" px={0}>
          <JournalEntry onEntryCreated={handleEntryCreated} />
          <JournalList refreshFlag={refreshFlag} />
        </Tabs.Content>
        <Tabs.Content value="community" px={0}>
          <SharedJournals refreshFlag={refreshFlag} />
        </Tabs.Content>
      </Tabs.Root>
    </Container>
  );
};

export default Journal;