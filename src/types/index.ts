export interface Card {
  id: string;
  title: string;
  description: string;
  listId: string;
  position: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: Date;
}

export interface List {
  id: string;
  title: string;
  boardId: string;
  position: number;
  cards: Card[];
  color?: string;
  createdAt: Date;
}

export interface Board {
  id: string;
  title: string;
  lists: List[];
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppState {
  boards: Board[];
  currentBoardId: string | null;
  isDarkMode: boolean;
}

export type AppAction = 
  | { type: 'ADD_BOARD'; payload: Board }
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
