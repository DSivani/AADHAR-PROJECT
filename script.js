const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");
const modal = document.querySelector(".modal");
const hidden = document.querySelectorAll(".hidden");
const overlay = document.querySelector(".overlay");

const close_modal = document.querySelector(".close-modal");
function openModal() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden"); // to remove blur
}
function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("click");
  const username = loginForm.username.value;
  const password = loginForm.password.value;
  if (username === "user" && password === "dev") {
    // loginButton.addEventListener("click", openModal);
    openModal();

    close_modal.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        modal.classList.add("hidden");
        overlay.classList.add("hidden");
      }
    });
  } else {
    loginErrorMsg.style.opacity = 1;
  }
});
