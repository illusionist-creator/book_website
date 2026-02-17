// Book state variables
let current = 0;
let bookOpened = false;
const bookCover = document.getElementById("bookCover");
const bookContainer = document.getElementById("bookContainer");
const endCover = document.querySelector(".spread.end-cover");
const spreads = document.querySelectorAll(".spread");
const timelineDots = document.querySelectorAll(".timeline-dot");
const timelineProgress = document.querySelector(".timeline-progress");
const pageCount = document.querySelector(".page-count");

// Check if mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Create floating elements (only on desktop)
function createFloatingElements() {
  if (isMobile) return;
  
  const floatingHearts = document.querySelector(".floating-hearts");
  for (let i = 0; i < 6; i++) {
    const element = document.createElement("div");
    element.innerHTML = i % 2 === 0 ? "✦" : "❤";
    element.style.position = "absolute";
    element.style.left = `${Math.random() * 100}%`;
    element.style.top = `${Math.random() * 100}%`;
    element.style.color = i % 2 === 0 ? "rgba(212, 165, 165, 0.15)" : "rgba(212, 175, 55, 0.15)";
    element.style.fontSize = `${Math.random() * 20 + 16}px`;
    element.style.animation = `float ${Math.random() * 10 + 5}s infinite linear`;
    element.style.animationDelay = `${Math.random() * 5}s`;
    element.style.pointerEvents = "none";
    floatingHearts.appendChild(element);
  }
}

createFloatingElements();

function closeBook() {

  bookContainer.style.animation = "containerAppear 0.5s reverse forwards";

  setTimeout(() => {

    bookContainer.style.display = "none";

    bookCover.style.display = "flex";
    bookCover.style.animation = "bookAppear 1.5s ease-out";

    spreads.forEach((spread, index) => {
      spread.classList.remove("active", "passed", "flipping", "flipping-back");
      if (index === 0) {
        spread.classList.add("active");
      }
    });

    document.querySelectorAll(".timeline-dot").forEach((dot, i) => {
      dot.classList.remove("active");
      if (i === 0) dot.classList.add("active");
    });

    document.querySelector(".timeline-progress").style.width = "0%";
    document.querySelector(".page-count").textContent = "1 of 7";

  }, 500);
}

// Open the book
function openBook() {
  if (!bookOpened) {
    bookOpened = true;
    bookCover.style.animation = "bookAppear 0.5s reverse forwards";
    
    setTimeout(() => {
      bookCover.style.display = "none";
      bookContainer.style.display = "flex";
      bookContainer.style.animation = "containerAppear 1s ease-out";
      updateBook();
      animatePageText();
      if (isMobile) {
        document.body.style.overflow = "hidden";
      }
    }, 500);
  }
}

// Animate text on current page
function animatePageText() {
  const currentSpread = spreads[current];
  // Select both regular page text and cover lines
  const textElements = currentSpread.querySelectorAll(".page-text, .cover-line");
  
  // Determine animation speed based on whether it's the last spread
  const isLastSpread = (current === spreads.length - 1);
  const duration = isLastSpread ? 2 : 1; // seconds
  const delayBetween = isLastSpread ? 0.6 : 0.3; // seconds
  
  textElements.forEach((el, index) => {
    el.style.animation = "none";
    setTimeout(() => {
      el.style.animation = `textFadeIn ${duration}s forwards`;
      el.style.animationDelay = `${index * delayBetween}s`;
    }, 100);
  });
}

// Update book pages
function updateBook() {
  spreads.forEach((spread, index) => {
    spread.classList.remove("active", "passed", "flipping", "flipping-back");
    
    if (index < current) {
      spread.classList.add("passed");
    } else if (index === current) {
      spread.classList.add("active");
    }
  });

  // Update timeline dots
  timelineDots.forEach((dot, index) => {
    dot.classList.remove("active");
    if (index === current) {
      dot.classList.add("active");
    }
  });

  // Update progress bar
  const progress = ((current + 1) / spreads.length) * 100;
  timelineProgress.style.width = `${progress}%`;

  // Update page counter
  pageCount.textContent = `${current + 1} of ${spreads.length}`;

  // Animate text on new page
  setTimeout(animatePageText, 300);
}

// Next page
function next() {
  if (current < spreads.length - 1) {
    const currentSpread = spreads[current];
    currentSpread.classList.add("flipping");
    
    setTimeout(() => {
      currentSpread.classList.remove("flipping");
      current++;
      updateBook();
      if (isMobile) {
        window.scrollTo(0, 0);
      }
    }, 1200);
  }
}

// Previous page
function prev() {
  if (current > 0) {
    const currentSpread = spreads[current];
    currentSpread.classList.add("flipping-back");
    
    setTimeout(() => {
      currentSpread.classList.remove("flipping-back");
      current--;
      updateBook();
      if (isMobile) {
        window.scrollTo(0, 0);
      }
    }, 1200);
  }
}

let startX = 0;
let isAnimating = false;

