import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define the Todo interface
export interface ToDo {
    id: number; // id is required for unique identification
    text: string; // text should not be null
    status?: boolean; // status is optional
}

// Define the initial state
const initialState: ToDo[] = [];

// Create the slice
const todosSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        // Add a new todo
        addTodos: (state, action: PayloadAction<{ text: string }>) => {
            const newTodo: ToDo = {
                id: Date.now(),
                text: action.payload.text,
                status: false,
            };
            state.push(newTodo);
        },

        // Remove a todo by ID
        removeTodo: (state, action: PayloadAction<number>) => {
            return state.filter((todo) => todo.id !== action.payload);
        },

        // Update a todo by ID
        updateTodo: (state, action: PayloadAction<{ id: number; text: string }>) => {
            const { id, text } = action.payload;
            const todo = state.find((todo) => todo.id === id);
            if (todo) {
                todo.text = `${text} -(edited)`;
            }
        },

        // Toggle a todo's status by ID
        toggleTodo: (state, action: PayloadAction<number>) => {
            const todo = state.find((todo) => todo.id === action.payload);
            if (todo) {
                todo.status = !todo.status;
            }
        },

        // Load todos from localStorage or other sources
        loadFromStorage: (state, action: PayloadAction<ToDo[]>) => {
            return [...state, ...action.payload];
        },
    },
});

// Export action creators
export const { addTodos, removeTodo, updateTodo, toggleTodo, loadFromStorage } = todosSlice.actions;

// Export the reducer
export default todosSlice.reducer;
