J'ai utilisé nodemon installé en global donc je l'ai enlevé du package.json

/Models/User.js (modèle User)
/controllers/loginForm.js (mot de passe encodé)
/controllers/homeForm.js (utilisateur existe déjà, ajouter un user)
/views (page login, dashboard)
/middlewares/auth.js (middleware securité pour dashboard, /routes/routes.js)

J'ai pas réussi à faire fonctionner connect-flash :(