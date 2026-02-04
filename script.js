// Book state variables
let current = 0;
let bookOpened = false;
const bookCover = document.getElementById("bookCover");
const bookContainer = document.getElementById("bookContainer");
const spreads = document.querySelectorAll(".spread");
const giftBtn = document.getElementById("giftBtn");
const timelineDots = document.querySelectorAll(".timeline-dot");
const timelineProgress = document.querySelector(".timeline-progress");
const pageCount = document.querySelector(".page-count");

// Check if mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Create floating elements (only on desktop)
function createFloatingElements() {
  if (isMobile) return; // Skip on mobile for performance
  
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

// Open the book
function openBook() {
  if (!bookOpened) {
    bookOpened = true;
    
    // Animate cover closing
    bookCover.style.animation = "bookAppear 0.5s reverse forwards";
    
    setTimeout(() => {
      bookCover.style.display = "none";
      bookContainer.style.display = "flex";
      
      // Add entrance animation
      bookContainer.style.animation = "containerAppear 1s ease-out";
      
      // Initialize the book
      updateBook();
      
      // Animate text on first page
      animatePageText();
      
      // Adjust layout for mobile after opening
      if (isMobile) {
        document.body.style.overflow = "hidden";
        // Scroll to top
        window.scrollTo(0, 0);
      }
    }, 500);
  }
}

// Animate text on current page
function animatePageText() {
  const currentSpread = spreads[current];
  const pageTexts = currentSpread.querySelectorAll(".page-text");
  
  pageTexts.forEach((text, index) => {
    text.style.animation = "none";
    setTimeout(() => {
      text.style.animation = `textFadeIn 1s forwards`;
      text.style.animationDelay = `${index * 0.3}s`;
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

  // Activate Gift Button on last page
  if (current === spreads.length - 1) {
    giftBtn.disabled = false;
    giftBtn.onclick = () => {
      giftBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
      setTimeout(() => {
        // Replace with your actual gift link
        const giftUrl = "https://your-gift-link-here.com";
        if (isMobile) {
          window.location.href = giftUrl;
        } else {
          window.open(giftUrl, "_blank");
        }
        giftBtn.innerHTML = '<i class="fas fa-gift"></i> Gift Opened!';
        giftBtn.disabled = true;
      }, 1500);
    };
  } else {
    giftBtn.disabled = true;
    giftBtn.innerHTML = '<i class="fas fa-gift"></i> OPEN GIFT';
  }
  
  // Animate text on new page
  setTimeout(animatePageText, 300);
  
  // Scroll to top on mobile
  if (isMobile) {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }
}

// Next page
function next() {
  if (current < spreads.length - 1) {
    if (isMobile) {
      // Simple fade transition for mobile
      const currentSpread = spreads[current];
      currentSpread.style.opacity = "0";
      currentSpread.style.transition = "opacity 0.5s";
      
      setTimeout(() => {
        current++;
        updateBook();
        const newSpread = spreads[current];
        newSpread.style.opacity = "1";
        newSpread.style.transition = "opacity 0.5s";
      }, 300);
    } else {
      // Desktop flipping animation
      const currentSpread = spreads[current];
      currentSpread.classList.add("flipping");
      
      setTimeout(() => {
        currentSpread.classList.remove("flipping");
        current++;
        updateBook();
      }, 1200);
    }
  }
}

// Previous page
function prev() {
  if (current > 0) {
    if (isMobile) {
      // Simple fade transition for mobile
      const currentSpread = spreads[current];
      currentSpread.style.opacity = "0";
      currentSpread.style.transition = "opacity 0.5s";
      
      setTimeout(() => {
        current--;
        updateBook();
        const newSpread = spreads[current];
        newSpread.style.opacity = "1";
        newSpread.style.transition = "opacity 0.5s";
      }, 300);
    } else {
      // Desktop flipping animation
      const currentSpread = spreads[current];
      currentSpread.classList.add("flipping-back");
      
      setTimeout(() => {
        currentSpread.classList.remove("flipping-back");
        current--;
        updateBook();
      }, 1200);
    }
  }
}

let startX = 0;
let startY = 0;
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
    
    setTimeout(() => {
      isAnimating = false;
    }, 1200);
  }
});

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", e => {
  if (!bookOpened) {
    // Open book on first touch if not opened
    e.preventDefault();
    return;
  }
  
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  
  // Prevent default to avoid scrolling while interacting with book
  if (bookOpened) {
    e.preventDefault();
  }
}, { passive: false });

document.addEventListener("touchend", e => {
  if (!bookOpened || isAnimating) return;
  
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  
  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;
  
  // Only trigger if horizontal swipe is more significant than vertical
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
    isAnimating = true;
    diffX > 0 ? next() : prev();
    
    setTimeout(() => {
      isAnimating = false;
    }, 800);
  }
  
  e.preventDefault();
});

// Keyboard navigation
document.addEventListener("keydown", e => {
  if (!bookOpened) {
    // Open book with space or enter key
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
    setTimeout(() => { isAnimating = false; }, isMobile ? 800 : 1200);
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    isAnimating = true;
    prev();
    setTimeout(() => { isAnimating = false; }, isMobile ? 800 : 1200);
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
      // Scroll to top on resize
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
  // Add tap areas for easier navigation on mobile
  setTimeout(() => {
    const book = document.querySelector('.book');
    
    // Create left tap area (20% of screen width)
    const leftTapArea = document.createElement('div');
    leftTapArea.style.position = 'absolute';
    leftTapArea.style.left = '0';
    leftTapArea.style.top = '0';
    leftTapArea.style.width = '20%';
    leftTapArea.style.height = '100%';
    leftTapArea.style.zIndex = '100';
    leftTapArea.style.cursor = 'pointer';
    leftTapArea.addEventListener('click', () => {
      if (!isAnimating) {
        isAnimating = true;
        prev();
        setTimeout(() => { isAnimating = false; }, 800);
      }
    });
    
    // Create right tap area (20% of screen width)
    const rightTapArea = document.createElement('div');
    rightTapArea.style.position = 'absolute';
    rightTapArea.style.right = '0';
    rightTapArea.style.top = '0';
    rightTapArea.style.width = '20%';
    rightTapArea.style.height = '100%';
    rightTapArea.style.zIndex = '100';
    rightTapArea.style.cursor = 'pointer';
    rightTapArea.addEventListener('click', () => {
      if (!isAnimating) {
        isAnimating = true;
        next();
        setTimeout(() => { isAnimating = false; }, 800);
      }
    });
    
    book.appendChild(leftTapArea);
    book.appendChild(rightTapArea);
  }, 1000);
}

// Add visual feedback for mobile taps
if (isMobile) {
  document.addEventListener('touchstart', function() {}, {passive: true});
}
