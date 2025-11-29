function showModal(id, event) {
  const modal = document.getElementById('modal-' + id);
  if (!modal) return;

  modal.style.display = 'block';

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const padding = 8;

  // start exactly at cursor
  let x = event.clientX;
  let y = event.clientY;

  const rect = modal.getBoundingClientRect();
  const w = rect.width || 280;
  const h = rect.height || 180;

  // prefer bottom‑left of cursor
  x = x - w - padding;   // shift to left of cursor
  y = y + padding;       // small push down from cursor

  // if goes outside bottom, move above instead
  if (y + h + padding > vh) {
    y = event.clientY - h - padding;
  }

  // clamp to viewport so it never cuts
  if (x < padding) x = padding;
  if (y < padding) y = padding;
  if (x + w + padding > vw) x = vw - w - padding;
  if (y + h + padding > vh) y = vh - h - padding;

  modal.style.left = x + 'px';
  modal.style.top = y + 'px';
}

function hideModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (modal) modal.style.display = 'none';
}

function hideModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (modal) modal.style.display = 'none';
}


function hideModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (modal) modal.style.display = 'none';
}

// Add close button to all modals on load
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal').forEach(modal => {
    const btn = document.createElement('button');
    btn.className = 'close-btn';
    btn.innerHTML = '×';
    btn.addEventListener('click', e => {
      e.stopPropagation();
      modal.style.display = 'none';
    });
    modal.appendChild(btn);
  });
});

// Close when clicking outside
document.addEventListener('click', e => {
  if (!e.target.closest('.modal') && !e.target.closest('area')) {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
  }
});

// ORIGINAL design size of your image when you created the coords
const ORIG_WIDTH  = 1000; // px
const ORIG_HEIGHT = 545;  // px

function rescaleAreas() {
  const img = document.querySelector('#map-container > img[usemap]');
  if (!img) return;

  const dispWidth  = img.clientWidth;
  const dispHeight = img.clientHeight;
  if (!dispWidth || !dispHeight) return;

  const scaleX = dispWidth  / ORIG_WIDTH;
  const scaleY = dispHeight / ORIG_HEIGHT;

  const areas = document.querySelectorAll('map[name="pup-map"] area');

  areas.forEach(area => {
    const orig = area.dataset.origCoords;
    if (!orig) return;

    const nums = orig.split(',').map(Number);
    let scaled = [];

    const shape = area.shape.toLowerCase();

    if (shape === 'circle') {
      const [x, y, r] = nums;
      const newX = Math.round(x * scaleX);
      const newY = Math.round(y * scaleY);
      const newR = Math.round(r * ((scaleX + scaleY) / 2));
      scaled = [newX, newY, newR];
    } else if (shape === 'rect') {
      const [x1, y1, x2, y2] = nums;
      scaled = [
        Math.round(x1 * scaleX),
        Math.round(y1 * scaleY),
        Math.round(x2 * scaleX),
        Math.round(y2 * scaleY)
      ];
    } else { // poly or anything else
      for (let i = 0; i < nums.length; i += 2) {
        const x = nums[i];
        const y = nums[i + 1];
        scaled.push(
          Math.round(x * scaleX),
          Math.round(y * scaleY)
        );
      }
    }

    area.coords = scaled.join(',');
  });
}

// run after image loads and on window resize
window.addEventListener('load', rescaleAreas);
window.addEventListener('resize', rescaleAreas);
