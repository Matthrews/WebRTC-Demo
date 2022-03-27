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
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  })
  .catch((err) => {
    console.log("getUserMedia failed", err);
  });

socket.on("use-disconnect", (userId) => {
  console.log("User disconnected", userId);
  if (peers[userId]) {
    peers[userId].close();
  }
});

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });

  call.on("close", () => {
    video.remove();
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
