const formulaireConnect = document.querySelector("form");
formulaireConnect.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await response.json();
    const token = data.token;

    if (response.status < 400) {
      window.localStorage.setItem("token", token);
      console.log("Le token a été sauvegardé");
      window.location.href = "index.html";
    } else {
      console.error("Erreur le token n'est pas stocké");
      const erreurID = document.querySelector(".errorIdNone");
      erreurID.classList = "errorId";
    }
  } catch (error) {
    console.error("Erreur :", error);
  }
});
