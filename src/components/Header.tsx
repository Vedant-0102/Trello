import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Moon, Sun, Plus, Trash2 } from 'lucide-react';
import { SidebarTrigger } from './ui/sidebar';
import { ConfirmDialog } from './ConfirmDialog';

export function Header() {
  const { state, dispatch } = useApp();
  const currentBoard = state.boards.find(board => board.id === state.currentBoardId);
  const [isDeleteBoardDialogOpen, setIsDeleteBoardDialogOpen] = useState(false);

  const handleCreateBoard = () => {
    (window as any).showPromptDialog({
      title: 'Create New Board',
      description: 'Enter a name for your new board',
      placeholder: 'Enter board title...',
      onConfirm: (title: string) => {
        const newBoard = {
          id: crypto.randomUUID(),
          title,
          lists: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        dispatch({ type: 'ADD_BOARD', payload: newBoard });
        dispatch({ type: 'SET_CURRENT_BOARD', payload: newBoard.id });
      },
    });
  };

  const handleBoardTitleEdit = () => {
    if (!currentBoard) return;
    (window as any).showPromptDialog({
      title: 'Rename Board',
      description: 'Enter a new name for your board',
      placeholder: 'Enter board title...',
      defaultValue: currentBoard.title,
      onConfirm: (newTitle: string) => {
        if (newTitle !== currentBoard.title) {
          dispatch({
            type: 'UPDATE_BOARD',
            payload: { id: currentBoard.id, title: newTitle },
          });
        }
      },
    });
  };

  const handleDeleteBoard = () => {
    if (!currentBoard) return;
    setIsDeleteBoardDialogOpen(true);
  };

  const confirmDeleteBoard = () => {
    if (!currentBoard) return;
    dispatch({ type: 'DELETE_BOARD', payload: currentBoard.id });
    dispatch({ type: 'SET_CURRENT_BOARD', payload: null });
  };

  return (
    <>
      <header className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              Trello
            </h1>
            
            {currentBoard && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBoardTitleEdit}
                  className="text-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1 rounded-lg transition-colors"
                >
                  {currentBoard.title}
                </button>
                <Button
                  onClick={handleDeleteBoard}
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleCreateBoard}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create Board
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
              className="p-2"
            >
              {state.isDarkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <ConfirmDialog
        open={isDeleteBoardDialogOpen}
        onOpenChange={setIsDeleteBoardDialogOpen}
        title="Delete Board"
        description={`Are you sure you want to delete "${currentBoard?.title}"? This action cannot be undone.`}
        onConfirm={confirmDeleteBoard}
        confirmText="Delete"
        confirmVariant="destructive"
        cancelText="Cancel"
        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
      />
    </>
  );
}
