import "./App.css";
import ReactDOM from "react-dom/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import Form from "./Form";

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(<App />);

function App() {
  return (
    <div>
      <Example />
      <Form />
    </div>
  );
}

function Example() {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      axios
        .get("https://api.github.com/repos/tannerlinsley/react-query")
        .then((res) => res.data),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{" "}
      <strong>✨ {data.stargazers_count}</strong>{" "}
      <strong>🍴 {data.forks_count}</strong>
      <div>{isFetching ? "Updating..." : ""}</div>
    </div>
  );
}

export default App;
