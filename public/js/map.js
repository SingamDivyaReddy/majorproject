mapboxgl.accessToken = maptoken;

const popupOffsets = {
  top: [0, 25],
  bottom: [0, -25],
  left: [25, 0],
  right: [-25, 0]
};

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11', // Ensure map has a style!
  center: listing.geometry.coordinates,
  zoom: 9
});

const marker = new mapboxgl.Marker({ color: 'red' })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: popupOffsets }).setHTML(
      `<h3>${listing.location}</h3><p>Exact location will be provided after booking!</p>`
    )
  )
  .addTo(map);
