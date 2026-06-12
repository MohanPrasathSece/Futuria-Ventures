const fs = require('fs');
let content = fs.readFileSync('src/routes/index.tsx', 'utf8');

// Fix Trust text colors
content = content.replace(/<p className="mt-3 text-\[14px\] font-light leading-relaxed text-foreground\/55">/g, '<p className="mt-3 text-[14px] font-light leading-relaxed text-black/55">');

// Add AnimatedNumber component after Reveal
const animatedNumberCode = `
function AnimatedNumber({ value, suffix = "", prefix = "", decimals = 0 }: { value: number; suffix?: string; prefix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const duration = 1500;
        const startTime = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 4);
          setCount(easeOut * value);
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return <span ref={ref}>{prefix}{(count).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}
`;

if (!content.includes('function AnimatedNumber')) {
  content = content.replace('function Hero() {', animatedNumberCode + '\nfunction Hero() {');
}

// Add animation to 10,000+ in Trust
content = content.replace(
  '10,000<span className="text-emerald">+</span>',
  '<AnimatedNumber value={10000} /><span className="text-emerald">+</span>'
);

// Add Reveal wraps to Hero
content = content.replace(
  '<div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-40 text-center">',
  '<div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-40 text-center">\n        <Reveal delay={100} className="flex flex-col items-center">'
);
content = content.replace(
  'Explore Opportunities\n          </a>\n        </div>',
  'Explore Opportunities\n          </a>\n        </div>\n        </Reveal>'
);
content = content.replace(
  '<div className="relative mt-16 w-full">',
  '<Reveal delay={300}><div className="relative mt-16 w-full">'
);
content = content.replace(
  'md:w-full"\n          />\n        </div>',
  'md:w-full"\n          />\n        </div></Reveal>'
);

// Add Reveal to Trust cards
content = content.replace(
  '<div className="mt-16 grid gap-5 md:grid-cols-3">',
  '<div className="mt-16 grid gap-5 md:grid-cols-3">\n          <Reveal delay={100}>'
);
content = content.replace(
  '</p>\n          </div>\n          <div className="rounded-[32px] border border-black/5 bg-white p-8 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.1)]">',
  '</p>\n          </div>\n          </Reveal>\n          <Reveal delay={200}>\n          <div className="rounded-[32px] border border-black/5 bg-white p-8 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.1)]">'
);
content = content.replace(
  '</p>\n          </div>\n          <div className="relative overflow-hidden rounded-[32px] bg-[oklch(0.1_0.005_160)] p-8 text-foreground">',
  '</p>\n          </div>\n          </Reveal>\n          <Reveal delay={300}>\n          <div className="relative overflow-hidden rounded-[32px] bg-[oklch(0.1_0.005_160)] p-8 text-foreground">'
);
content = content.replace(
  '</p>\n          </div>\n        </div>',
  '</p>\n          </div>\n          </Reveal>\n        </div>'
);

// Add Reveal to Bento
content = content.replace(
  '<div className="mb-12 flex items-end justify-between">',
  '<Reveal><div className="mb-12 flex items-end justify-between">'
);
content = content.replace(
  'View all features →\n          </a>\n        </div>',
  'View all features →\n          </a>\n        </div></Reveal>'
);

// Let's add Reveal to BentoCards
content = content.replace(/<BentoCard className=/g, '<Reveal><BentoCard className=');
content = content.replace(/<\/BentoCard>/g, '</BentoCard></Reveal>');

// Add Reveal to WhyChoose
content = content.replace(
  '<div className="mt-16 grid gap-5 md:grid-cols-3">',
  '<div className="mt-16 grid gap-5 md:grid-cols-3">'
);
// In WhyChoose, the items are mapped. We can replace the div inside map with Reveal
content = content.replace(
  'className={`relative overflow-hidden rounded-[28px] p-8 ${',
  'as="div"\n              delay={Math.random() * 200}\n              className={`relative overflow-hidden rounded-[28px] p-8 ${'
);
content = content.replace(
  'key={title}',
  'key={title}'
);
content = content.replace(
  '<div\n              key={title}\n              as="div"',
  '<Reveal\n              key={title}\n              as="div"'
);
content = content.replace(
  '</p>\n            </div>\n          ))}',
  '</p>\n            </Reveal>\n          ))}'
);

fs.writeFileSync('src/routes/index.tsx', content);
