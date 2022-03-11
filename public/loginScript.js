"use script";
//Displaying aadhaar card
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");
const loginUserNameField = document.querySelector("#username-field");
const passwordField = document.querySelector("#password-field");
const modal = document.querySelector(".modal");
const hidden = document.querySelectorAll(".hidden");
const overlay = document.querySelector(".overlay");

const close_modal = document.querySelector(".close-modal");

const userAadhaarNumberField = document.querySelector(
  "#aadhaar-card-number-aadhaarNo-field"
);
const userNameField = document.querySelector(
  "#aadhaar-card-number-username-field"
);
const userDOBField = document.querySelector("#aadhaar-card-number-dob-field");
const userGenderField = document.querySelector(
  "#aadhaar-card-number-gender-field"
);
const loginAadhaarCardForm = document.querySelector(
  ".login-aadhaarCardDisplay-form"
);

let username, password;
function openModal() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden"); // to add blur
}
//for close button
function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

loginButton.addEventListener("click", (e) => {
  e.preventDefault();

  if (!loginUserNameField.value || !passwordField.value) {
    loginErrorMsg.style.opacity = 1;
  } else {
    username = loginUserNameField.value;
    password = passwordField.value;
  }
  getUserNameAndPassword(username, password);
});

const getUserNameAndPassword = async (userName, userPassword) => {
  console.log("getUserNameAndAddress");
  console.log(userName, userPassword);
  try {
    // Get information about the user name and address
    const req = await fetch(
      `http://localhost:4500/login/${userName}/${userPassword}`
    );

    const res = await req.json();
    console.log(res);
    if (res.length === 0) {
      alert(
        "No Data Found with that username/password. Please check Your Details Once!!"
      );
    } else {
      let getUserLoginData = res[0];
      console.log(getUserLoginData);
      openModal();
      userAadhaarNumberField.value = getUserLoginData.AadhaarNumber;
      userNameField.value = getUserLoginData.FullName;
      userDOBField.value = getUserLoginData.DateOfBirth;
      userGenderField.value = getUserLoginData.Gender;
      userAadhaarNumberField.readOnly = true;
      userNameField.readOnly = true;
      userDOBField.readOnly = true;
      userGenderField.readOnly = true;
      close_modal.addEventListener("click", function () {
        closeModal();
        loginUserNameField.value = "";
        passwordField.value = "";
      });
      overlay.addEventListener("click", closeModal);

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) {
          modal.classList.add("hidden");
          overlay.classList.add("hidden");
        }
      });
    }
    //}
  } catch {
    console.log("error");
  }
};
