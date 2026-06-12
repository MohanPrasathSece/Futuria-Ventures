const fs = require('fs');

const addHoverToCardsAndButtons = (file) => {
  let c = fs.readFileSync(file, 'utf8');

  // Add scale/translate and shadow to buttons
  c = c.replace(/className="([^"]*\bbtn-emerald\b[^"]*)"/g, (match, classes) => {
    if (!classes.includes('hover:scale-105')) {
      return `className="${classes} hover:scale-105 hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all duration-300"`;
    }
    return match;
  });

  // Add translate-y-2 and shadow to cards (group)
  c = c.replace(/className="([^"]*\bgroup\b[^"]*)"/g, (match, classes) => {
    if (!classes.includes('hover:-translate-y-2')) {
      return `className="${classes} hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"`;
    }
    return match;
  });

  fs.writeFileSync(file, c);
};

addHoverToCardsAndButtons('src/routes/index.tsx');
addHoverToCardsAndButtons('src/routes/dashboard.tsx');
addHoverToCardsAndButtons('src/components/Shared.tsx');
addHoverToCardsAndButtons('src/components/AuthModal.tsx');
