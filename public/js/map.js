/**
 * Wanderlust Dark Theme Mapbox Integration
 */
document.addEventListener("DOMContentLoaded", () => {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  const token = typeof mapToken !== "undefined" && mapToken ? mapToken : mapElement.dataset.token;
  if (!token) {
    console.warn("Mapbox token not configured.");
    mapElement.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--bg-input);color:var(--text-muted);font-size:0.85rem;">
        <i class="fa-solid fa-map-location-dot" style="margin-right:0.5rem;"></i> Map preview available once token is set
      </div>
    `;
    return;
  }

  mapboxgl.accessToken = token;

  let coords = [72.8777, 19.0760]; // default fallback
  if (typeof coordinates !== "undefined" && Array.isArray(coordinates) && coordinates.length === 2) {
    coords = coordinates;
  }

  try {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/dark-v11",
      center: coords,
      zoom: 11,
      scrollZoom: false
    });

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

    const markerEl = document.createElement("div");
    markerEl.className = "noir-map-marker";
    markerEl.innerHTML = `<i class="fa-solid fa-compass" style="font-size: 1.1rem;"></i>`;

    const locationName = typeof listingLocation !== "undefined" ? listingLocation : "Location";
    const propertyTitle = typeof listingTitle !== "undefined" ? listingTitle : "Wanderlust Stay";

    const popup = new mapboxgl.Popup({ offset: 25, closeButton: true })
      .setHTML(`
        <div style="padding: 0.35rem; background: #0F1523; color: #F8FAFC; border-radius: 8px;">
          <div style="font-size: 0.9rem; font-weight: 700; color: #F8FAFC; margin-bottom: 0.2rem;">${propertyTitle}</div>
          <div style="font-size: 0.775rem; color: #94A3B8;"><i class="fa-solid fa-location-dot" style="color: #FFFFFF; margin-right: 0.25rem;"></i> ${locationName}</div>
        </div>
      `);

    new mapboxgl.Marker({ element: markerEl, anchor: "bottom" })
      .setLngLat(coords)
      .setPopup(popup)
      .addTo(map);

  } catch (err) {
    console.error("Mapbox initialization error:", err);
  }
});