import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "../request";
import { useNotificationDispatch } from "../NotificationContext";

const AnecdoteForm = () => {
  const dispatch = useNotificationDispatch();
  const queryClient = useQueryClient();
  const newAnecdoteMutation = useMutation({
    mutationFn: create,
    onSuccess: (anecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], anecdotes.concat(anecdote));
    },
    onError: (error) => {
      dispatch({
        type: "SHOW_NOTIFICATION",
        payload:
          error.response.data.error ||
          "Too short anecdote, must have length 5 or more",
      });
      setTimeout(() => {
        dispatch({ type: "HIDE_NOTIFICATION" });
      }, 5000);
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    console.log("new anecdote");
    newAnecdoteMutation.mutate({ content, votes: 0 });
    dispatch({
      type: "SHOW_NOTIFICATION",
      payload: `Created anecdote '${content}'`,
    });
    setTimeout(() => {
      dispatch({ type: "HIDE_NOTIFICATION" });
    }, 5000);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
