import React, { useCallback, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useConversations } from "../contexts/ConversationContext";

export default function OpenConversation() {
  const [text, setText] = useState("");
  const { sendMessage, selectConversation } = useConversations();
  function handleSubmit(e) {
    e.preventDefault();

    sendMessage(
      selectConversation.recipients.map((recipient) => recipient.id),
      text
    );

    setText("");
  }

  const setLastMessageRef = useCallback((node) => {
    node && node.scrollIntoView({ smooth: true });
  }, []);

  return (
    <div className="d-flex flex-column flex-grow-1">
      <div className="flex-grow-1 overflow-auto">
        <div className="d-flex flex-column align-items-start justify-content-end px-3">
          {selectConversation.messages.map((message, index) => {
            const lastMessage =
              index + 1 === selectConversation.messages.length;
            return (
              <div
                ref={lastMessage ? setLastMessageRef : null}
                key={index}
                className={`my-1 d-flex flex-column ${
                  message.fromMe ? "align-self-end align-items-end" : "align-items-start"
                }`}
              >
                <div
                  className={`rounded px-2 py-1 ${
                    message.fromMe ? "bg-primary text-white" : "border"
                  }`}
                >
                  {message.text}
                </div>
                <div
                  className={`text-muted small ${
                    message.fromMe ? "text-right" : ""
                  }`}
                >
                  {message.fromMe ? "You" : message.senderName}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="m-2">
          <InputGroup>
            <Form.Control
              as="textarea"
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ height: "75px", resize: "none" }}
            />
            <InputGroup.Append>
              <Button type="submit">Send</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </Form>
    </div>
  );
}
