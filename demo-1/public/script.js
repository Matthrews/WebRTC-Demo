const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const peer = new Peer(undefined, {
  host: "/",
  port: "3001",
});

const peers = {};

const video = document.createElement("video");
video.muted = true;

navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    addVideoStream(video, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const v = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(v, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  })
  .catch((err) => {
    throw err;
  });

socket.on("use-disconnect", (userId) => {
  if (peers[userId]) {
    peers[userId].close();
  }
});

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  const call = peer.call(userId, stream);
  const d = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(d, userVideoStream);
  });

  call.on("close", () => {
    d.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  videoGrid.append(video);
}
