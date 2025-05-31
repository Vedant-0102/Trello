import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { MessageSquare, Clock, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ConfirmDialog } from './ConfirmDialog';

interface CardModalProps {
  card: Card;
  boardId: string;
  listId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CardModal({ card, boardId, listId, isOpen, onClose }: CardModalProps) {
  const { dispatch } = useApp();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [newComment, setNewComment] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);

  const handleUpdateCard = () => {
    dispatch({
      type: 'UPDATE_CARD',
      payload: {
        boardId,
        listId,
        cardId: card.id,
        updates: { title: title.trim(), description: description.trim() },
      },
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: crypto.randomUUID(),
        text: newComment.trim(),
        createdAt: new Date(),
      };

      dispatch({
        type: 'ADD_COMMENT',
        payload: { boardId, listId, cardId: card.id, comment },
      });

      setNewComment('');
    }
  };

  const handleDeleteComment = (commentId: string) => {
    dispatch({
      type: 'DELETE_COMMENT',
      payload: { boardId, listId, cardId: card.id, commentId },
    });
    setDeleteCommentId(null);
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdateCard();
      setIsEditingTitle(false);
    } else if (e.key === 'Escape') {
      setTitle(card.title);
      setIsEditingTitle(false);
    }
  };

  const handleCommentKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAddComment();
    }
  };

  const handleClose = () => {
    handleUpdateCard();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <div className="flex items-start justify-between pr-8">
              <div className="flex-1 mr-4">
                {isEditingTitle ? (
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => {
                      handleUpdateCard();
                      setIsEditingTitle(false);
                    }}
                    onKeyDown={handleTitleKeyPress}
                    className="text-lg font-semibold bg-transparent border-none p-0 focus:ring-0 text-slate-800 dark:text-slate-200"
                    autoFocus
                  />
                ) : (
                  <DialogTitle 
                    onClick={() => setIsEditingTitle(true)}
                    className="text-lg font-semibold text-slate-800 dark:text-slate-200 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded max-w-full break-words"
                  >
                    {card.title}
                  </DialogTitle>
                )}
              </div>
            </div>
            <DialogDescription className="sr-only">
              Edit card details and add comments
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Description
              </h3>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleUpdateCard}
                placeholder="Add a more detailed description..."
                className="min-h-24 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200"
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Comments ({card.comments.length})
              </h3>

              <div className="mb-4">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={handleCommentKeyPress}
                  placeholder="Write a comment..."
                  className="mb-2 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Press Ctrl+Enter to submit
                  </span>
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Add Comment
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {card.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-white dark:bg-slate-700 p-3 rounded-lg border border-slate-200 dark:border-slate-600 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-medium">U</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{formatDistanceToNow(comment.createdAt, { addSuffix: true })}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => setDeleteCommentId(comment.id)}
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                      {comment.text}
                    </p>
                  </div>
                ))}

                {card.comments.length === 0 && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                    No comments yet. Be the first to add one!
                  </p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteCommentId !== null}
        onOpenChange={(open) => !open && setDeleteCommentId(null)}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        onConfirm={() => deleteCommentId && handleDeleteComment(deleteCommentId)}
      />
    </>
  );
}
