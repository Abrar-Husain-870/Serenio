import React, { useState } from 'react';
import { TextField, Button, FormControlLabel, Switch, Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addEntryStart, addEntrySuccess, addEntryFailure } from '../../store/slices/journalSlice';
import axiosInstance from '../../utils/api';

interface JournalEntryProps {
  onEntryCreated?: () => void;
}

const JournalEntry: React.FC<JournalEntryProps> = ({ onEntryCreated }) => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = useSelector((state: any) => state.auth.token);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    dispatch(addEntryStart());
    try {
      const headers: any = {};
      if (token && token !== 'cookie') {
        headers.Authorization = `Bearer ${token}`;
      }
      console.log({
        title: content.slice(0, 30) || 'Untitled',
        content,
        mood,
        isShared
      });
      const response = await axiosInstance.post('/journal', {
        title: content.slice(0, 30) || 'Untitled',
        content,
        mood,
        isShared
      }, {
        headers,
        withCredentials: true
      });
      if (response.data) {
        dispatch(addEntrySuccess(response.data));
        setContent('');
        setMood('');
        setIsShared(false);
        if (onEntryCreated) {
          onEntryCreated();
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Error creating journal entry:', error);
      dispatch(addEntryFailure(error?.message || 'Failed to add entry'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="space-y-4 font-sans text-base text-gray-900 dark:text-gray-100 max-w-xl mx-auto p-6 rounded-2xl shadow-lg bg-white/80 dark:bg-black/60 border border-transparent dark:border-white/10 backdrop-blur-sm">
      <Typography variant="h6" component="h2" gutterBottom className="font-bold text-2xl text-gray-900 dark:text-gray-100 mb-4">
        New Journal Entry
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="How are you feeling today?"
        variant="outlined"
        required
        sx={{
          '& .MuiInputBase-root': {
            backgroundColor: '#F8FAFC',
            borderRadius: '1rem',
            color: '#0f172a',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
            fontFamily: 'inherit',
            backdropFilter: 'blur(6px)'
          },
          '& .MuiInputBase-input': {
            color: '#0f172a',
          },
          '& .MuiInputBase-input::placeholder': {
            color: '#64748b',
            opacity: 1,
            fontFamily: 'inherit',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#cbd5e1',
          },
          ':where(.dark) & .MuiInputBase-root, .dark & .MuiInputBase-root': {
            backgroundColor: 'rgba(0,0,0,0.6) !important',
            color: '#f3f4f6 !important',
            border: '1px solid rgba(255,255,255,0.12)',
          },
          ':where(.dark) & .MuiInputBase-input, .dark & .MuiInputBase-input': {
            color: '#f3f4f6 !important',
          },
          ':where(.dark) & .MuiInputBase-input::placeholder, .dark & .MuiInputBase-input::placeholder': {
            color: '#cbd5e1 !important',
          },
          ':where(.dark) & .MuiOutlinedInput-notchedOutline, .dark & .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.12) !important',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#60a5fa',
          },
        }}
      />

      <TextField
        fullWidth
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="Current mood (e.g., happy, sad, anxious)"
        variant="outlined"
        sx={{
          '& .MuiInputBase-root': {
            backgroundColor: '#F8FAFC',
            borderRadius: '1rem',
            color: '#0f172a',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
            fontFamily: 'inherit',
            backdropFilter: 'blur(6px)'
          },
          '& .MuiInputBase-input': {
            color: '#0f172a',
          },
          '& .MuiInputBase-input::placeholder': {
            color: '#64748b',
            opacity: 1,
            fontFamily: 'inherit',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#cbd5e1',
          },
          '.dark & .MuiInputBase-root': {
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: '#f3f4f6',
            border: '1px solid rgba(255,255,255,0.12)'
          },
          '.dark & .MuiInputBase-input': {
            color: '#f3f4f6',
          },
          '.dark & .MuiInputBase-input::placeholder': {
            color: '#cbd5e1',
          },
          '.dark & .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.12)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#60a5fa',
          },
        }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={isShared}
            onChange={(e) => setIsShared(e.target.checked)}
            color="primary"
          />
        }
        label={<span className="font-sans text-base text-gray-900 dark:text-gray-100">Share with community</span>}
        className="mb-2"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isSubmitting || !content.trim()}
        sx={{
          fontFamily: 'inherit',
          fontWeight: 700,
          fontSize: '1.1rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 16px 0 rgba(99,102,241,0.10)',
          background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
          color: 'white',
          letterSpacing: '0.03em',
          '&:hover': { background: 'linear-gradient(90deg, #4f46e5 0%, #2563eb 100%)' },
          '&.Mui-disabled': { backgroundColor: '#a0aec0', color: '#e5e7eb' },
        }}
      >
        {isSubmitting ? 'Saving...' : 'Save Entry'}
      </Button>
    </Box>
  );
};

export default JournalEntry; 