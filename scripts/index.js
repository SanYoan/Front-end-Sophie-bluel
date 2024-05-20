// Récupération des données sur l'api & Transforme les données en .json
const Projets = await fetch("http://localhost:5678/api/works").then((Projets) =>
  Projets.json()
);
const categories = await fetch("http://localhost:5678/api/categories").then(
  (categories) => categories.json()
);

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

// Modal
let modal = null;

function stopPropagation(e) {
  e.stopPropagation();
}

function openModal(e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute("href"));
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");

  //Enleve aria-hidden sur les balises "i"
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

function closeModal(e) {
  if (modal === null) return;
  e.preventDefault();
  window.setTimeout(function () {
    modal.style.display = "none"
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

function Modal() {
  try {
    document.querySelectorAll(".js-modal").forEach((btn) => {
      btn.addEventListener("click", openModal);
    });

    function projetsModal() {
      //creation Icon X
      const iconModal = document.createElement("i");
      iconModal.classList = "fa-solid fa-xmark";
      document.querySelector(".modal-wrapper").appendChild(iconModal);
      //Creation h1
      const h1Modal = document.createElement("h1");
      h1Modal.innerText = "Galerie photo";
      h1Modal.id = "titlemodal";
      document.querySelector(".modal-wrapper").appendChild(h1Modal);
      //creation balise div
      const createBaliseDiv = document.createElement("div");
      createBaliseDiv.classList = "divModalImg";
      document.querySelector(".modal-wrapper").appendChild(createBaliseDiv);

      Projets.map((projet) => {
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");

        const createBaliseImg = document.createElement("img");
        createBaliseImg.src = projet.imageUrl;
        createBaliseImg.alt = projet.title;
        createBaliseImg.classList = "imageModal";
        imageContainer.appendChild(createBaliseImg);

        const createBaliseLogo = document.createElement("i");
        createBaliseLogo.classList = "fa-solid fa-trash-can trash-icon";
        createBaliseLogo.style = "color: #FFFFFF;";
        createBaliseLogo.addEventListener("click", () => {
          // Suppression de l'élément parent (imageContainer)
          imageContainer.remove();
          fetch(`http://localhost:5678/api/works/${projet.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }).then(response => {
            if (response.ok) {
              // Affichage des projets après la suppression réussie
              document.querySelector(".gallery").innerHTML = "";
              fetch("http://localhost:5678/api/works")
                .then(response => response.json())
                .then(projects => affichageProjets(projects))
                .catch(error => console.error('Erreur lors de la récupération des projets:', error));
            } else {
              console.error('Erreur lors de la suppression du projet');
            }
          }).catch(error => console.error('Erreur:', error));
        });
        imageContainer.appendChild(createBaliseLogo);

        document.querySelector(".divModalImg").appendChild(imageContainer);
      });

      //Button Add Image
      const inputAjoutimg = document.createElement("input");
      inputAjoutimg.type = "submit";
      inputAjoutimg.value = "Ajouter une photo";
      inputAjoutimg.classList = "buttonAddImg";
      document.querySelector(".modal-wrapper").appendChild(inputAjoutimg);
      inputAjoutimg.addEventListener("click", () => {
        ajouterPhoto();
      })
    }

    projetsModal();

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
      }
    });
  } catch (error) {
    console.error(`Erreur: ${error}`);
  }
}
function ajouterPhoto() {
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

  // Remplacer le contenu de la modal par le formulaire HTML
  document.querySelector(".modal-wrapper").innerHTML = formHtml;
  document.querySelector(".fa-solid.fa-xmark").addEventListener("click", function (e) {
    closeModal(e)
  })
  document.querySelector(".fa-solid.fa-arrow-left").addEventListener("click", function (e) {
    document.querySelector(".modal-wrapper").innerHTML = ""
    Modal()
  })
}

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

const token = window.localStorage.getItem("token");
function login() {
  try {
    const login = document.getElementById("logout");
    if (token) {
      login.innerText = "Logout";
      const logoH2 = document.createElement("i");
      logoH2.classList = "fa-regular fa-pen-to-square";
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
      CreationBoutonTri();
      login.addEventListener("click", () => {
        login.href = "login.html";
      });
    }
  } catch (error) {
    console.error(`Erreur: ${error}`);
  }
}

affichageProjets(Projets);
login();
if (token) {
  Modal();
}

