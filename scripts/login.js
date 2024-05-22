// Sélection du formulaire de connexion
const formulaireConnect = document.querySelector("form");

// Ajout d'un écouteur d'événement pour la soumission du formulaire
formulaireConnect.addEventListener("submit", async (event) => {
  event.preventDefault(); // Empêcher le comportement par défaut du formulaire

  // Récupération des valeurs des champs email et mot de passe
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Envoi d'une requête POST au serveur pour l'authentification de l'utilisateur
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }), // Conversion des données en format JSON
    });

    // Récupération des données de la réponse
    const data = await response.json();
    const token = data.token; // Extraction du token à partir des données

    // Vérification de la réponse de la requête
    if (response.status < 400) { // Si la requête a réussi (statut < 400)
      window.localStorage.setItem("token", token); // Stockage du token dans le localStorage
      console.log("Le token a été sauvegardé");
      window.location.href = "index.html"; // Redirection vers la page d'accueil
    } else { // Si la requête a échoué
      console.error("Erreur le token n'est pas stocké");
      const erreurID = document.querySelector(".errorIdNone");
      erreurID.classList = "errorId"; // Affichage de l'erreur sur l'interface utilisateur
    }
  } catch (error) {
    console.error("Erreur :", error); // Gestion des erreurs
  }
});
