document.addEventListener("DOMContentLoaded", function () {
  const slider = document.getElementById("productSlider");
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const dotsContainer = document.getElementById("sliderDots");

  const productCards = document.querySelectorAll(".product-card");
  const totalProducts = productCards.length;
  let displayCount; // Number of cards visible at once
  let currentIndex = 0;

  // Calculate how many products to show based on screen width
  function calculateDisplayCount() {
    if (window.innerWidth > 1024) {
      return 4; // Show 4 products on large screens
    } else if (window.innerWidth > 768) {
      return 3; // Show 3 products on medium screens
    } else if (window.innerWidth > 480) {
      return 2; // Show 2 products on small screens
    } else {
      return 1; // Show 1 product on extra small screens
    }
  }

  // Calculate total number of slides needed
  function calculateTotalSlides() {
    return totalProducts - displayCount + 1;
  }

  // Initialize the dots
  function initDots() {
    dotsContainer.innerHTML = "";
    const totalSlides = calculateTotalSlides();

    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("div");
      dot.classList.add("slider-dot");
      if (i === 0) {
        dot.classList.add("active");
      }

      dot.addEventListener("click", function () {
        goToSlide(i);
      });

      dotsContainer.appendChild(dot);
    }
  }

  // Update the active dot
  function updateDots() {
    const dots = document.querySelectorAll(".slider-dot");

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  // Move the slider to the specified index
  function goToSlide(index) {
    currentIndex = index;
    updateSlider();
  }

  // Update the slider position
  function updateSlider() {
    // Calculate maximum possible index
    const maxIndex = totalProducts - displayCount;

    // Ensure currentIndex doesn't go beyond limits
    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    }

    // Calculate card width including margins
    const card = productCards[0];
    const cardStyle = window.getComputedStyle(card);
    const cardWidth =
      card.offsetWidth +
      parseInt(cardStyle.marginLeft) +
      parseInt(cardStyle.marginRight);

    // Move the slider
    slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    // Update active dot
    updateDots();

    // Enable/disable navigation buttons
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex >= maxIndex;

    // Update visual state of buttons
    prevButton.style.opacity = currentIndex === 0 ? "0.5" : "1";
    nextButton.style.opacity = currentIndex >= maxIndex ? "0.5" : "1";
  }

  // Move to previous slide (one card at a time)
  function prevSlide() {
    currentIndex--;
    updateSlider();
  }

  // Move to next slide (one card at a time)
  function nextSlide() {
    currentIndex++;
    updateSlider();
  }

  // Initialize the slider
  function initSlider() {
    displayCount = calculateDisplayCount();
    initDots();
    updateSlider();
  }

  // Add event listeners
  prevButton.addEventListener("click", prevSlide);
  nextButton.addEventListener("click", nextSlide);

  // Handle window resize
  window.addEventListener("resize", function () {
    const newDisplayCount = calculateDisplayCount();

    if (newDisplayCount !== displayCount) {
      // Adjust current index if needed
      if (currentIndex > totalProducts - newDisplayCount) {
        currentIndex = totalProducts - newDisplayCount;
      }

      displayCount = newDisplayCount;
      initDots();
    }

    updateSlider();
  });

  // Initialize the slider
  initSlider();

  // Auto-play functionality (optional)
  let autoPlayInterval;

  function startAutoPlay() {
    autoPlayInterval = setInterval(function () {
      if (currentIndex < totalProducts - displayCount) {
        nextSlide();
      } else {
        currentIndex = 0;
        updateSlider();
      }
    }, 5000); // Change slide every 5 seconds
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  // Start auto-play
  startAutoPlay();

  // Pause auto-play when user interacts with the slider
  slider.addEventListener("mouseover", stopAutoPlay);
  prevButton.addEventListener("mouseover", stopAutoPlay);
  nextButton.addEventListener("mouseover", stopAutoPlay);
  dotsContainer.addEventListener("mouseover", stopAutoPlay);

  // Resume auto-play when user stops interacting
  slider.addEventListener("mouseleave", startAutoPlay);
  prevButton.addEventListener("mouseleave", startAutoPlay);
  nextButton.addEventListener("mouseleave", startAutoPlay);
  dotsContainer.addEventListener("mouseleave", startAutoPlay);

  // Optional: Add touch support for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchend",
    function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoPlay();
    },
    { passive: true }
  );

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left - next slide
      nextSlide();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right - previous slide
      prevSlide();
    }
  }
});
