import React from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import useLocalStorage from "../hooks/useLocalStorage";
import { ContactProvider } from "../contexts/ContactContext";
import { ConversationProvider } from "../contexts/ConversationContext";

function App() {
  const [id, setId] = useLocalStorage("id");
  return id ? (
    <ContactProvider>
      <ConversationProvider id={id}>
        <Dashboard id={id} />
      </ConversationProvider>
    </ContactProvider>
  ) : (
    <Login onIdSubmit={setId} />
  );
}

export default App;
