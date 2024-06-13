import { ChakraProvider } from "@chakra-ui/react";
import Form from "./Form";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import TabsComponent from "../Tabs";

function App() {
  return (
    <ChakraProvider>
      <div>
        <Example />
        <Form />
      </div>
      <div>
        <TabsComponent />
      </div>
    </ChakraProvider>
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
