// Get all image cards from the page.
const galleryItems = document.querySelectorAll(".gallery-item");

// Get all category buttons from the page.
const filterButtons = document.querySelectorAll(".filter-button");

// Get the lightbox and its controls.
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const closeButton = document.getElementById("close-button");
const previousButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");

// Save the number of the image currently shown in the lightbox.
let currentImageIndex = 0;

// Open the large-image view.
function openLightbox(index) {
  // Remember which card was clicked.
  currentImageIndex = index;

  // Find the small image inside that card.
  const clickedImage = galleryItems[currentImageIndex].querySelector("img");

  // Copy its image link and alternative text to the large image.
  lightboxImage.src = clickedImage.src;
  lightboxImage.alt = clickedImage.alt;

  // Make the hidden lightbox visible.
  lightbox.classList.add("show");
}

// Close the large-image view.
function closeLightbox() {
  lightbox.classList.remove("show");
}

// Move forward or backward through the images.
function changeImage(direction) {
  // direction is 1 for next and -1 for previous.
  currentImageIndex = currentImageIndex + direction;

  // If we go beyond the last image, go to the first image.
  if (currentImageIndex >= galleryItems.length) {
    currentImageIndex = 0;
  }

  // If we go before the first image, go to the last image.
  if (currentImageIndex < 0) {
    currentImageIndex = galleryItems.length - 1;
  }

  // Put the new image into the lightbox.
  const newImage = galleryItems[currentImageIndex].querySelector("img");
  lightboxImage.src = newImage.src;
  lightboxImage.alt = newImage.alt;
}

// Make every gallery card clickable.
galleryItems.forEach(function (item, index) {
  item.addEventListener("click", function () {
    openLightbox(index);
  });
});

// Make the X button close the lightbox.
closeButton.addEventListener("click", closeLightbox);

// Make the left arrow show the previous image.
previousButton.addEventListener("click", function () {
  changeImage(-1);
});

// Make the right arrow show the next image.
nextButton.addEventListener("click", function () {
  changeImage(1);
});

// Close the lightbox when the dark background is clicked.
lightbox.addEventListener("click", function (event) {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Make the category buttons work.
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Read the category from the clicked button.
    const selectedCategory = button.dataset.category;

    // Remove the dark active style from every button.
    filterButtons.forEach(function (otherButton) {
      otherButton.classList.remove("active");
    });

    // Add the dark active style to the button just clicked.
    button.classList.add("active");

    // Check every image card.
    galleryItems.forEach(function (item) {
      const itemCategory = item.dataset.category;

      // Show all images for All; otherwise, show only matching images.
      if (selectedCategory === "all" || itemCategory === selectedCategory) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });
  });
});

// Allow keyboard controls while the lightbox is open.
document.addEventListener("keydown", function (event) {
  // Stop if the lightbox is not visible.
  if (!lightbox.classList.contains("show")) {
    return;
  }

  // Escape key closes it.
  if (event.key === "Escape") {
    closeLightbox();
  }

  // Arrow keys change images.
  if (event.key === "ArrowRight") {
    changeImage(1);
  }

  if (event.key === "ArrowLeft") {
    changeImage(-1);
  }
});
