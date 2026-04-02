
import React, { useState } from 'react';
import { X, Tag as TagIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const PRESET_COLORS = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500'];

const TagInput = ({ tags = [], onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const val = inputValue.trim().toLowerCase();
      if (!tags.some(t => t.text.toLowerCase() === val)) {
        const randomColor = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
        onChange([...tags, { id: Date.now().toString(), text: val, color: randomColor }]);
      }
      setInputValue('');
    }
  };

  const removeTag = (idToRemove) => {
    onChange(tags.filter(t => t.id !== idToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <Badge 
            key={tag.id} 
            variant="secondary" 
            className={`flex items-center gap-1 pl-2 text-white ${tag.color || 'bg-gray-500'} hover:${tag.color || 'bg-gray-500'}`}
          >
            {tag.text}
            <button 
              onClick={() => removeTag(tag.id)} 
              className="ml-1 hover:bg-black/20 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="relative">
        <TagIcon className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Add tags (press Enter)..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAddTag}
          className="pl-8 h-9 text-sm"
        />
      </div>
    </div>
  );
};

export default TagInput;
