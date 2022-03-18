"use script";
/** DOM Elements */
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
const retrieveImage = document.querySelector("#aadhaar-card-number-upload-img");

/** Declaring global variables */
let username, password, getUserLoginData, blob;

/**
 * To open aadhar card modal when user clicks on login
 * @returns {any}
 */
function openModal() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden"); // to add blur
}

/**
 * To close the modal when user clicks on close button
 * @returns {any}
 */
function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

/**
 * When user clicks on login button validates the username and password fields
 * @param {EventListener}  - click event
 * @param {Event} "e- To prevent form default behaviour"
 * @returns {any}
 */
loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  /** validates the username and password fields */
  if (!loginUserNameField.value || !passwordField.value) {
    loginErrorMsg.style.opacity = 1;
  } else {
    username = loginUserNameField.value;
    password = passwordField.value;
  }
  getUserNameAndPassword(username, password);
});

/**
 * Gets the user details using username and password from the mysql database and populates the user details in aadhaar card modal
 * @param {string} userName
 * @param {password} userPassword
 */
const getUserNameAndPassword = async (userName, userPassword) => {
  try {
    // Get information about the user name and address
    const req = await fetch(
      `http://localhost:5000/login/${userName}/${userPassword}`
    );

    const res = await req.json();
    /** checks if there is response from database or not */
    if (res.length === 0) {
      swal(
        "No data found with that username/password. Please check your details once!!"
      );
    } else {
      /** If data present then user details are assigned to DOM  */
      getUserLoginData = res[0];
      /** opens aadhaar modal to check user information */
      openModal();
      /** Assigning the response data to HTML elements */
      userAadhaarNumberField.value = getUserLoginData.AadhaarNumber;
      userNameField.value = getUserLoginData.FullName;
      userDOBField.value = getUserLoginData.DateOfBirth;
      userGenderField.value = getUserLoginData.Gender;
      blob = getUserLoginData.Picture;
      retrieveImage.src = blob;
      userAadhaarNumberField.readOnly = true;
      userNameField.readOnly = true;
      userDOBField.readOnly = true;
      userGenderField.readOnly = true;
      /** close the modal */
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
  } catch {
    console.log("error");
  }
};
