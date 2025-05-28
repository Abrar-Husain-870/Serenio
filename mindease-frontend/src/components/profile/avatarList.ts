import React from 'react';

export interface AvatarItem {
  id: string;
  label: string;
  svg: React.ReactNode;
}

const avatarList: AvatarItem[] = [
  {
    id: 'avatar1',
    label: 'Smiley',
    svg: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="22" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="4" />
        <circle cx="17" cy="21" r="2.5" fill="#38BDF8" />
        <circle cx="31" cy="21" r="2.5" fill="#38BDF8" />
        <path d="M17 30c2 2 8 2 10 0" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'avatar2',
    label: 'Cool',
    svg: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="22" fill="#FDE68A" stroke="#F59E42" strokeWidth="4" />
        <rect x="14" y="19" width="20" height="4" rx="2" fill="#F59E42" />
        <path d="M17 30c2 2 8 2 10 0" stroke="#F59E42" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'avatar3',
    label: 'Geometric',
    svg: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="8" width="32" height="32" rx="10" fill="#C7D2FE" stroke="#6366F1" strokeWidth="4" />
        <circle cx="24" cy="24" r="7" fill="#6366F1" />
      </svg>
    ),
  },
  {
    id: 'avatar4',
    label: 'Cat',
    svg: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="28" rx="16" ry="14" fill="#FECACA" stroke="#F87171" strokeWidth="3" />
        <polygon points="10,18 14,6 18,18" fill="#FECACA" stroke="#F87171" strokeWidth="2" />
        <polygon points="38,18 34,6 30,18" fill="#FECACA" stroke="#F87171" strokeWidth="2" />
        <ellipse cx="18" cy="30" rx="2" ry="3" fill="#F87171" />
        <ellipse cx="30" cy="30" rx="2" ry="3" fill="#F87171" />
        <ellipse cx="24" cy="34" rx="3" ry="1.5" fill="#F87171" />
      </svg>
    ),
  },
];

export default avatarList; 