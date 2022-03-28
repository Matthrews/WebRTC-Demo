const mongoose = require("mongoose");
const Document = require("./Document");

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

const defaultltValue = "";

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);

    socket.emit("load-document", document.data);

    socket.on("send-change", (delta) => {
      socket.broadcast.to(documentId).emit("receive-change", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

async function findOrCreateDocument(documentId) {
  if (documentId === null) return;

  const document = await Document.findById(documentId);

  if (document) return document;

  return await Document.create({ _id: documentId, data: defaultltValue });
}
