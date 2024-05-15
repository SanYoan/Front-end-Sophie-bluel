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
// modal
let modal = null;
// Permet d'ouvrir la modal
function Modal() {
  try {
    // Fonction pour arrêter la propagation de l'événement
    const stopPropagation = function (e) {
      e.stopPropagation();
    };

    // Fonction pour ouvrir la modal
    const openModal = function (event) {
      event.preventDefault();
      const target = document.querySelector(event.target.getAttribute("href"));
      target.style.display = null;
      target.removeAttribute("aria-hidden");
      target.setAttribute("aria-modal", "true");
      modal = target;
      modal.addEventListener("click", closeModal);
      modal.querySelector(".fa-solid.fa-xmark").addEventListener("click", closeModal);
      modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
    };

    // Fonction pour fermer la modal
    const closeModal = function (e) {
      if (modal === null) return;
      e.preventDefault();
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
      modal.removeAttribute("aria-modal");
      modal.removeEventListener("click", closeModal);
      modal.querySelector(".fa-solid.fa-xmark").removeEventListener("click", closeModal);
      modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
      modal = null;
    };

    // Écouteur d'événement pour ouvrir la modal
    document.querySelector(".js-modal").addEventListener("click", openModal);

    // Fonction pour afficher les projets dans la modal 
    function projetsModal() {
      const createBaliseDiv = document.createElement("div");
      createBaliseDiv.classList = "divModalImg";
      document.querySelector(".modal-wrapper").appendChild(createBaliseDiv);

      Projets.map((projet) => {
        // Création d'un conteneur pour chaque image et son logo trash
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");

        // Création de l'image
        const createBaliseImg = document.createElement("img");
        createBaliseImg.src = projet.imageUrl;
        createBaliseImg.alt = projet.title;
        createBaliseImg.classList = "imageModal";
        imageContainer.appendChild(createBaliseImg);

        // Création du logo trash
        const createBaliseLogo = document.createElement("i");
        createBaliseLogo.classList = "fa-solid fa-trash-can trash-icon";
        createBaliseLogo.style = "color: #FFFFFF;";
        imageContainer.appendChild(createBaliseLogo);

        // Ajout du conteneur à la modal
        document.querySelector(".divModalImg").appendChild(imageContainer);
      });

      // Création du bouton "Ajouter une photo"
      const inputAjoutimg = document.createElement("input");
      inputAjoutimg.type = "submit";
      inputAjoutimg.value = "Ajouter une photo";
      inputAjoutimg.classList = "buttonAddImg";
      document.querySelector(".modal-wrapper").appendChild(inputAjoutimg);
    }

    projetsModal();
    //Ferme la modal en appuyant sur Echap 
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
      }
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
      //création du texte modifier et logo
      const modalText = document.createElement("a");
      modalText.href = "#modal1";
      modalText.innerText = "modifier";
      modalText.classList = "js-modal";
      const titleH2 = document.querySelector(".titleH2");
      modalText.insertBefore(logoH2, modalText.firstChild);
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
Modal();
