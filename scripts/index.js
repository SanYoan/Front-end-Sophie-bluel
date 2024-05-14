// Récupération des données sur l'api & Transforme les données en .json
const Projets = await fetch("http://localhost:5678/api/works").then((Projets) =>
  Projets.json()
);
// Récupération des données sur l'api & Transforme les données en .json
const categories = await fetch("http://localhost:5678/api/categories").then(
  (categories) => categories.json()
);
// Création d'une fonction
function affichageProjets(Projets) {
  try {
    Projets.map((Projets) => {
      // Création de balise figure pour chaque projets
      const BaliseFigure = document.createElement("figure");
      // création de balise figcaption pour chaque projets
      const TitleProjet = document.createElement("figcaption");
      const BaliseImg = document.createElement("img");
      //Récupère  les titres de chaque projets
      TitleProjet.textContent = Projets.title;
      //Création d'une balise img pour chaque projets
      //Ajoute une source et une alt a chaque balise img en prenant les url de chaque projets
      BaliseImg.src = Projets.imageUrl;
      BaliseImg.alt = Projets.title;
      //Ajoute les balise img dans les balises figure
      BaliseFigure.appendChild(BaliseImg);
      //récupère la balise avec la class ".gallery" et ajoute les balises figure dedans
      document.querySelector(".gallery").appendChild(BaliseFigure);
      //Ajoute les balise figcaption dans les balises figure
      BaliseFigure.appendChild(TitleProjet);
    });
  } catch (error) {
    console.error(`Erreur: ${error}`);
    return [];
  }
}
// fonction pour bouton filtres
function CreationBoutonTri() {
  try {
    const divPortfolio = document.querySelector(".DivFiltres");
    // Création du bouton "Tous" pour afficher tous les projets
    const BaliseInputTous = document.createElement("input");
    BaliseInputTous.type = "button";
    BaliseInputTous.value = "Tous";
    BaliseInputTous.classList = "btnFiltres";
    BaliseInputTous.addEventListener("click", () => {
      document.querySelector(".gallery").innerHTML = "";
      affichageProjets(Projets);
    });
    divPortfolio.appendChild(BaliseInputTous);
    // Création des boutons pour chaque catégorie

    categories.map((categories) => {
      const BalisesInput = document.createElement("input");
      BalisesInput.type = "button";
      BalisesInput.value = categories.name;
      BalisesInput.id = categories.id;
      BalisesInput.classList = "btnFiltres";
      divPortfolio.appendChild(BalisesInput);
      BalisesInput.addEventListener("click", () => {
        document.querySelector(".gallery").innerHTML = "";
        const ProjetsFiltrees = Projets.filter(
          (projet) => parseInt(projet.category.id) === parseInt(BalisesInput.id)
        );
        affichageProjets(ProjetsFiltrees);
      });
    });
  } catch (error) {
    console.error(`Erreur: ${error}`);
    return [];
  }
}
//fonction pour connection et deconnection
function login() {
  try {
    const token = window.localStorage.getItem("token");
    const divPortfolio = document.querySelector(".DivFiltres");
    const login = document.getElementById("logout");

    if (token) {
      login.innerText = "Logout";
      const logoH2 = document.createElement("i");
      logoH2.classList = "fa-regular fa-pen-to-square";
      const modalText = document.createElement("p");
      modalText.innerText = "modifier";
      const titleH2 = document.querySelector(".titleH2");
      titleH2.appendChild(logoH2);
      titleH2.appendChild(modalText);
      login.addEventListener("click", () => {
        window.localStorage.removeItem("token");
        login.href = "index.html";
      });
    } else {
      //si il y a pas de token enregistrer crée les boutons filtres
      CreationBoutonTri();
      login.addEventListener("click", () => {
        login.href = "login.html";
      });
    }
  } catch (error) {
    console.error(`Erreur: ${error}`);
    return [];
  }
}

login();
affichageProjets(Projets);
