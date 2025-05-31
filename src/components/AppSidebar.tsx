import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Calendar, Plus } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from './ui/sidebar';
import { formatDistanceToNow } from 'date-fns';

export function AppSidebar() {
  const { state, dispatch } = useApp();
  const { state: sidebarState } = useSidebar();

  const handleCreateBoard = () => {    
    const event = new CustomEvent('createBoard');
    window.dispatchEvent(event);
  };

  const handleSelectBoard = (boardId: string) => {
    dispatch({ type: 'SET_CURRENT_BOARD', payload: boardId });
  };

  const handleBackToBoards = () => {
    dispatch({ type: 'SET_CURRENT_BOARD', payload: null });
  };

  const isCollapsed = sidebarState === 'collapsed';

  return (
    <Sidebar 
      className={isCollapsed ? "w-14" : "w-64"} 
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleBackToBoards}>
                  <Home className="mr-2 h-4 w-4" />
                  {!isCollapsed && <span>All Boards</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleCreateBoard}>
                  <Plus className="mr-2 h-4 w-4" />
                  {!isCollapsed && <span>Create Board</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {state.boards.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Your Boards</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {state.boards.map((board) => (
                  <SidebarMenuItem key={board.id}>
                    <SidebarMenuButton 
                      onClick={() => handleSelectBoard(board.id)}
                      isActive={state.currentBoardId === board.id}
                      size="lg"
                      className="h-auto min-h-[3rem] py-3"
                    >
                      <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="flex flex-col items-start w-full">
                          <span className="truncate font-medium">{board.title}</span>
                          <span className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {formatDistanceToNow(board.updatedAt, { addSuffix: true })}
                          </span>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
