import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { BoardSelector } from '../components/BoardSelector';
import { BoardView } from '../components/BoardView';
import { AppSidebar } from '../components/AppSidebar';
import { PromptDialog } from '../components/PromptDialog';
import { SidebarProvider } from '../components/ui/sidebar';

const Index = () => {
  const { state, dispatch } = useApp();
  const [promptDialog, setPromptDialog] = useState<{
    open: boolean;
    title: string;
    description?: string;
    placeholder?: string;
    defaultValue?: string;
    showColorPicker?: boolean;
    onConfirm: (value: string, color?: string) => void;
  }>({
    open: false,
    title: '',
    showColorPicker: false,
    onConfirm: () => {},
  });

  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  useEffect(() => {
    const handleCreateBoard = () => {
      setPromptDialog({
        open: true,
        title: 'Create New Board',
        description: 'Enter a name for your new board and choose a color',
        placeholder: 'Enter board title...',
        showColorPicker: true,
        onConfirm: (title, color) => {
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

    window.addEventListener('createBoard', handleCreateBoard);
    return () => window.removeEventListener('createBoard', handleCreateBoard);
  }, [dispatch]);

  useEffect(() => {
    (window as any).showPromptDialog = (config: any) => {
      setPromptDialog({
        open: true,
        showColorPicker: false,
        ...config,
      });
    };
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50 dark:bg-slate-900">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-hidden">
            {state.currentBoardId ? <BoardView /> : <BoardSelector />}
          </div>
        </div>
      </div>
      
      <PromptDialog
        open={promptDialog.open}
        onOpenChange={(open) => setPromptDialog({ ...promptDialog, open })}
        title={promptDialog.title}
        description={promptDialog.description}
        placeholder={promptDialog.placeholder}
        defaultValue={promptDialog.defaultValue}
        showColorPicker={promptDialog.showColorPicker}
        onConfirm={promptDialog.onConfirm}
      />
    </SidebarProvider>
  );
};

export default Index;
