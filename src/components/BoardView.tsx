import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, X } from 'lucide-react';
import { ListComponent } from './ListComponent';
import { ColorPicker } from './ColorPicker';

export function BoardView() {
  const { state, dispatch } = useApp();
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');

  const currentBoard = state.boards.find(board => board.id === state.currentBoardId);

  if (!currentBoard) {
    return null;
  }

  const handleAddList = () => {
    if (newListTitle.trim()) {
      const newList = {
        id: crypto.randomUUID(),
        title: newListTitle.trim(),
        boardId: currentBoard.id,
        position: currentBoard.lists.length,
        color: selectedColor,
        cards: [],
        createdAt: new Date(),
      };
      
      dispatch({
        type: 'ADD_LIST',
        payload: { boardId: currentBoard.id, list: newList },
      });
      
      setNewListTitle('');
      setSelectedColor('#3b82f6');
      setIsAddingList(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddList();
    } else if (e.key === 'Escape') {
      setIsAddingList(false);
      setNewListTitle('');
      setSelectedColor('#3b82f6');
    }
  };

  return (
    <div className="h-full bg-trello-bg dark:bg-trello-bg-dark p-4 overflow-x-auto custom-scrollbar">
      <div className="flex gap-4 min-w-max">
        {currentBoard.lists.map((list) => (
          <ListComponent
            key={list.id}
            list={list}
            boardId={currentBoard.id}
          />
        ))}

        <div className="flex-shrink-0 w-72">
          {isAddingList ? (
            <div className="bg-trello-list dark:bg-trello-list-dark p-3 rounded-lg border border-trello-border dark:border-trello-border-dark">
              <Input
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter list title..."
                className="mb-2 bg-white dark:bg-trello-card-dark border-gray-300 dark:border-gray-600"
                autoFocus
              />
              
              <div className="mb-3">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                  Choose a color:
                </label>
                <ColorPicker
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleAddList}
                  size="sm"
                  className="bg-trello-primary hover:bg-blue-600 text-white"
                >
                  Add List
                </Button>
                <Button
                  onClick={() => {
                    setIsAddingList(false);
                    setNewListTitle('');
                    setSelectedColor('#3b82f6');
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setIsAddingList(true)}
              variant="ghost"
              className="w-full h-12 bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 border-2 border-dashed border-gray-400 dark:border-gray-600 text-trello-text-secondary dark:text-trello-text-secondary-dark hover:text-trello-text dark:hover:text-trello-text-dark transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add a list
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
