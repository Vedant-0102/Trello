import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Board, List, Card, Comment } from '../types';

type AppAction =
  | { type: 'SET_BOARDS'; payload: Board[] }
  | { type: 'ADD_BOARD'; payload: Board }
  | { type: 'UPDATE_BOARD'; payload: { id: string; title: string } }
  | { type: 'DELETE_BOARD'; payload: string }
  | { type: 'SET_CURRENT_BOARD'; payload: string }
  | { type: 'ADD_LIST'; payload: { boardId: string; list: List } }
  | { type: 'UPDATE_LIST'; payload: { boardId: string; listId: string; title: string } }
  | { type: 'DELETE_LIST'; payload: { boardId: string; listId: string } }
  | { type: 'ADD_CARD'; payload: { boardId: string; listId: string; card: Card } }
  | { type: 'UPDATE_CARD'; payload: { boardId: string; listId: string; cardId: string; updates: Partial<Card> } }
  | { type: 'DELETE_CARD'; payload: { boardId: string; listId: string; cardId: string } }
  | { type: 'MOVE_CARD'; payload: { boardId: string; cardId: string; sourceListId: string; targetListId: string; newPosition: number } }
  | { type: 'ADD_COMMENT'; payload: { boardId: string; listId: string; cardId: string; comment: Comment } }
  | { type: 'DELETE_COMMENT'; payload: { boardId: string; listId: string; cardId: string; commentId: string } }
  | { type: 'TOGGLE_DARK_MODE' };

const initialState: AppState = {
  boards: [],
  currentBoardId: null,
  isDarkMode: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_BOARDS':
      return { ...state, boards: action.payload };
    
    case 'ADD_BOARD':
      return { ...state, boards: [...state.boards, action.payload] };
    
    case 'UPDATE_BOARD':
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.id
            ? { ...board, title: action.payload.title, updatedAt: new Date() }
            : board
        ),
      };
    
    case 'DELETE_BOARD':
      return {
        ...state,
        boards: state.boards.filter(board => board.id !== action.payload),
        currentBoardId: state.currentBoardId === action.payload ? null : state.currentBoardId,
      };
    
    case 'SET_CURRENT_BOARD':
      return { ...state, currentBoardId: action.payload };
    
    case 'ADD_LIST':
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.boardId
            ? { ...board, lists: [...board.lists, action.payload.list], updatedAt: new Date() }
            : board
        ),
      };
    
    case 'UPDATE_LIST':
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.boardId
            ? {
                ...board,
                lists: board.lists.map(list =>
                  list.id === action.payload.listId
                    ? { ...list, title: action.payload.title }
                    : list
                ),
                updatedAt: new Date(),
              }
            : board
        ),
      };
    
    case 'DELETE_LIST':
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.boardId
            ? {
                ...board,
                lists: board.lists.filter(list => list.id !== action.payload.listId),
                updatedAt: new Date(),
              }
            : board
        ),
      };
    
    case 'ADD_CARD':
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.boardId
            ? {
                ...board,
                lists: board.lists.map(list =>
                  list.id === action.payload.listId
                    ? { ...list, cards: [...list.cards, action.payload.card] }
                    : list
                ),
                updatedAt: new Date(),
              }
            : board
        ),
      };
    
    case 'UPDATE_CARD':
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.boardId
            ? {
                ...board,
                lists: board.lists.map(list =>
                  list.id === action.payload.listId
                    ? {
                        ...list,
                        cards: list.cards.map(card =>
                          card.id === action.payload.cardId
                            ? { ...card, ...action.payload.updates, updatedAt: new Date() }
                            : card
                        ),
                      }
                    : list
                ),
                updatedAt: new Date(),
              }
            : board
        ),
      };
    
    case 'DELETE_CARD':
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.boardId
            ? {
                ...board,
                lists: board.lists.map(list =>
                  list.id === action.payload.listId
                    ? { ...list, cards: list.cards.filter(card => card.id !== action.payload.cardId) }
                    : list
                ),
                updatedAt: new Date(),
              }
            : board
        ),
      };
    
    case 'MOVE_CARD':
      const { boardId, cardId, sourceListId, targetListId, newPosition } = action.payload;
      return {
        ...state,
        boards: state.boards.map(board => {
          if (board.id !== boardId) return board;
          
          const sourceList = board.lists.find(list => list.id === sourceListId);
          const targetList = board.lists.find(list => list.id === targetListId);
          const cardToMove = sourceList?.cards.find(card => card.id === cardId);
          
          if (!sourceList || !targetList || !cardToMove) return board;
          
          const newSourceCards = sourceList.cards.filter(card => card.id !== cardId);
          
          const updatedCard = { ...cardToMove, listId: targetListId, position: newPosition };
          const newTargetCards = [...targetList.cards];
          newTargetCards.splice(newPosition, 0, updatedCard);
          
          return {
            ...board,
            lists: board.lists.map(list => {
              if (list.id === sourceListId) {
                return { ...list, cards: newSourceCards };
              }
              if (list.id === targetListId) {
                return { ...list, cards: newTargetCards };
              }
              return list;
            }),
            updatedAt: new Date(),
          };
        }),
      };
    
    case 'ADD_COMMENT':
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.boardId
            ? {
                ...board,
                lists: board.lists.map(list =>
                  list.id === action.payload.listId
                    ? {
                        ...list,
                        cards: list.cards.map(card =>
                          card.id === action.payload.cardId
                            ? {
                                ...card,
                                comments: [...card.comments, action.payload.comment],
                                updatedAt: new Date(),
                              }
                            : card
                        ),
                      }
                    : list
                ),
                updatedAt: new Date(),
              }
            : board
        ),
      };
    
    case 'DELETE_COMMENT':
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.boardId
            ? {
                ...board,
                lists: board.lists.map(list =>
                  list.id === action.payload.listId
                    ? {
                        ...list,
                        cards: list.cards.map(card =>
                          card.id === action.payload.cardId
                            ? {
                                ...card,
                                comments: card.comments.filter(comment => comment.id !== action.payload.commentId),
                                updatedAt: new Date(),
                              }
                            : card
                        ),
                      }
                    : list
                ),
                updatedAt: new Date(),
              }
            : board
        ),
      };
    
    case 'TOGGLE_DARK_MODE':
      return { ...state, isDarkMode: !state.isDarkMode };
    
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedData = localStorage.getItem('trello-app-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        const boards = parsedData.boards.map((board: any) => ({
          ...board,
          createdAt: new Date(board.createdAt),
          updatedAt: new Date(board.updatedAt),
          lists: board.lists.map((list: any) => ({
            ...list,
            createdAt: new Date(list.createdAt),
            cards: list.cards.map((card: any) => ({
              ...card,
              createdAt: new Date(card.createdAt),
              updatedAt: new Date(card.updatedAt),
              comments: card.comments.map((comment: any) => ({
                ...comment,
                createdAt: new Date(comment.createdAt),
              })),
            })),
          })),
        }));
        
        dispatch({ type: 'SET_BOARDS', payload: boards });
        
        if (parsedData.currentBoardId) {
          dispatch({ type: 'SET_CURRENT_BOARD', payload: parsedData.currentBoardId });
        }
        
        if (parsedData.isDarkMode) {
          dispatch({ type: 'TOGGLE_DARK_MODE' });
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('trello-app-data', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
