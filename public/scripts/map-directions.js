const originLngElement = +document.getElementById("origin-lng").value;
const originLatElement = +document.getElementById("origin-lat").value;
const destinationLngElement = +document.getElementById("dest-lng").value;
const destinationLatElement = +document.getElementById("dest-lat").value;

mapboxgl.accessToken =
  "pk.eyJ1IjoiZnJhcy1hc2thciIsImEiOiJjbGhic3I3ZmowNmd3M2ZwN2V2dXdyOTY4In0.hhf2C8ZWMt8O2pBxomB71g";
const map = new mapboxgl.Map({
  container: "map",
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/streets-v12",
  center: [originLngElement, originLatElement],
  zoom: 13,
});

map.addControl(
  new MapboxDirections({
    accessToken: mapboxgl.accessToken,
  }),
  "top-left"
);

const originMark = new mapboxgl.Marker({ color: "green" })
  .setLngLat([originLngElement, originLatElement])
  .addTo(map);
const destMark = new mapboxgl.Marker({ color: "red" })
  .setLngLat([destinationLngElement, destinationLatElement])
  .addTo(map);
// inputElement1 = document.querySelector("#mapbox-directions-origin-input input");
// inputElement1.value = "-79.4512, 43.6568";
// inputElement2 = document.querySelector("#mapbox-directions-destination-input input");
// inputElement2.value = "-79.44032,43.67001";
