const emojis = [
  // Our mascot and friends
  "🐐",
  "🦙",
  "🐑",
  "🦌",

  // Magic & Sparkles
  "✨",
  "💫",
  "⭐️",
  "🌟",
  "★",
  "⋆",
  "🔮",
  "🪄",
  "🎆",
  "🎇",

  // Keys & Security
  "🔑",
  "🗝️",
  "🔐",
  "🔒",
  "🛡️",

  // Theatre & Expression
  "🎭",
  "🎪",
  "🎨",
  "🎯",
  "🎪",
  "🎬",
  "🎤",
  "🎸",

  // Nature & Weather
  "🌈",
  "☁️",
  "🌙",
  "⭐",
  "🌺",
  "🌸",
  "🌼",
  "🍀",

  // Fun & Games
  "🎲",
  "🎮",
  "🎨",
  "🎭",
  "🎪",

  // Hearts & Love
  "💖",
  "💝",
  "💫",
  "💕",
  "💞",
  "💓",

  // Tech & Science
  "⚡",
  "💻",
  "⚗️",
  "🔬",
  "🤖",

  // Abstract & Geometric
  "💠",
  "🔷",
  "🔶",
  "💎",
  "🎯",

  // Mystical
  "🌙",
  "✧",
  "⋆",
  "✮",
  "🔮",
  "⭑",

  // Additional Fun Ones
  "🦄",
  "🎠",
  "🎡",
  "🎢",
  "🌟",
  "🎵",
  "🎶",
  "🌈",

  // Cloud Computing (for the AWS joke)
  "☁️",
  "⛅",
  "🌤️",
  "⛈️",
];

function createParticles() {
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";

    // Random size between 2-6px
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Random starting position
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;

    // Random floating animation
    particle.style.animation = `
            particleFloat ${Math.random() * 10 + 10}s linear infinite,
            particleFade ${Math.random() * 5 + 5}s ease-in-out infinite
        `;

    document.body.appendChild(particle);
  }
}

function randomPosition() {
  return {
    left: Math.random() * 100 + "vw",
    top: Math.random() * 100 + "vh",
    animationDelay: Math.random() * 5 + "s",
    animationDuration: Math.random() * 3 + 2 + "s",
  };
}

for (let i = 0; i < 1000; i++) {
  const emoji = document.createElement("div");
  emoji.className = "emoji-float";
  emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  const pos = randomPosition();
  emoji.style.left = pos.left;
  emoji.style.top = pos.top;
  emoji.style.animationDelay = pos.animationDelay;
  emoji.style.animationDuration = pos.animationDuration;
  document.body.appendChild(emoji);
}
