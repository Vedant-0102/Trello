import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { List } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, MoreHorizontal, X, Trash2 } from 'lucide-react';
import { CardComponent } from './CardComponent';
import { ConfirmDialog } from './ConfirmDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ListComponentProps {
  list: List;
  boardId: string;
}

export function ListComponent({ list, boardId }: ListComponentProps) {
  const { dispatch } = useApp();
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      const newCard = {
        id: crypto.randomUUID(),
        title: newCardTitle.trim(),
        description: '',
        listId: list.id,
        position: list.cards.length,
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dispatch({
        type: 'ADD_CARD',
        payload: { boardId, listId: list.id, card: newCard },
      });

      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };

  const handleUpdateTitle = () => {
    if (editTitle.trim() && editTitle !== list.title) {
      dispatch({
        type: 'UPDATE_LIST',
        payload: { boardId, listId: list.id, title: editTitle.trim() },
      });
    }
    setIsEditingTitle(false);
  };

  const handleDeleteList = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteList = () => {
    dispatch({
      type: 'DELETE_LIST',
      payload: { boardId, listId: list.id },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isEditingTitle) {
        handleUpdateTitle();
      } else {
        handleAddCard();
      }
    } else if (e.key === 'Escape') {
      if (isEditingTitle) {
        setEditTitle(list.title);
        setIsEditingTitle(false);
      } else {
        setIsAddingCard(false);
        setNewCardTitle('');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('list-drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('list-drag-over');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('list-drag-over');

    const cardId = e.dataTransfer.getData('cardId');
    const sourceListId = e.dataTransfer.getData('listId');

    if (cardId && sourceListId && sourceListId !== list.id) {
      dispatch({
        type: 'MOVE_CARD',
        payload: {
          boardId,
          cardId,
          sourceListId,
          targetListId: list.id,
          newPosition: list.cards.length,
        },
      });
    }
  };

  return (
    <>
      <div
        className="flex-shrink-0 w-72 bg-slate-100 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700 relative overflow-hidden"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {list.color && (
          <div 
            className="absolute top-0 left-0 w-full h-1"
            style={{ backgroundColor: list.color }}
          />
        )}

        <div className="flex items-center justify-between mb-3 mt-1">
          {isEditingTitle ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleUpdateTitle}
              onKeyDown={handleKeyPress}
              className="text-sm font-medium bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 px-2 py-1 rounded flex-1 text-left"
            >
              {list.title}
            </button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1 h-6 w-6 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <DropdownMenuItem
                onClick={handleDeleteList}
                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
          {list.cards.map((card) => (
            <CardComponent
              key={card.id}
              card={card}
              boardId={boardId}
              listId={list.id}
            />
          ))}
        </div>

        <div className="mt-3">
          {isAddingCard ? (
            <div className="space-y-2">
              <Input
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter a title for this card..."
                className="text-sm bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAddCard}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Add Card
                </Button>
                <Button
                  onClick={() => {
                    setIsAddingCard(false);
                    setNewCardTitle('');
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 dark:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setIsAddingCard(true)}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add a card
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete List"
        description="Are you sure you want to delete this list? All cards will be deleted."
        onConfirm={confirmDeleteList}
      />
    </>
  );
}
