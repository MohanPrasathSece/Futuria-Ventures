const fs = require('fs');
let c = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

const replacements = {
  'Welcome back': 'Bon retour',
  'Enter your email to sign in.': 'Entrez votre e-mail pour vous connecter.',
  'Success! Redirecting...': 'Succès ! Redirection...',
  'Email address': 'Adresse e-mail',
  'Signing In...': 'Connexion...',
  '>Sign In<': '>Se connecter<',
  "Don't have an account\\?": "Vous n'avez pas de compte ?",
  '>Sign up<': ">S'inscrire<",
  '>Sign Up<': ">S'inscrire<",
  'Create your account.': 'Créez votre compte.',
  'Full Name': 'Nom complet',
  'Phone Number': 'Numéro de téléphone',
  'Creating Account...': 'Création du compte...',
  'Application Approved!': 'Demande approuvée !',
  'Redirecting to login...': 'Redirection vers la connexion...',
  'Already a client\\?': 'Déjà client ?',
  '>Sign in<': '>Se connecter<'
};

for (const [eng, fr] of Object.entries(replacements)) {
  c = c.replace(new RegExp(eng, 'g'), fr);
}

fs.writeFileSync('src/components/AuthModal.tsx', c);
