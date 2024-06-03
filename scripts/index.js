// Récupération des données sur l'API et transformation des données en JSON
async function fetchProjets() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des projets");
    }
    return await response.json();
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des projets: ${error.message}`
    );
    return []; // Retourne un tableau vide en cas d'erreur
  }
}

async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des catégories");
    }
    return await response.json();
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des catégories: ${error.message}`
    );
    return []; // Retourne un tableau vide en cas d'erreur
  }
}

const Projets = await fetchProjets();
const categories = await fetchCategories();
// Récupération du token
const token = window.localStorage.getItem("token");
//Déclaration de la Modale à Null
let modal = null;
//Déclaration de la variable pour l'affichage d'erreur
const errorMessage = document.createElement("p");
errorMessage.classList = "errorPicture";

// Fonction d'affichage des projets
function displayProjects(Projets) {
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
function createFilterButtons() {
  try {
    const divPortfolio = document.querySelector(".DivFiltres");
    const BaliseInputTous = document.createElement("input");
    BaliseInputTous.type = "button";
    BaliseInputTous.value = "Tous";
    BaliseInputTous.classList = "btnFiltres";
    BaliseInputTous.addEventListener("click", () => {
      document.querySelector(".gallery").innerHTML = "";
      displayProjects(Projets);
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
        displayProjects(ProjetsFiltrees);
      });
    });
  } catch (error) {
    console.error(`Erreur: ${error}`);
  }
}
// Fonction pour créer le mode édition et le lien de modification
function createEditModeAndLink() {
  const header = document.querySelector("header");
  header.style.marginTop = "109px";

  const menuEdit = document.createElement("div");
  menuEdit.classList.add("menuEdit");
  menuEdit.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> <p>Mode édition</p>`;

  header.insertBefore(menuEdit, header.firstChild);

  const logoH2 = document.createElement("i");
  logoH2.classList.add("fa-regular", "fa-pen-to-square");

  const modalText = document.createElement("a");
  modalText.href = "#modal1";
  modalText.innerText = "modifier";
  modalText.classList.add("js-modal");
  modalText.insertBefore(logoH2, modalText.firstChild);

  const titleH2 = document.querySelector(".titleH2");
  titleH2.appendChild(modalText);
}
// Fonction pour gérer la déconnexion et l'affichage des fonctionnalités
function handleUserAuthentication() {
  try {
    const logoutButton = document.getElementById("logout");
    if (token) {
      createEditModeAndLink();
      logoutButton.innerText = "Logout";
      logoutButton.addEventListener("click", () => {
        window.localStorage.removeItem("token");
        location.href = "index.html";
      });
    } else {
      createFilterButtons(categories, []);
      logoutButton.addEventListener("click", () => {
        location.href = "login.html";
      });
    }
  } catch (error) {
    console.error(`Erreur: ${error}`);
  }
}
// Fonction pour créer la modale
function initModal() {
  // Fermer la modale avec la touche Escape
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
      closeModal(e);
    }
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
        async function deleteProjects() {
          // Suppression de l'élément parent (imageContainer)
          fetch(`http://localhost:5678/api/works/${projet.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => {
              if (response.ok) {
                // Création et affichage du logo check
                const checkIcon = document.createElement("i");
                checkIcon.classList = "fa-solid fa-check Modal";
                checkIcon.style.color = "#63E6BE";
                imageContainer.appendChild(checkIcon);
                const modalConfirm = document.getElementById("modalOpen");
                modalConfirm.style.display = "none";
                modalConfirm.setAttribute("aria-hidden", "true");
                // Retrait de l'image et de l'icône poubelle
                createBaliseImg.style.display = "none";
                createElementTrash.style.display = "none";
                setTimeout(() => {
                  imageContainer.remove();
                }, 500);
                // Affichage des projets après la suppression réussie
                document.querySelector(".gallery").innerHTML = "";
                fetch("http://localhost:5678/api/works")
                  .then((response) => response.json())
                  .then((Projets) => displayProjects(Projets))
                  .catch((error) =>
                    console.error(
                      "Erreur lors de la récupération des projets:",
                      error
                    )
                  );
              }
            })
            .catch((error) => console.error("Erreur:", error));
        }
        createElementTrash.addEventListener("click", () => {
          deleteProjects();
        });
      });

      //Barre de séparation
      const BarSeparate = document.createElement("hr");
      BarSeparate.classList = "barSeparate";
      document.querySelector(".modal-wrapper").appendChild(BarSeparate);
      // Bouton pour ajouter une image
      const inputAjoutimg = document.createElement("input");
      inputAjoutimg.type = "submit";
      inputAjoutimg.value = "Ajouter une photo";
      inputAjoutimg.classList = "buttonAddImage";
      document.querySelector(".modal-wrapper").appendChild(inputAjoutimg);
      inputAjoutimg.addEventListener("click", () => {
        addModal();
      });
    } catch (error) {
      console.error(`Erreur: ${error}`);
    }
  }
  projetsModal();
  document.querySelectorAll(".js-modal").forEach((btn) => {
    btn.addEventListener("click", openModal);
  });
  // Fonction pour ajouter une photo dans le formulaire
  function addModal() {
    // Création du formulaire HTML
    const formHtml = `
    <div class="returnExit">
    <i class="fa-solid fa-arrow-left"></i>
    <i class="fa-solid fa-xmark"></i>
    </div>
    <form action="/upload" method="post" id="form-modal">
    <h1 id ="titleModal">Ajout photo</h1>
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
    document.querySelector(".modal-wrapper").innerHTML = formHtml;
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
        projetsModal(e);
        document
          .querySelector(".fa-solid.fa-xmark")
          .addEventListener("click", function (e) {
            closeModal(e);
          });
      });

    function getNewImage() {
      const addImage = document.getElementById("add-image");
      addImage.addEventListener("change", () => {
        const image = addImage.files[0];
        // Vérification du type de fichier : image/jpeg ou image/png
        if (image.type === "image/jpg" || image.type === "image/png") {
          if (image.size <= 4000000) {
            // Vérification de la taille de l'image : 4mo max
            // Création d'un objet FileReader pour lire le contenu du fichier
            const fileReader = new FileReader();
            // Lorsque la lecture est terminée, l'URL de l'image est chargée
            fileReader.onload = () => {
              const imgPreview = document.querySelector(".img-preview");
              const iconImage = document.querySelector(".icon-image");
              const labelAddImage = document.querySelector(".label-add-image");
              const textImage = document.querySelector(".text-image");
              iconImage.style.display = "none";
              addImage.style.display = "none";
              labelAddImage.style.display = "none";
              textImage.style.display = "none";
              imgPreview.src = fileReader.result;
              imgPreview.style.display = "flex";
              const crossImage = document.createElement("i");
              crossImage.classList = "fa-solid fa-xmark image";
              crossImage.style.display = "block";

              const divInput = document.querySelector(".divInput");
              divInput.insertBefore(crossImage, divInput.firstChild);
              crossImage.addEventListener("click", () => {
                addModal();
              });
            };
            // Lecture de l'URl de l'image
            fileReader.readAsDataURL(image);
          } else {
            errorMessage.innerText = "Attention : Votre image dépasse les 4 Mo";
            const hrElement = document.querySelector(".divInput");
            hrElement.parentNode.insertBefore(errorMessage, hrElement);
            const addImageInput = document.getElementById("add-image");
            addImageInput.value = "";
          }
        }
      });
    }
    getNewImage();

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
    // Écouter la soumission du formulaire
    document
      .getElementById("form-modal")
      .addEventListener("submit", async function (e) {
        e.preventDefault();
        errorMessage.innerText = "";

        // Récupérer les données du formulaire
        const imageFile = document.getElementById("add-image").files[0];
        const title = document.getElementById("input-title").value;
        const categoryId = document.getElementById("selectCategory").value;
        //verification si les elements sont pas vide
        if (!imageFile && !title && !categoryId) {
          errorMessage.innerText =
            "Attention : Là je crois que tu as tout oublié.";
        } else if (!imageFile && !title) {
          errorMessage.innerText =
            "Attention : Il faut peut-être mettre un fichier et ajouter un titre ?";
        } else if (!imageFile && !categoryId) {
          errorMessage.innerText =
            "Attention : Il faut peut-être mettre un fichier et choisir une catégorie ?";
        } else if (!title && !categoryId) {
          errorMessage.innerText =
            "Attention : Je pense qu'avec un titre et une catégorie cela serait plus facile.";
        } else {
          if (!imageFile) {
            errorMessage.innerText =
              "Attention : Il faut peux être mettre un fichier ?";
          }
          if (!title) {
            errorMessage.innerText =
              "Attention : Je pense qu'avec un titre cela serais plus facile";
          }
          if (!categoryId) {
            errorMessage.innerText =
              "Attention : tu n'aime pas mettre tes images dans des catégories";
          }
        }
        const hrElement = document.querySelector(".barSeparator");
        hrElement.parentNode.insertBefore(errorMessage, hrElement);
        if (imageFile && title && categoryId) {

          // Créer un objet FormData
          const formData = new FormData();
          formData.append("image", imageFile);
          formData.append("title", title);
          formData.append("category", categoryId);

          // Fonction pour ajouter un projet en envoyant les données du formulaire à l'API
          async function addProjects(formData) {
            // Envoyer les données à l'API
            await fetch("http://localhost:5678/api/works", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            });

            // Masquer la modale de confirmation
            const modalConfirm = document.getElementById("modalOpenAdd");
            modalConfirm.style.display = "none";
            modalConfirm.setAttribute("aria-hidden", "true");

            // Réactualiser les projets depuis l'API après l'ajout réussi
            const updatedProjects = await fetchProjets();
            document.querySelector(".gallery").innerHTML = "";
            displayProjects(updatedProjects);
            // Afficher une confirmation de validation de l'image
            addModal();
            //Permet d'affiché un message de validation
            const textImage = document.querySelector(".text-image");
            textImage.innerText = `Image validée : ${imageFile.name}`;
            const logoImage = document.querySelector(".fa-solid.fa-image");
            logoImage.classList = "fa-solid fa-check";
            logoImage.style = "color: #63E6BE;";
            const buttonAddPicture = document.querySelector(".label-add-image");
            buttonAddPicture.style.display = "none";
            setTimeout(() => {
              addModal();
            }, 1000);
          }
          // Appeler la fonction pour ajouter le projet
          await addProjects(formData);
        }
      });
  }
}

// Affichage des projets et gestion de la modale si l'utilisateur est connecté
displayProjects(Projets);
handleUserAuthentication();
if (token) {
  // Appel à la fonction initModal après sa définition
  initModal();
}
