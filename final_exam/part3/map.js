let map;
let service;
let autocomplete;
let markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 35.4676, lng: -97.5164 },
    zoom: 6,
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const position = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        map.setCenter(position);
        map.setZoom(12);
      },
      () => console.warn("User denied geolocation. Using default location.")
    );
  }

  const input = document.getElementById("searchInput");
  autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  document.getElementById("searchBtn").addEventListener("click", performSearch);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) return;
    clearMarkers();
    map.setCenter(place.geometry.location);
    map.setZoom(14);
    addMarker(place);
    showResults([place]);
  });
}

// Clear all markers
function clearMarkers() {
  markers.forEach((m) => m.setMap(null));
  markers = [];
}

// Perform search with top 5 results
function performSearch() {
  const query = document.getElementById("searchInput").value;
  if (!query) return;

  const request = {
    query,
    fields: ["name", "geometry", "formatted_address", "rating", "opening_hours", "types"],
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      const topFive = results.slice(0, 5); // only top 5 results

      clearMarkers();

      const bounds = new google.maps.LatLngBounds();
      topFive.forEach((p) => {
        if (p.geometry && p.geometry.location) bounds.extend(p.geometry.location);
      });
      map.fitBounds(bounds);

      showResults(topFive);
      topFive.forEach(addMarker);
    } else {
      console.warn("Search failed:", status);
    }
  });
}

// Add marker for each place
function addMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
    title: place.name,
  });

  markers.push(marker);
}

// Show the place which was chosen
function showResults(places) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  places.forEach((place, index) => {
    const isOpen = place.opening_hours ? place.opening_hours.isOpen() ? "Open now" : "Closed" : "Unknown";
    const rating = place.rating ? place.rating.toFixed(1) : "No rating";
    const type = place.types ? place.types[0].replaceAll("_", " ") : "Place";

    const card = document.createElement("div");
    card.classList.add("card");

    const statusClass = isOpen === "Open now" ? "open" : isOpen === "Closed" ? "closed" : "";

    card.innerHTML = `
      <h3>${index + 1}. ${place.name || "Unnamed Place"}</h3>
      <p>${place.formatted_address || "No address available"}</p>
      <div>
        <span class="badge">${type}</span>
        <span class="badge rating">★ ${rating}</span>
        <span class="badge ${statusClass}">${isOpen}</span>
      </div>
    `;

    // Focus marker when card is clicked
    card.addEventListener("click", () => {
      map.setCenter(place.geometry.location);
      map.setZoom(15);
    });

    resultsDiv.appendChild(card);
  });
}
