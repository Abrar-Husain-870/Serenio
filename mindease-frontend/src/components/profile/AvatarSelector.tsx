import React from 'react';
import avatarList, { AvatarItem } from './avatarList';

interface AvatarSelectorProps {
  value: string;
  onChange: (avatarId: string) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex gap-4 flex-wrap">
      {avatarList.map((avatar: AvatarItem) => (
        <button
          key={avatar.id}
          type="button"
          className={`rounded-full border-2 p-1 transition-all ${
            value === avatar.id
              ? 'border-primary-500 ring-2 ring-primary-300'
              : 'border-transparent hover:border-gray-300'
          }`}
          aria-label={avatar.label}
          onClick={() => onChange(avatar.id)}
        >
          {avatar.svg}
        </button>
      ))}
    </div>
  );
};

export default AvatarSelector; 