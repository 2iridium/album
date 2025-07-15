// PAGE
function invertRgbColor(rgb) {
  const nums = rgb.match(/\d+/g)?.map(Number);
  if (!nums || nums.length !== 3) return null;
  const inverted = nums.map(c => 255 - c);
  return `rgb(${inverted.join(', ')})`;
}

function updateInvertedColor() {
  const root = document.documentElement;
  const mainColor = getComputedStyle(root).getPropertyValue('--main-text-color').trim();

  const inverted = invertRgbColor(mainColor);
  if (inverted) {
    root.style.setProperty('--inverted-text-color', inverted);
  }

  requestAnimationFrame(updateInvertedColor);
}

requestAnimationFrame(updateInvertedColor);

const fullpage = document.getElementById('fullpage');
const totalSections = 3;
let current = 0;
let busy = false;

const scrollToSection = idx => {
  busy = true;
  fullpage.style.transform = `translateY(-${idx * 100}vh)`;
  setTimeout(() => busy = false, 800);
};

window.addEventListener('wheel', e => { 
  if (busy) return;
  if (e.deltaY > 0 && current < totalSections - 1) {
    current++;
    scrollToSection(current);
  } else if (e.deltaY < 0 && current > 0) {
    current--;
    scrollToSection(current);
  }
});

window.addEventListener('keydown', e => {
  if (busy) return;
  if ((e.key === 'ArrowDown' || e.key === 'PageDown') && current < totalSections - 1) {
    current++;
    scrollToSection(current);
  } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && current > 0) {
    current--;
    scrollToSection(current);
  }
});

let isMiddleButtonDown = false;
let lastMouseY = 0;

window.addEventListener('mousedown', e => {
  if (e.button === 1) {
    isMiddleButtonDown = true;
    lastMouseY = e.clientY;
    e.preventDefault();
  }
});

window.addEventListener('mouseup', e => {
  if (e.button === 1) {
    isMiddleButtonDown = false;
  }
});

window.addEventListener('mousemove', e => {
  if (isMiddleButtonDown) {
    const deltaY = lastMouseY - e.clientY;
    lastMouseY = e.clientY;

    if (busy) return;

    if (deltaY > 10 && current < totalSections - 1) {
      current++;
      scrollToSection(current);
    } else if (deltaY < -10 && current > 0) {
      current--;
      scrollToSection(current);
    }
  }
});



// CURSOR
const cursor = document.querySelector('.custom-cursor');
let hideTimeout;

cursor.style.opacity = 0;
cursor.style.transition = 'opacity 0.5s ease, background-color 0.2s ease';

function showCursor() {
  cursor.style.display = 'block';
  cursor.style.opacity = 1;
}

function hideCursor() {
  cursor.style.opacity = 0;
  setTimeout(() => {
    if (cursor.style.opacity === '0') {
      cursor.style.display = 'none';
    }
  }, 500);
}

function resetHideTimeout() {
  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    hideCursor();
  }, 3000);
}

window.addEventListener('mousemove', e => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;

  if (cursor.style.opacity === '0' || cursor.style.display === 'none') {
    showCursor();
  }
  resetHideTimeout();
});

window.addEventListener('mousedown', e => {
  if (e.button === 0) {
    cursor.style.backgroundColor = "white";
  }
});

window.addEventListener('mouseup', e => {
  if (e.button === 0) {
    cursor.style.backgroundColor = 'transparent';
  }
});

const platformIcons = document.querySelectorAll('.platform-icons a');

platformIcons.forEach(icon => {
  icon.addEventListener('mouseenter', () => {
    cursor.classList.add('transparent-border');
  });
  icon.addEventListener('mouseleave', () => {
    cursor.classList.remove('transparent-border');
  });
});



// SECTION1
setTimeout(() => {
  const hiddenText = document.querySelector('.hidden-text');
  const content = hiddenText.innerText;
  const wrappedChars = content.split('').map(char => {
    const safeChar = char === ' ' ? '&nbsp;' : char;
    return `<span class="char">${safeChar}</span>`;
  }).join('');
  hiddenText.innerHTML = `<span class="scrolling-content">${wrappedChars}</span>`;
  const chars = hiddenText.querySelectorAll('.char');

  let interval = 1000;
  let count = 1;
  let flashTimer;
  let countGrower;

  const section1 = document.querySelector('.section-1');
  const overlay = section1.querySelector('.overlay-bg');

  const startFlashing = () => {
    flashTimer = setInterval(() => {
      for (let i = 0; i < count; i++) {
        const randIndex = Math.floor(Math.random() * chars.length);
        const char = chars[randIndex];
        char.classList.add('visible');
        const visibleDuration = Math.random() * (1000 - 10) + 10;
        setTimeout(() => {
          char.classList.remove('visible');
        }, visibleDuration);
      }
    }, interval);
  };

  const restartFlashing = () => {
    clearInterval(flashTimer);
    startFlashing();
  };

  startFlashing();

  countGrower = setInterval(() => {
    count++;
  }, 250);

  const intervalReducer = setInterval(() => {
    interval -= 50;
    if (interval <= 10) {
      interval = 10;
      clearInterval(intervalReducer);

      setTimeout(() => {
        clearInterval(flashTimer);
        clearInterval(countGrower);
        hiddenText.innerHTML = '';
        overlay.style.opacity = '0';
        document.documentElement.style.setProperty('--main-text-color', 'rgb(255, 255, 255)');
      }, 1000);
    } else {
      restartFlashing();
    }
  }, 1000);

const duration = 10000;

function startFadeIn() {
  const startTime = performance.now();

  function fadeIn(timestamp) {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = Math.pow(progress, 3);

    overlay.style.opacity = eased.toFixed(3);

    const val = Math.round(255 - 255 * eased);
    const colorStr = `rgb(${val}, ${val}, ${val})`;

    document.documentElement.style.setProperty('--main-text-color', colorStr);

    if (progress < 1) {
      requestAnimationFrame(fadeIn);
    }
  }

  requestAnimationFrame(fadeIn);
}

setTimeout(startFadeIn, 5000);

}, 20000);
