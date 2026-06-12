const fs = require('fs');

const file = 'src/routes/index.tsx';
let c = fs.readFileSync(file, 'utf8');

const replacements = {
  // Nav
  '"How It Works"': '"Comment ça marche"',
  '"Features"': '"Fonctionnalités"',
  '"App"': '"Application"',
  '"Contact"': '"Contact"',
  '>Sign In<': '>Se connecter<',
  '>Get Started<': '>Commencer<',
  'Home <ArrowRight': 'Accueil <ArrowRight',

  // Hero
  'AI-Powered Crypto Wealth Intelligence': 'Intelligence Financière Crypto par IA',
  'Your Gateway to': 'Votre Portail vers',
  'Smarter Crypto': 'une Crypto plus Intelligente',
  'Investing': 'et l\'Investissement',
  'Access AI-driven market intelligence, strategic portfolio insights, and\\s*institutional-grade crypto investment opportunities designed for long-term\\s*wealth creation.': 'Accédez à une veille de marché par l\'IA, des analyses stratégiques de portefeuille et des opportunités d\'investissement crypto de niveau institutionnel conçues pour la création de richesse à long terme.',
  '>Start Investing<': '>Commencer à investir<',
  '>Explore Opportunities<': '>Explorer les opportunités<',

  // Trust
  '>Why Futuria<': '>Pourquoi Futuria<',
  'Built for Modern Investors.': 'Conçu pour les investisseurs modernes.',
  '>Trusted Worldwide.<': '>Mondialement reconnu.<',
  'Institutional Security': 'Sécurité institutionnelle',
  'Military-grade asset protection and advanced risk management protocols\\s*safeguard every position.': 'Une protection des actifs de niveau militaire et des protocoles de gestion des risques avancés protègent chaque position.',
  '24/7 Market Intelligence': 'Veille de marché 24/7',
  'Continuous monitoring of crypto market opportunities with real-time\\s*signals from our research desk.': 'Surveillance continue des opportunités du marché crypto avec des signaux en temps réel de notre bureau de recherche.',
  'Active investors worldwide trusting Futuria for crypto wealth strategy.': 'Investisseurs actifs dans le monde entier faisant confiance à Futuria pour leur stratégie crypto.',

  // Bento
  'An intelligence layer for every part of your portfolio.': 'Une couche d\'intelligence pour chaque partie de votre portefeuille.',
  'View all features →': 'Voir toutes les fonctionnalités →',
  '>Global Market Access<': '>Accès au marché mondial<',
  'Tap into 80\\+ global crypto markets through a single institutional\\s*gateway with deep liquidity routing.': 'Accédez à plus de 80 marchés crypto mondiaux via un portail institutionnel unique avec un routage de liquidité profond.',
  '>AI Portfolio Insights<': '>Aperçus de portefeuille par IA<',
  'Machine-learned signals built from on-chain and macro data.': 'Signaux générés par l\'IA à partir de données macro et on-chain.',
  '>Risk Management<': '>Gestion des risques<',
  'Real-time exposure controls.': 'Contrôles d\'exposition en temps réel.',
  '>Investment Strategies<': '>Stratégies d\'investissement<',
  'Curated by quants & macro analysts.': 'Sélectionnées par des quants et des analystes macro.',
  '>Asset Allocation<': '>Allocation d\'actifs<',
  'Balanced for risk-adjusted return.': 'Équilibrée pour un rendement ajusté au risque.',
  '>Market Analytics<': '>Analyse de marché<',
  'Live performance & deep on-chain analytics in one cockpit.': 'Performances en direct et analyses on-chain approfondies dans un seul cockpit.',
  '>Crypto Opportunities<': '>Opportunités Crypto<',
  'Early access to vetted plays.': 'Accès anticipé à des opportunités validées.',
  '>Performance Tracking<': '>Suivi des performances<',
  'Transparent, audit-ready reporting across every portfolio,\\s*strategy and time horizon.': 'Rapports transparents et prêts pour l\'audit sur chaque portefeuille, stratégie et horizon temporel.',
  '"YTD Return"': '"Rendement Annuel"',
  '"Sharpe"': '"Ratio de Sharpe"',
  '"Drawdown"': '"Perte Max"',

  // Process
  '"Discover"': '"Découverte"',
  '"Construct"': '"Construction"',
  '"Monitor"': '"Surveillance"',
  '"Compound"': '"Croissance"',
  'Map your goals, risk tolerance and time horizon with an Futuria strategist.': 'Définissez vos objectifs, votre tolérance au risque et votre horizon avec un stratège Futuria.',
  'AI engines build a tailored, multi-asset crypto portfolio backed by our research desk.': 'Nos moteurs d\'IA construisent un portefeuille crypto multi-actifs sur mesure, soutenu par nos analystes.',
  'Continuous on-chain surveillance, 24/7 risk controls and adaptive rebalancing.': 'Surveillance on-chain continue, contrôles des risques 24/7 et rééquilibrage adaptatif.',
  'Transparent reporting and disciplined execution compound your wealth across cycles.': 'Des rapports transparents et une exécution disciplinée font croître votre patrimoine au fil des cycles.',
  '>Methodology<': '>Méthodologie<',
  'A disciplined path to <br className="hidden md:block" />\\s*<span className="font-medium">long-term wealth.</span>': 'Un chemin discipliné vers la <br className="hidden md:block" />\n                <span className="font-medium">richesse à long terme.</span>',
  'Four deliberate stages that turn market complexity into a clear,\\s*compounding strategy.': 'Quatre étapes délibérées qui transforment la complexité du marché en une stratégie claire de croissance.',

  // App Showcase
  '>Mobile App<': '>Application Mobile<',
  'Invest Smarter With': 'Investissez plus intelligemment avec',
  '>AI-Powered<': '>l\'IA<',
  '> Insights<': '> comme moteur<',
  'Carry institutional intelligence in your pocket. Track every position,\\s*rebalance with one tap, and act on real-time alerts.': 'Emportez l\'intelligence institutionnelle dans votre poche. Suivez chaque position, rééquilibrez en un clic et réagissez aux alertes en direct.',
  '"Portfolio dashboard preview"': '"Aperçu du tableau de bord"',
  '"Live allocation, P&L and exposure."': '"Allocation en direct, P&L et exposition."',
  '"Performance tracking"': '"Suivi des performances"',
  '"Benchmark against BTC and macro indices."': '"Comparaison avec le BTC et les indices macro."',
  '"Market alerts"': '"Alertes de marché"',
  '"Custom triggers powered by AI signals."': '"Déclencheurs personnalisés par signaux IA."',
  '"Strategy recommendations"': '"Recommandations de stratégie"',
  '"Personalized to your risk profile."': '"Personnalisées selon votre profil de risque."',

  // Why Choose
  '>Why Choose Us<': '>Pourquoi nous choisir<',
  'The institutional edge,\\s*<br />\\s*<span className="text-foreground/40">made personal.</span>': 'L\'avantage institutionnel,\n            <br />\n            <span className="text-foreground/40">rendu personnel.</span>',
  '"Advanced Analytics"': '"Analyse Avancée"',
  '"Multi-factor models built on decades of capital markets research."': '"Modèles multi-facteurs fondés sur des décennies de recherche."',
  '"Institutional Research"': '"Recherche Institutionnelle"',
  '"Daily desk notes from our macro and on-chain analysts."': '"Notes quotidiennes de nos analystes macro et on-chain."',
  '"Global Opportunities"': '"Opportunités Mondiales"',
  '"Cross-venue access from Singapore to New York."': '"Accès multiplateforme de Singapour à New York."',
  '"AI Intelligence"': '"Intelligence Artificielle"',
  '"Adaptive models that learn from every market regime."': '"Modèles adaptatifs qui apprennent de chaque régime de marché."',
  '"Transparent Reporting"': '"Rapports Transparents"',
  '"Audit-grade statements with full performance attribution."': '"Relevés de qualité audit avec attribution complète des performances."',
  '"Long-Term Wealth Focus"': '"Objectif de Richesse à Long Terme"',
  '"Compounding strategies built for the next cycle, not the next trade."': '"Stratégies conçues pour le prochain cycle, pas le prochain trade."',

  // CTA
  'Limited Onboarding — Q2 2026': 'Intégration limitée — T2 2026',
  'Start building your': 'Commencez à construire votre',
  'crypto wealth strategy': 'stratégie de richesse crypto',
  '>\\s*today.': '>\n              dès aujourd\'hui.',
  'Join 10,000\\+ investors using Futuria to navigate the next era of digital\\s*assets with institutional clarity.': 'Rejoignez plus de 10 000 investisseurs qui utilisent Futuria pour naviguer dans la prochaine ère des actifs numériques avec clarté.',
  '>Open an Account<': '>Ouvrir un compte<',
  '>Talk to a strategist<': '>Parler à un conseiller<',

  // Contact
  '>Contact Us<': '>Contactez-nous<',
  'Ready to begin your <span className="text-emerald">journey\\?</span>': 'Prêt à commencer votre <span className="text-emerald">parcours ?</span>',
  'Our investment team is ready to discuss your objectives. Fill out the form\\s*and we will coordinate a brief introductory call.': 'Notre équipe d\'investissement est prête à discuter de vos objectifs. Remplissez le formulaire et nous organiserons un appel de présentation.',
  '>Request Received<': '>Demande Reçue<',
  '>We will be in touch shortly.<': '>Nous vous contacterons sous peu.<',
  '>Name<': '>Nom<',
  'Please enter your name \\(max 100\\)': 'Veuillez entrer votre nom (max 100)',
  '>Email<': '>E-mail<',
  'Enter a valid email': 'Entrez un e-mail valide',
  '>Phone Number<': '>Numéro de téléphone<',
  '>Message<': '>Message<',
  'Tell us a bit about your goals \\(max 1000\\)': 'Parlez-nous un peu de vos objectifs (max 1000)',
  '"Submitting..."': '"Envoi en cours..."',
  '"Submit Inquiry"': '"Envoyer la demande"',

  // Footer
  '"Privacy"': '"Confidentialité"',
  '"Terms"': '"Conditions"',
  '"Disclosures"': '"Divulgations"',
  'All rights reserved. &nbsp;·&nbsp; Past performance is not indicative of future results.': 'Tous droits réservés. &nbsp;·&nbsp; Les performances passées ne préjugent pas des résultats futurs.'
};

for (const [eng, fr] of Object.entries(replacements)) {
  c = c.replace(new RegExp(eng, 'g'), fr);
}

fs.writeFileSync(file, c);
console.log('Translated index.tsx');
