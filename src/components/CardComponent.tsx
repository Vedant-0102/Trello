import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../types';
import { Button } from './ui/button';
import { MessageSquare, Trash2 } from 'lucide-react';
import { CardModal } from './CardModal';
import { ConfirmDialog } from './ConfirmDialog';

interface CardComponentProps {
  card: Card;
  boardId: string;
  listId: string;
}

export function CardComponent({ card, boardId, listId }: CardComponentProps) {
  const { dispatch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDeleteCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCard = () => {
    dispatch({
      type: 'DELETE_CARD',
      payload: { boardId, listId, cardId: card.id },
    });
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('cardId', card.id);
    e.dataTransfer.setData('listId', listId);
    e.currentTarget.classList.add('card-dragging');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    e.currentTarget.classList.remove('card-dragging');
  };

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={() => setIsModalOpen(true)}
        className={`group bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-3 cursor-pointer hover:shadow-md hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-200 ${
          isDragging ? 'opacity-50 transform rotate-2' : ''
        }`}
      >
        <div className="flex items-start justify-between">
          <h4 className="text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed flex-1 pr-2">
            {card.title}
          </h4>
          <Button
            onClick={handleDeleteCard}
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>

        {card.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
            {card.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            {card.comments.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <MessageSquare className="w-3 h-3" />
                <span>{card.comments.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <CardModal
        card={card}
        boardId={boardId}
        listId={listId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Card"
        description="Are you sure you want to delete this card? This action cannot be undone."
        onConfirm={confirmDeleteCard}
      />
    </>
  );
}
