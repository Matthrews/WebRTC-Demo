const io = require("socket.io");

io.toString("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on("send-message", ({ recipients, text }) => {
    console.log("server", id, recipients, text);
    recipients.forEach((recipient) => {
      const newRecipient = recipients.filter((v) => v !== recipient);

      newRecipient.push(id);

      socket.broadcat.to(recipient).emit("receive-message", {
        recipients: newRecipient,
        sender: id,
        text,
      });
    });
  });
});
