import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/api';
import { format } from 'date-fns';
import { 
  Box, 
  IconButton,
  Typography
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { JournalEntry } from '../../store/slices/journalSlice';

interface JournalListProps {
  entries?: JournalEntry[];
  refreshFlag?: number;
}

const JournalList: React.FC<JournalListProps> = ({ entries = [], refreshFlag }) => {
  const [localEntries, setLocalEntries] = useState<JournalEntry[]>(entries);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    fetchEntries();
  }, [token, refreshFlag]);

  const fetchEntries = async () => {
    try {
      const headers: any = {};
      if (token && token !== 'cookie') {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await axiosInstance.get('/journal', {
        headers,
        withCredentials: true
      });
      setLocalEntries(response.data);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const headers: any = {};
      if (token && token !== 'cookie') {
        headers.Authorization = `Bearer ${token}`;
      }
      await axiosInstance.delete(`/journal/${id}`, {
        headers,
        withCredentials: true
      });
      fetchEntries(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting journal entry:', error);
    }
  };

  const getMoodColor = (mood: string) => {
    const moodColors: { [key: string]: string } = {
      happy: '#4caf50',
      sad: '#2196f3',
      angry: '#f44336',
      anxious: '#ff9800',
      calm: '#9c27b0',
      neutral: '#607d8b'
    };
    return moodColors[mood.toLowerCase()] || '#607d8b';
  };

  if (loading) {
    return <Typography>Loading your journal entries...</Typography>;
  }

  if (!Array.isArray(localEntries)) return <div>No journal entries found.</div>;

  return (
    <Box sx={{ p: 3 }} className="font-sans text-base text-gray-900 dark:text-gray-100">
      <Typography variant="h5" gutterBottom className="font-bold text-xl text-gray-900 dark:text-gray-100">
        My Journal Entries
      </Typography>
      <Box display="flex" flexDirection="column" gap={3}>
        {localEntries.length === 0 ? (
          <Box>
            <Typography variant="body1" align="center" className="text-gray-700 dark:text-gray-300">
              No journal entries found.
            </Typography>
          </Box>
        ) : (
          localEntries.map((entry) => (
            <Box
              key={entry.id}
              sx={{
                background: '#232b39',
                borderRadius: 3,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)',
                minWidth: 0,
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: getMoodColor(entry.mood || 'neutral'),
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    letterSpacing: '0.01em',
                  }}
                >
                  {entry.mood ? entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1) : 'Neutral'}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#94a3b8',
                      fontSize: '1rem',
                      fontWeight: 400,
                      mr: 0.5,
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                      <svg style={{ marginRight: 4 }} width="18" height="18" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {format(new Date(entry.date), 'dd/MM/yyyy')} at {format(new Date(entry.date), 'HH:mm')}
                    </span>
                  </Typography>
                  <IconButton size="small" color="error" onClick={() => handleDelete(entry.id)}>
                    <DeleteIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: '#94a3b8',
                  fontSize: '1.15rem',
                  fontWeight: 400,
                  mt: 1,
                  mb: 0.5,
                  wordBreak: 'break-word',
                }}
              >
                {entry.content}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default JournalList; 