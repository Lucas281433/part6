import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdote";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    updateAnecdote(state, action) {
      const updatedAnecdote = action.payload;
      return state.map((a) =>
        a.id === updatedAnecdote.id ? updatedAnecdote : a
      );
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { updateAnecdote, appendAnecdote, setAnecdotes } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.create(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const giveVote = (id) => {
  return async (dispatch, getState) => {
    const state = getState()
    const anecdoteToChange = state.anecdotes.find(a => a.id === id)

    const updatedVote = await anecdoteService.update(id, {
      ...anecdoteToChange,
      votes: anecdoteToChange.votes + 1,
    });
    dispatch(updateAnecdote(updatedVote));
  };
};

export default anecdoteSlice.reducer;
