async function fetchProjets() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des projets');
    }
    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la récupération des projets: ${error.message}`);
    return []; // Retourne un tableau vide en cas d'erreur
  }
}

async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des catégories');
    }
    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la récupération des catégories: ${error.message}`);
    return []; // Retourne un tableau vide en cas d'erreur
  }
}

// Récupération des données sur l'API et transformation des données en JSON
const Projets = await fetchProjets();
const categories = await fetchCategories();

// Récupération du token
const token = window.localStorage.getItem("token");
// Modale
let modal = null;

// Fonction d'affichage des projets
function affichageProjets(Projets) {
  try {
    Projets.map((projet) => {
      const BaliseFigure = document.createElement("figure");
      const TitleProjet = document.createElement("figcaption");
      const BaliseImg = document.createElement("img");

      TitleProjet.textContent = projet.title;
      BaliseImg.src = projet.imageUrl;
      BaliseImg.alt = projet.title;

      BaliseFigure.appendChild(BaliseImg);
      BaliseFigure.appendChild(TitleProjet);
      document.querySelector(".gallery").appendChild(BaliseFigure);
    });
  } catch (error) {
    console.error(`Erreur: ${error}`);
  }
}

// Fonction pour créer les boutons de tri
function CreationBoutonTri() {
  try {
    const divPortfolio = document.querySelector(".DivFiltres");
    const BaliseInputTous = document.createElement("input");
    BaliseInputTous.type = "button";
    BaliseInputTous.value = "Tous";
    BaliseInputTous.classList = "btnFiltres";
    BaliseInputTous.addEventListener("click", () => {
      document.querySelector(".gallery").innerHTML = "";
      affichageProjets(Projets);
    });
    divPortfolio.appendChild(BaliseInputTous);

    categories.map((category) => {
      const BalisesInput = document.createElement("input");
      BalisesInput.type = "button";
      BalisesInput.value = category.name;
      BalisesInput.id = category.id;
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
  }
}

// Fonction de connexion
function logout() {
  try {
    const logout = document.getElementById("logout");
    if (token) {
      logout.innerText = "Logout";
      const logoH2 = document.createElement("i");
      logoH2.classList = "fa-regular fa-pen-to-square";
      const modalText = document.createElement("a");
      modalText.href = "#modal1";
      modalText.innerText = "modifier";
      modalText.classList = "js-modal";
      const titleH2 = document.querySelector(".titleH2");
      modalText.insertBefore(logoH2, modalText.firstChild);
      titleH2.appendChild(modalText);
      logout.addEventListener("click", () => {
        window.localStorage.removeItem("token");
        logout.href = "index.html";
      });
    } else {
      CreationBoutonTri();
      logout.addEventListener("click", () => {
        logout.href = "login.html";
      });
    }
  } catch (error) {
    console.error(`Erreur: ${error}`);
  }
}

// Fonction pour créer la modale
function Modal() {
  // Fermer la modale avec la touche Escape
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
      closeModal(e);
    }
  });

  projetsModal();
  document.querySelectorAll(".js-modal").forEach((btn) => {
    btn.addEventListener("click", openModal);
  });
  // Fonction pour arrêter la propagation de l'événement
  function stopPropagation(e) {
    e.stopPropagation();
  }

  // Fonction pour ouvrir la modale
  function openModal(e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href"));
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");

    // Enlève aria-hidden sur les balises "i"
    modal
      .querySelectorAll("i")
      .forEach((icon) => icon.removeAttribute("aria-hidden"));

    modal.addEventListener("click", closeModal);
    modal
      .querySelector(".fa-solid.fa-xmark")
      .addEventListener("click", closeModal);
    modal
      .querySelector(".js-modal-stop")
      .addEventListener("click", stopPropagation);
  }
  // Fonction pour fermer la modale
  function closeModal(e) {
    if (modal === null) return;
    e.preventDefault();
    window.setTimeout(function () {
      modal.style.display = "none";
    }, 500);
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal
      .querySelector(".fa-solid.fa-xmark")
      .removeEventListener("click", closeModal);
    modal
      .querySelector(".js-modal-stop")
      .removeEventListener("click", stopPropagation);
  }
  // Fonction pour afficher les projets dans la modale
  // Fonction pour afficher les projets dans la modale
  async function projetsModal() {
    try {
      // Création de l'icône X
      const iconModal = document.createElement("i");
      iconModal.classList = "fa-solid fa-xmark";
      document.querySelector(".modal-wrapper").appendChild(iconModal);

      // Création du titre
      const h1Modal = document.createElement("h1");
      h1Modal.innerText = "Galerie photo";
      h1Modal.id = "titlemodal";
      document.querySelector(".modal-wrapper").appendChild(h1Modal);

      // Création de la div pour les images
      const createBaliseDiv = document.createElement("div");
      createBaliseDiv.classList = "divModalImg";
      document.querySelector(".modal-wrapper").appendChild(createBaliseDiv);

      // Récupération des projets depuis l'API
      const Projets = await fetchProjets();

      // Ajout des images dans la div
      Projets.map((projet) => {
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");

        const createBaliseImg = document.createElement("img");
        createBaliseImg.src = projet.imageUrl;
        createBaliseImg.alt = projet.title;
        createBaliseImg.classList = "imageModal";
        imageContainer.appendChild(createBaliseImg);

        const createElementTrash = document.createElement("i");
        createElementTrash.classList = "fa-solid fa-trash-can trash-icon";
        createElementTrash.style = "color: #FFFFFF;";
        imageContainer.appendChild(createElementTrash);
        document.querySelector(".divModalImg").appendChild(imageContainer);
        createElementTrash.addEventListener("click", () => {
          // Suppression de l'élément parent (imageContainer)
          fetch(`http://localhost:5678/api/works/${projet.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => {
              if (response.ok) {
                imageContainer.remove();
                // Affichage des projets après la suppression réussie
                document.querySelector(".gallery").innerHTML = "";
                fetch("http://localhost:5678/api/works")
                  .then((response) => response.json())
                  .then((Projets) => affichageProjets(Projets))
                  .catch((error) =>
                    console.error(
                      "Erreur lors de la récupération des projets:",
                      error
                    )
                  )
              }
            })
            .catch((error) => console.error("Erreur:", error));
        });
      });

      // Bouton pour ajouter une image
      const inputAjoutimg = document.createElement("input");
      inputAjoutimg.type = "submit";
      inputAjoutimg.value = "Ajouter une photo";
      inputAjoutimg.classList = "buttonAddImg";
      document.querySelector(".modal-wrapper").appendChild(inputAjoutimg);
      inputAjoutimg.addEventListener("click", () => {
        addModal();
      });
    } catch (error) {
      console.error(`Erreur: ${error}`);
    }
  }

  // Fonction pour ajouter une photo dans le formulaire
  function addModal() {
    // Création du formulaire HTML
    const formHtml = `
    <div class="returnExit">
    <i class="fa-solid fa-arrow-left"></i>
    <i class="fa-solid fa-xmark"></i>
    </div>
    <form action="/upload" method="post" id="form-modal">
    <h1 id ="titlemodal">Ajout photo</h1>
    <label for="add-image" class="label-add">
    <img src="" alt="image upload" class="img-preview">
    <span class="icon-image"><i class="fa-solid fa-image"></i></span>
    <label for="add-image" class="label-add-image">+ Ajouter photo</label>
    <input type="file" name="add-image" id="add-image" />
    <span class="text-image">jpg, png : 4mo max</span>
    </label>
    <div class="divInput">
    <label for="input-title">Titre</label>
    <input type="text" id="input-title" placeholder="Entrer un titre ...">
    <label for="selectCategory">Catégories</label>
    <select name="selectCategory" id="selectCategory">
    <option value=""disabled selected>Sélectionner la catégorie ...</option>
    </select>
    <hr class="barSeparator">
    <input type="submit" value="Valider" class="buttonAddImg">
    </div>
    </form>
    `;

    // Remplacer le contenu de la modale par le formulaire HTML
    document.querySelector(".modal-wrapper").innerHTML = formHtml
    remplirSelecteurCategories(categories);
    document
      .querySelector(".fa-solid.fa-xmark")
      .addEventListener("click", function (e) {
        closeModal(e);
      });
    document
      .querySelector(".fa-solid.fa-arrow-left")
      .addEventListener("click", function (e) {
        document.querySelector(".modal-wrapper").innerHTML = "";
        projetsModal(e)
        document
          .querySelector(".fa-solid.fa-xmark")
          .addEventListener("click", function (e) {
            closeModal(e);
          });
      });

    function remplirSelecteurCategories(categories) {
      const selecteur = document.getElementById("selectCategory");

      // Créez une option par catégorie et ajoutez-la au sélecteur
      categories.map((categorie) => {
        const option = document.createElement("option");
        option.value = categorie.id;
        option.textContent = categorie.name;
        selecteur.appendChild(option);
      });
    }
  }


}

// Affichage des projets et gestion de la modale si l'utilisateur est connecté
affichageProjets(Projets);
logout();
if (token) {
  Modal();
}


/** // Écouter la soumission du formulaire
  const Getdata = document.getElementById("form-modal");
  Getdata.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData();

    // Récupérer les données du formulaire
    const imageFile = document.getElementById("add-image").files[0];
    const title = document.getElementById("input-title").value;
    const category = document.getElementById("selectCategory").value;

    // Ajouter les données au FormData
    formData.append("image", imageFile);
    formData.append("title", title);
    formData.append("category", category);

    // Envoyer les données à l'API
    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de l'ajout de la photo");
        }
        return response.json();
      })
      .then((data) => {
        // Afficher les projets après l'ajout réussi
        document.querySelector(".gallery").innerHTML = "";
        fetch("http://localhost:5678/api/works")
          .then((response) => response.json())
          .then((Projets) => affichageProjets(Projets))
          .catch((error) =>
            console.error(
              "Erreur lors de la récupération des projets:",
              error
            )
          );
      })
      .catch((error) => console.error("Erreur:", error));
  }); */