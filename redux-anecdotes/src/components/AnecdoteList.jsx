import { useDispatch, useSelector } from "react-redux";
import { giveVote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";
import Notification from "./Notification";

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => {
    if (state.filter) {
      return state.anecdotes.filter((a) => a.content.includes(state.filter));
    }
    return state.anecdotes;
  });

  const dispatch = useDispatch();

  const vote = (id) => {
    console.log("vote", id);
    const votedAnecdote = anecdotes.find((a) => a.id === id);
    dispatch(giveVote(id));
    dispatch(setNotification(`You voted ${votedAnecdote.content}`, 10));
  };

  const anecdotesSorted = [...anecdotes].sort((a, b) => b.votes - a.votes);

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      {anecdotesSorted.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
