import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function BoardSelector() {
  const { state, dispatch } = useApp();

  const handleCreateBoard = () => {
    (window as any).showPromptDialog({
      title: 'Create New Board',
      description: 'Enter a name for your new board and choose a color',
      placeholder: 'Enter board title...',
      showColorPicker: true,
      onConfirm: (title: string, color: string) => {
        const newBoard = {
          id: crypto.randomUUID(),
          title,
          color,
          lists: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        dispatch({ type: 'ADD_BOARD', payload: newBoard });
        dispatch({ type: 'SET_CURRENT_BOARD', payload: newBoard.id });
      },
    });
  };

  if (state.boards.length === 0) {
    return (
      <div className="min-h-screen bg-trello-bg dark:bg-trello-bg-dark flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-trello-text dark:text-trello-text-dark mb-4">
            Welcome to Trello 
          </h2>
          <p className="text-trello-text-secondary dark:text-trello-text-secondary-dark mb-6">
            Create your first board to get started
          </p>
          <Button
            onClick={handleCreateBoard}
            className="bg-trello-primary hover:bg-blue-600 text-white"
          >
            Create Your First Board
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-trello-bg dark:bg-trello-bg-dark p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-trello-text dark:text-trello-text-dark">
            Your Boards
          </h2>
          <Button
            onClick={handleCreateBoard}
            className="bg-trello-primary hover:bg-blue-600 text-white"
          >
            Create New Board
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {state.boards.map((board) => (
            <div
              key={board.id}
              onClick={() => dispatch({ type: 'SET_CURRENT_BOARD', payload: board.id })}
              className="group bg-trello-card dark:bg-trello-card-dark border border-trello-border dark:border-trello-border-dark rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 relative overflow-hidden"
            >
              {board.color && (
                <div 
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ backgroundColor: board.color }}
                />
              )}
              
              <div className="flex items-start justify-between mb-3 mt-1">
                <h3 className="font-medium text-trello-text dark:text-trello-text-dark group-hover:text-trello-primary truncate">
                  {board.title}
                </h3>
              </div>

              <div className="flex items-center gap-4 text-sm text-trello-text-secondary dark:text-trello-text-secondary-dark">
                <span>{board.lists.length} lists</span>
                <span>
                  {board.lists.reduce((total, list) => total + list.cards.length, 0)} cards
                </span>
              </div>

              <div className="flex items-center gap-1 mt-3 text-xs text-trello-text-secondary dark:text-trello-text-secondary-dark">
                <Calendar className="w-3 h-3" />
                <span>Updated {formatDistanceToNow(board.updatedAt, { addSuffix: true })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
