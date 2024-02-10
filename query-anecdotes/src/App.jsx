import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAll, update } from "./request";
import { useNotificationDispatch } from "./NotificationContext";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";

const App = () => {
  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()
  const voteMutation = useMutation({
    mutationFn: update,
    onSuccess: () => {
      queryClient.invalidateQueries(['anecdotes'])
    }
  })

  const handleVote = (anecdote) => {
    console.log("vote");
    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    voteMutation.mutate(updatedAnecdote)
    dispatch({ type: 'SHOW_NOTIFICATION',
      payload: `Anecdote '${anecdote.content}' voted`
    })
    setTimeout(() => {
      dispatch({ type: 'HIDE_NOTIFICATION' })
    }, 5000)
  };

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAll,
    retry: false,
    refetchOnWindowFocus: false,
    select: (data) => data.sort((a, b) => b.votes - a.votes)
  });

  if (result.isLoading) {
    return <div>Loading Data....</div>;
  }
  if (result.isError) {
    return <div>Anecdotes service not avaible due to Problems in Server</div>;
  }

  const anecdotes = result.data;
  //const mostVotedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
