const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
  );
}

const map = L.map("map").setView([0, 0], 14);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "OpenStreetMap",
}).addTo(map);

const marker = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);
  if (marker[id]) {
    marker[id].setLatLng([latitude, longitude]);
  } else {
    marker[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", (id) => {
  if (marker[id]) {
    map.removeLayer(marker[id]);
  }
});