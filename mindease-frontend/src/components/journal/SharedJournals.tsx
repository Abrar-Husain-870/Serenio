import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, Typography, Box, Avatar, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import axiosInstance from '../../utils/api';

interface SharedJournalEntry {
  _id: string;
  content: string;
  mood: string;
  createdAt: string;
  user: {
    _id?: string;
    name: string;
    avatar?: string;
  };
}

interface SharedJournalsProps {
  refreshFlag?: number;
}

const SharedJournals: React.FC<SharedJournalsProps> = ({ refreshFlag }) => {
  const [entries, setEntries] = useState<SharedJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: any) => state.auth.token);
  const userId = useSelector((state: any) => state.auth.user?._id);

  useEffect(() => {
    const fetchSharedJournals = async () => {
      try {
        const headers: any = {};
        if (token && token !== 'cookie') {
          headers.Authorization = `Bearer ${token}`;
        }
        const response = await axiosInstance.get('/journal/shared', {
          headers,
          withCredentials: true
        });
        const data = response.data;
        setEntries(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching shared journals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedJournals();
  }, [token, refreshFlag]);

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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this journal entry?')) return;
    try {
      const headers: any = {};
      if (token && token !== 'cookie') {
        headers.Authorization = `Bearer ${token}`;
      }
      await axiosInstance.delete(`/journal/${id}`, { headers, withCredentials: true });
      setEntries(entries.filter(entry => entry._id !== id));
    } catch (error) {
      alert('Failed to delete entry.');
    }
  };

  if (loading) {
    return <Typography>Loading shared journals...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }} className="font-sans text-base text-gray-900 dark:text-gray-100">
      <Typography variant="h5" gutterBottom className="font-bold text-xl text-gray-900 dark:text-gray-100">
        Community Journals
      </Typography>
      <Grid container spacing={3}>
        {entries.map((entry) => (
          <Grid item xs={12} md={6} key={entry._id}>
            <Card className="bg-white/90 dark:bg-gray-900/90 border-0 rounded-2xl shadow-lg p-2">
              <CardContent className="p-4">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={entry.user.avatar}
                    sx={{ mr: 2 }}
                  >
                    {entry.user.name[0]}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" className="font-sans font-semibold text-gray-900 dark:text-gray-100">
                      {entry.user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" className="text-gray-500 dark:text-gray-400">
                      {format(new Date(entry.createdAt), 'MMM dd, yyyy')}
                    </Typography>
                  </Box>
                  {entry.user._id && entry.user._id === userId && (
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(entry._id)}
                      size="small"
                      sx={{ color: '#f44336' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
                <Typography variant="body1" paragraph className="font-sans font-medium text-gray-900 dark:text-gray-100">
                  {entry.content}
                </Typography>
                <Chip
                  label={entry.mood}
                  sx={{
                    backgroundColor: getMoodColor(entry.mood),
                    color: 'white',
                    fontFamily: 'inherit',
                    fontWeight: 500,
                    fontSize: '1rem',
                    borderRadius: '0.75rem',
                    paddingX: 1.5,
                    paddingY: 0.5,
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SharedJournals; 