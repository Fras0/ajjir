
const inputLng = document.getElementById("lng");
const inputLat = document.getElementById("lat");

mapboxgl.accessToken =
  "pk.eyJ1IjoiZnJhcy1hc2thciIsImEiOiJjbGhic3I3ZmowNmd3M2ZwN2V2dXdyOTY4In0.hhf2C8ZWMt8O2pBxomB71g";

let currentLng;
let currenLat;
let map;
var markers = [];

const bounds = [
  [26.12592075086502, 22.946613779499017], // Southwest coordinates
  [31.596903867018, 32.2848772970581], // Northeast coordinates
];

async function getPreciseLocation() {
  if (navigator.geolocation) {
    await navigator.geolocation.getCurrentPosition(function (position) {
      currentLng = position.coords.longitude;
      currenLat = position.coords.latitude;
      console.log("Latitude: " + currenLat);
      console.log("longitude: " + currentLng);
    });
  } else {
    console.log("Geolocation is not supported");
  }
}
// function showExactPosition(position) {
//   currentLng = position.coords.longitude;
//   currenLat = position.coords.latitude;
//   console.log("Latitude: " + currenLat);
//   console.log("longitude: " + currentLng);
// }

getPreciseLocation();

setTimeout(function (){

    inputLng.value = currentLng;
    inputLat.value = currenLat;


if (currenLat && currentLng) {
  map = new mapboxgl.Map({
    container: "map", // container id
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: "mapbox://styles/mapbox/streets-v12",
    center: [currentLng, currenLat], // starting position
    // center: [currentLng, currenLat], // starting position
    zoom: 10, // starting zoom
    maxBounds: bounds,
  });

  const marker1 = new mapboxgl.Marker()
    .setLngLat([currentLng, currenLat])
    .addTo(map);
  markers.push(marker1);

  console.log("first");
} else {
  map = new mapboxgl.Map({
    container: "map", // container id
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: "mapbox://styles/mapbox/streets-v12",
    center: [31.24975387489394, 30.02502565267713], // starting position
    // center: [currentLng, currenLat], // starting position
    zoom: 12, // starting zoom
    maxBounds: bounds,
  });
  const marker1 = new mapboxgl.Marker()
    .setLngLat([31.24975387489394, 30.02502565267713])
    .addTo(map);
  markers.push(marker1);
  console.log("second");
}

map.on("click", (e) => {
  // document.getElementById("info").innerHTML =
  //   // `e.point` is the x, y coordinates of the `mousemove` event
  //   // relative to the top-left corner of the map.
  //   JSON.stringify(e.point) +
  //   "<br />" +
  //   // `e.lngLat` is the longitude, latitude geographical position of the event.
  //   JSON.stringify(e.lngLat.wrap());

  if (markers.length != 0) {
    for (const marker of markers) {
      marker.remove();
    }
  }
  const marker1 = new mapboxgl.Marker()
    .setLngLat([e.lngLat.lng, e.lngLat.lat])
    .addTo(map);
  markers.push(marker1);

  const features = map.queryRenderedFeatures(e.point);
  // console.log(features.length);
  if (features.length != 0) {
    console.log(features[0].properties.name_en);
    //   console.log(features[0]);
  }
  console.log(e.lngLat.lng, e.lngLat.lat);
  inputLng.value = e.lngLat.lng;
  inputLat.value = e.lngLat.lat;
});


},1000)