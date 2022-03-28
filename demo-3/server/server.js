const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/goolge-docs", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    method: ["GET", "POST"],
  },
});

const Document = require("./Document");
const defaultltValue = "";

io.on("connection", (socket) => {
  socket.on("get-document", (documentId) => {
    const data = "";
    socket.join(documentId);

    socket.emit("load-document", data);

    socket.on("send-change", (delta) => {
      socket.broadcast.to(documentId).emit("receive-change", delta);
    });
  });
});

async function findOrCreateDocument(documentId) {
  if (id === null) return;

  const document = await Document.findById(documentId);

  if (document) return document;

  return await Document.create({ _id: documentId, data: defaultltValue });
}