// Click to open book
bookCover.addEventListener("click", openBook);

// Touch to open book (for mobile)
bookCover.addEventListener("touchend", (e) => {
  e.preventDefault();
  openBook();
});

// Mouse controls for desktop
document.addEventListener("mousedown", e => {
  if (!bookOpened) return;
  startX = e.clientX;
});

document.addEventListener("mouseup", e => {
  if (!bookOpened || isAnimating) return;
  
  let diff = startX - e.clientX;
  if (Math.abs(diff) > 60) {
    isAnimating = true;
    diff > 0 ? next() : prev();
    setTimeout(() => { isAnimating = false; }, 1200);
  }
});

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", e => {
  if (!bookOpened) {
    e.preventDefault();
    return;
  }
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  if (bookOpened) {
    e.preventDefault();
  }
});

document.addEventListener("touchmove", e => {
  if (!bookOpened) {
    e.preventDefault();
  }
}, { passive: false });

document.addEventListener("touchend", e => {
  if (!bookOpened || isAnimating) return;
  
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;
  
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
    isAnimating = true;
    diffX > 0 ? next() : prev();
    setTimeout(() => { isAnimating = false; }, 1200);
  }
  e.preventDefault();
});

// Keyboard navigation
document.addEventListener("keydown", e => {
  if (!bookOpened) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      openBook();
    }
    return;
  }
  if (isAnimating) return;
  
  if (e.key === "ArrowRight" || e.key === " ") {
    e.preventDefault();
    isAnimating = true;
    next();
    setTimeout(() => { isAnimating = false; }, 1200);
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    isAnimating = true;
    prev();
    setTimeout(() => { isAnimating = false; }, 1200);
  }
});

// Prevent zoom on double-tap for mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function() {
    if (bookOpened && isMobile) {
      window.scrollTo(0, 0);
    }
  }, 250);
});

// Handle orientation change on mobile
window.addEventListener('orientationchange', function() {
  setTimeout(function() {
    if (bookOpened) {
      window.scrollTo(0, 0);
    }
  }, 500);
});

// Initialize
updateBook();

// Add tap areas for mobile navigation
if (isMobile && bookContainer) {
  setTimeout(() => {
    const book = document.querySelector('.book');
    
    const leftTapArea = document.createElement('div');
    leftTapArea.style.position = 'absolute';
    leftTapArea.style.left = '0';
    leftTapArea.style.top = '0';
    leftTapArea.style.width = '30%';
    leftTapArea.style.height = '100%';
    leftTapArea.style.zIndex = '10';
    leftTapArea.style.cursor = 'pointer';
    leftTapArea.addEventListener('click', () => prev());
    leftTapArea.addEventListener('touchend', (e) => {
      e.preventDefault();
      prev();
    });
    
    const rightTapArea = document.createElement('div');
    rightTapArea.style.position = 'absolute';
    rightTapArea.style.right = '0';
    rightTapArea.style.top = '0';
    rightTapArea.style.width = '30%';
    rightTapArea.style.height = '100%';
    rightTapArea.style.zIndex = '10';
    rightTapArea.style.cursor = 'pointer';
    rightTapArea.addEventListener('click', () => next());
    rightTapArea.addEventListener('touchend', (e) => {
      e.preventDefault();
      next();
    });
    
    book.appendChild(leftTapArea);
    book.appendChild(rightTapArea);
  }, 1000);
}

// Sparkle effect for special messages and name
function createSparkles(x, y) {
  for (let i = 0; i < 8; i++) {
    const spark = document.createElement('div');
    spark.innerHTML = '✦';
    spark.style.position = 'fixed';
    spark.style.left = x + 'px';
    spark.style.top = y + 'px';
    spark.style.color = ['#d4af37', '#d4a5a5', '#ffffff'][Math.floor(Math.random() * 3)];
    spark.style.fontSize = Math.random() * 20 + 10 + 'px';
    spark.style.pointerEvents = 'none';
    spark.style.zIndex = '9999';
    spark.style.transition = 'all 1s ease-out';
    spark.style.textShadow = '0 0 5px gold';
    document.body.appendChild(spark);
    
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 100 + 50;
    const destX = x + Math.cos(angle) * distance;
    const destY = y - Math.random() * 100 - 50; // upward mostly
    
    setTimeout(() => {
      spark.style.transform = `translate(${destX - x}px, ${destY - y}px) rotate(${Math.random() * 360}deg)`;
      spark.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
      spark.remove();
    }, 1000);
  }
}

// Event listeners for sparkles
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('name') || e.target.classList.contains('special-message')) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    createSparkles(x, y);
  }
});

document.addEventListener('touchstart', function(e) {
  if (e.target.classList.contains('name') || e.target.classList.contains('special-message')) {
    e.preventDefault();
    const touch = e.touches[0];
    createSparkles(touch.clientX, touch.clientY);
  }
});

endCover.addEventListener("click", () => {
  if (endCover.classList.contains("active")) {
    closeBook();
  }
});
