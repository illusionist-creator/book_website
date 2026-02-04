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

// Create floating elements
function createFloatingElements() {
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
        window.open("https://your-gift-link-here.com", "_blank");
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
    }, 1200);
  }
}

let startX = 0;
let isAnimating = false;

// Click to open book
bookCover.addEventListener("click", openBook);

// Mouse controls for book
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

// Touch controls
document.addEventListener("touchstart", e => {
  if (!bookOpened) {
    // Open book on first touch if not opened
    openBook();
    e.preventDefault();
    return;
  }
  startX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {
  if (!bookOpened || isAnimating) return;
  
  let diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 60) {
    isAnimating = true;
    diff > 0 ? next() : prev();
    
    setTimeout(() => {
      isAnimating = false;
    }, 1200);
  }
});

// Keyboard navigation
document.addEventListener("keydown", e => {
  if (!bookOpened) {
    // Open book with space or enter key
    if (e.key === " " || e.key === "Enter") {
      openBook();
    }
    return;
  }
  
  if (isAnimating) return;
  
  if (e.key === "ArrowRight" || e.key === " ") {
    isAnimating = true;
    next();
    setTimeout(() => { isAnimating = false; }, 1200);
  } else if (e.key === "ArrowLeft") {
    isAnimating = true;
    prev();
    setTimeout(() => { isAnimating = false; }, 1200);
  }
});

// Initialize
updateBook();