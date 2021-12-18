export const displayMap = (locations) => {
  mapboxgl.accessToken = 'pk.eyJ1IjoicGhpbHotc3RpemxlcyIsImEiOiJja21rc3FmOTEwem80Mm5tazRuMXFnYXVuIn0.uY6nl1z2la3BQAzbQTDFsQ';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/philz-stizles/ckmkuaqj36flf18npkg6amj3g',
    scrollZoom: false
    // center: [],
    // zoom: 10,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds()
  locations.forEach(loc => {
    // Create Marker
    const el = document.createElement('div')
    el.className = 'marker'

    // Add Marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map)

    // Add popup
    new mapboxgl.Popup({
      offset: 35
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map)

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates)
  })

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  })
}