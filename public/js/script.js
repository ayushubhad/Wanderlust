/**
 * Wanderlust Noir Client Scripts
 */
document.addEventListener("DOMContentLoaded", () => {
  
  /* --------------------------------------------------------------------------
     1. FORM VALIDATION
     -------------------------------------------------------------------------- */
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("was-validated");
    }, false);
  });

  /* --------------------------------------------------------------------------
     2. NAVBAR USER PROFILE DROPDOWN
     -------------------------------------------------------------------------- */
  const userMenuBtn = document.getElementById("user-menu-btn");
  const userDropdownMenu = document.getElementById("user-dropdown-menu");

  if (userMenuBtn && userDropdownMenu) {
    userMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isHidden = userDropdownMenu.classList.contains("d-none");
      if (isHidden) {
        userDropdownMenu.classList.remove("d-none");
        userMenuBtn.setAttribute("aria-expanded", "true");
      } else {
        userDropdownMenu.classList.add("d-none");
        userMenuBtn.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("click", (e) => {
      if (!userMenuBtn.contains(e.target) && !userDropdownMenu.contains(e.target)) {
        userDropdownMenu.classList.add("d-none");
        userMenuBtn.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        userDropdownMenu.classList.add("d-none");
        userMenuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. CATEGORIES ACTIVE STATE
     -------------------------------------------------------------------------- */
  const categoriesTrack = document.getElementById("categories-track");
  if (categoriesTrack) {
    const urlParams = new URLSearchParams(window.location.search);
    const activeCategory = urlParams.get("category");
    const chips = categoriesTrack.querySelectorAll(".noir-category-btn");

    chips.forEach((chip) => {
      const chipCategory = chip.getAttribute("data-category");
      if (!activeCategory && chipCategory === "All") {
        chip.classList.add("active");
      } else if (activeCategory && chipCategory && chipCategory.toLowerCase().replace(/ /g, "-") === activeCategory.toLowerCase().replace(/ /g, "-")) {
        chip.classList.add("active");
        chip.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      } else {
        chip.classList.remove("active");
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. DRAG & DROP PHOTO UPLOAD WITH LIVE PREVIEW
     -------------------------------------------------------------------------- */
  const dropzone = document.getElementById("dropzone");
  const imageInput = document.getElementById("image-input");
  const imagePreview = document.getElementById("image-preview");
  const previewImg = document.getElementById("preview-img");

  if (dropzone && imageInput) {
    ["dragenter", "dragover"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove("dragover");
      });
    });

    dropzone.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        imageInput.files = files;
        showPreview(files[0]);
      }
    });

    imageInput.addEventListener("change", () => {
      if (imageInput.files.length > 0) {
        showPreview(imageInput.files[0]);
      }
    });

    function showPreview(file) {
      if (file && file.type.startsWith("image/") && imagePreview && previewImg) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImg.src = e.target.result;
          imagePreview.classList.remove("d-none");
        };
        reader.readAsDataURL(file);
      }
    }
  }

  /* --------------------------------------------------------------------------
     5. TOAST NOTIFICATIONS AUTO-DISMISS
     -------------------------------------------------------------------------- */
  const toastItems = document.querySelectorAll(".noir-toast-item");
  toastItems.forEach((toast) => {
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-10px)";
      setTimeout(() => toast.remove(), 350);
    }, 4500);
  });

});