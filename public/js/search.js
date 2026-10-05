/**
 * Wanderlust Dark Theme Live Search Auto-Suggest
 */
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("#search-input");
  const searchSuggestions = document.querySelector("#search-suggestions");

  if (!searchInput || !searchSuggestions) return;

  let debounceTimeout = null;
  let activeIndex = -1;

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    const query = searchInput.value.trim();

    if (query.length === 0) {
      searchSuggestions.innerHTML = "";
      searchSuggestions.classList.add("d-none");
      activeIndex = -1;
      return;
    }

    debounceTimeout = setTimeout(async () => {
      try {
        const res = await fetch(`/listings/suggest?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Search query failed");
        
        const listings = await res.json();
        searchSuggestions.innerHTML = "";
        activeIndex = -1;

        if (!listings || listings.length === 0) {
          searchSuggestions.innerHTML = `
            <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
              <i class="fa-solid fa-magnifying-glass" style="margin-right: 0.4rem;"></i>
              No stays matching "<strong>${escapeHTML(query)}</strong>"
            </div>
          `;
          searchSuggestions.classList.remove("d-none");
          return;
        }

        listings.forEach((listing) => {
          const itemLink = document.createElement("a");
          itemLink.href = `/listings/${listing._id}`;
          itemLink.className = "noir-suggestion-item";
          itemLink.setAttribute("role", "option");

          const imgUrl = (listing.image && listing.image.url) 
            ? listing.image.url 
            : "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=120&q=60";

          const formattedPrice = listing.price 
            ? `&#8377; ${listing.price.toLocaleString("en-IN")}` 
            : "Price on request";

          itemLink.innerHTML = `
            <img src="${imgUrl}" alt="${escapeHTML(listing.title)}" class="noir-suggestion-thumb" />
            <div style="flex: 1; min-width: 0;">
              <div class="noir-suggestion-title">${escapeHTML(listing.title)}</div>
              <div class="noir-suggestion-meta">${escapeHTML(listing.location || "")}, ${escapeHTML(listing.country || "")} &bull; ${formattedPrice}/night</div>
            </div>
            <i class="fa-solid fa-chevron-right" style="font-size: 0.75rem; color: var(--text-muted);"></i>
          `;

          searchSuggestions.appendChild(itemLink);
        });

        searchSuggestions.classList.remove("d-none");
      } catch (err) {
        console.error("Error fetching search suggestions:", err);
      }
    }, 220);
  });

  searchInput.addEventListener("keydown", (e) => {
    const items = searchSuggestions.querySelectorAll(".noir-suggestion-item");
    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
      updateActiveItem(items);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      updateActiveItem(items);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      items[activeIndex].click();
    } else if (e.key === "Escape") {
      searchSuggestions.classList.add("d-none");
    }
  });

  function updateActiveItem(items) {
    items.forEach((item, idx) => {
      if (idx === activeIndex) {
        item.classList.add("active");
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("active");
      }
    });
  }

  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
      searchSuggestions.classList.add("d-none");
    }
  });

  function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
});