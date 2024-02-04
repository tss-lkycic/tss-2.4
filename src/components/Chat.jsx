// src/components/Chat.jsx
import React, { useState } from "react";
import { TextField, Button, Container, Grid } from "@mui/material";
import Message from "./Message";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    setMessages([...messages, input]);
    setInput("");
    // Add logic to handle chatbot response here
  };

  return (
    <Container>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          {messages.map((message, index) => (
            <Message key={index} text={message} isUser={index % 2 === 0} />
          ))}
        </Grid>
        <Grid item>
          <TextField
            label="Type your message"
            variant="outlined"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;
