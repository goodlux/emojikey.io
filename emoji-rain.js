// Array of emojis for the floating effect
const emojis = [
  "🐐",
  "✨",
  "🔑",
  "🎭",
  "🌟",
  "🎪",
  "🎨",
  "🎯",
  "💫",
  "🌈",
  "⭐️",
  "🔮",
  "🦙",
  "🐑",
  "🦌",
  "🪄",
  "🎆",
  "🎇",
  "🗝️",
  "🔐",
  "🔒",
  "🛡️",
  "🎬",
  "🎤",
  "🎸",
  "☁️",
  "🌙",
  "🌺",
  "🌸",
  "🌼",
  "🍀",
  "🎲",
  "🎮",
  "💖",
  "💝",
  "💕",
  "💞",
  "💓",
  "⚡",
  "💻",
  "⚗️",
  "🔬",
  "🤖",
  "💠",
  "🔷",
  "🔶",
  "💎",
  "🦄",
  "🎠",
  "🎡",
  "🎢",
  "🎵",
  "🎶",
  "⛅",
  "🌤️",
  "⛈️",
];

// Generate random position and animation timing
function randomPosition() {
  return {
    left: Math.random() * 100 + "vw",
    top: Math.random() * 100 + "vh",
    animationDelay: Math.random() * 5 + "s",
    animationDuration: Math.random() * 3 + 2 + "s",
  };
}

// Create and add floating emojis to the page
function createEmojiRain(count = 200) {
  for (let i = 0; i < count; i++) {
    const emoji = document.createElement("div");
    emoji.className = "emoji-float";
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const pos = randomPosition();
    Object.assign(emoji.style, {
      left: pos.left,
      top: pos.top,
      animationDelay: pos.animationDelay,
      animationDuration: pos.animationDuration,
    });

    document.body.appendChild(emoji);
  }
}

// Initialize emoji rain when the page loads
createEmojiRain();

// Optional: Add method to add more emojis dynamically
window.addMoreEmojis = (count = 100) => createEmojiRain(count);

// Initialize syntax highlighting
hljs.highlightAll();
