"use strict";

//Registration Form
const registerBtn = document.querySelector("#Register-form-submit");
const clearBtn = document.querySelector("#Register-form-clear-submit");
const firstName = document.querySelector(".register-firstname");
const lastName = document.querySelector(".register-lastname");
const gender = document.querySelectorAll('input[name="gender"]');
const dob = document.querySelector("#dob");
const pinCode = document.querySelector(".register-pincode");
const phoneNumber = document.querySelector(".register-phone-number");
const email = document.querySelector("#email");
const password = document.querySelector(".register-password");
const confirmPassword = document.querySelector(".register-confirmpassword");
const address = document.querySelector(".register-address");
const relationGender = document.querySelectorAll(
  'input[name="relationGender"]'
);
const relationName = document.querySelector(".register-relation-name");
const relation = document.getElementsByName("relation");
const relationDetails = document.querySelectorAll(".relation-details");

const relationAadhaarNumber = document.querySelector(
  ".register-relation-aadhaarno"
);
const pic = document.querySelector("#photo");

const registerForm = document.querySelector(".register");
const message = document.querySelectorAll(".msg");

/** state city pincode */
let District, State, City;
State = document.querySelector(".register-state");
City = document.querySelector(".register-city");
District = document.querySelector(".register-district");

/** Declaring the status variables */
let checkStatus = true,
  genderCheckStatus = true;

/** Register success message modal */
const registerSuccessModal = document.querySelector(".register-success-modal");
const hidden = document.querySelectorAll(".hidden");
const registerSuccessOverlay = document.querySelector(
  ".register-success-modal-overlay"
);
const close_modal = document.querySelector("#register-success-modal-btnOk");

function openModal() {
  console.log("modal open");
  registerSuccessModal.classList.remove("hidden");
  registerSuccessOverlay.classList.remove("hidden"); // to add blur
}
//for close button
function closeModal() {
  registerSuccessModal.classList.add("hidden");
  registerSuccessOverlay.classList.add("hidden");
}
/** upload photo */
let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let photo = document.getElementById("photo");
let takePhoto = document.getElementById("take-photo-button");
let startCamera = document.getElementById("start-camera-button");
let stopCamera = document.getElementById("stop-camera-button");
let retakePhoto = document.getElementById("retake-button");

let width = 320; // We will scale the photo width to this
let height = 0; // This will be computed based on the input stream
let streaming = false;

/**  Saving Data To SQL   */

const saveDataToSQL = async (
  fullNameValue,
  genderValue,
  userDOB,
  userAge,
  phoneNumberValue,
  emailValue,
  passwordValue,
  //userPic,
  addressValue,
  pinCodeValue,
  stateValue,
  cityValue,
  districtValue,
  userAadhaarNumber
) => {
  const rawResponse = await fetch("/register", {
    method: "POST",

    body: JSON.stringify({
      FullName: fullNameValue,
      Gender: genderValue,
      DateOfBirth: userDOB,
      Age: userAge,
      PhoneNumber: phoneNumberValue,
      EmailId: emailValue,
      Password: passwordValue,
      //Picture: userPic,
      Address: addressValue,
      Pincode: pinCodeValue,
      State: stateValue,
      City: cityValue,
      District: districtValue,
      AadhaarNumber: userAadhaarNumber,
    }),

    headers: {
      "Content-Type": "application/json",
    },
  });

  const content = await rawResponse.json();

  /** clear form values */
  clear();
};

/** Declaring Global Variables */

let fullNameValue,
  genderValue,
  userDOB,
  dateOfBirth,
  userAge,
  userRelationGender,
  userRelationName,
  userRelationAadhaarNumber,
  phoneNumberValue,
  emailValue,
  passwordValue,
  addressValue,
  pinCodeValue,
  stateValue,
  cityValue,
  districtValue,
  temp,
  userPic,
  cityParentValue,
  stateParentValue,
  districtParentValue,
  userAadhaarNumber;

// Regular Expressions for Input Name Field
let fullNameRegEx = /^[A-Za-z_ ]+$/;

// click event for register and clear button
registerBtn.addEventListener("click", registration.bind(this));
clearBtn.addEventListener("click", clear);

/** Calling all the validations */
function registration(ev) {
  ev.preventDefault();
  nameValidate();
  genderValidate();
  phoneNumberValidate();
  emailValidate();
  passwordValidate();
  if (!dob.value) {
    alert("Please select your DOB");
  } else {
    if (userAge < 18) {
      validateRelationGender();
      validateRelationName();
      validateRelationAadhaarNumber();
      getParentAadhaarNumber(userRelationAadhaarNumber, userRelationName);
      validateStatus();
    } else if (userAge > 18) {
      addressValidate();
      pincodeValidate();
      address.readOnly = false;
      pinCode.readOnly = false;
      validateStatus();
    }
  }
}

/** Name Validate function */
function nameValidate() {
  message[0].classList.remove("hidden");

  //validating name field
  if (firstName.value === "" && lastName.value === "") {
    message[0].innerHTML = "Name should not be empty";
    checkStatus = false;
  } else if (
    !(
      firstName.value.match(fullNameRegEx) &&
      lastName.value.match(fullNameRegEx)
    )
  ) {
    message[0].innerHTML = "Name field contains only alphabets";
    checkStatus = false;
  } else if (firstName.value === lastName.value) {
    message[0].innerHTML = "First and Last names should be different";
    checkStatus = false;
  } else {
    message[0].classList.add("hidden");
    fullNameValue = firstName.value + " " + lastName.value;
  }
}
/** Gender Validate Function */
function genderValidate() {
  //getting selected gender value and validating gender field
  message[1].classList.remove("hidden");
  /** checks wheather gender selected or not */
  for (const ele of gender) {
    if (ele.checked) {
      message[1].classList.add("hidden");
      genderValue = ele.value;
      //console.log(`Gender : ${ele.value}`);
      genderCheckStatus = true;
      break;
    } else if (!ele.checked) {
      message[1].innerHTML = "Please Choose your Gender!";
      genderCheckStatus = false;
    }
  }
}

/** Date of Birth Validation */
dob.addEventListener("change", function () {
  let now = new Date();
  userDOB = dob.value;
  //console.log(userDOB);
  dateOfBirth = new Date(userDOB);
  /** checks the dob is less than current date */
  message[2].classList.remove("hidden");
  if (dateOfBirth < now) {
    let userYear = dateOfBirth.getFullYear();
    //console.log(userYear);

    let currentYear = now.getFullYear();
    /** Calculation user age */
    userAge = currentYear - userYear;
    console.log(userAge);

    if (userAge > 0 && userAge < 18) {
      relationDetails.forEach((ele) => {
        ele.classList.remove("hidden");
      });
    } else if (userAge > 18) {
      hideUserRelationDetails();
      address.readOnly = false;
      pinCode.readOnly = false;
    }
  } else {
    message[2].innerHTML = "Invalid date!!Please select date upto today";
    dob.value = "";
    hideUserRelationDetails();
  }
});

/** Hide relation details for age greater than 18 */
function hideUserRelationDetails() {
  relationDetails.forEach((ele) => {
    ele.classList.add("hidden");
  });
}
/** validate relation gender for age less than 18 */
function validateRelationGender() {
  /** checks wheather gender selected or not */
  message[6].classList.remove("hidden");
  for (const ele of relationGender) {
    if (ele.checked) {
      message[6].classList.add("hidden");
      userRelationGender = ele.value;
      //console.log(`Gender : ${ele.value}`);
      genderCheckStatus = true;
      break;
    } else if (!ele.checked) {
      message[6].innerHTML = "Please Choose your Gender!";
      genderCheckStatus = false;
    }
  }
}
/** validate relation name for age less than 18 */
function validateRelationName() {
  message[7].classList.remove("hidden");
  if (relationName.value === "") {
    message[7].innerHTML = "Name should not be empty";
    checkStatus = false;
  } else if (!relationName.value.match(fullNameRegEx)) {
    message[7].innerHTML = "Name field required only alphabet characters";
    checkStatus = false;
  } else {
    message[7].classList.add("hidden");
    userRelationName = relationName.value;
    console.log(userRelationName);
  }
}
/** validate relation Aadhaar number for age less than 18 */
function validateRelationAadhaarNumber() {
  let relationAadhaarNumRegEx = /^[0-9]{12}$/;
  message[8].classList.remove("hidden");
  if (
    relationAadhaarNumber.value === "" ||
    relationAadhaarNumber.value === null
  ) {
    message[8].innerHTML = "Aadhaar number should not be empty!!";
    checkStatus = false;
  } else if (!relationAadhaarNumber.value.match(relationAadhaarNumRegEx)) {
    message[8].innerHTML = "Invalid aadhaar number!!Must contain 12 digits";
    checkStatus = false;
  } else {
    message[8].classList.add("hidden");
    userRelationAadhaarNumber = relationAadhaarNumber.value;
    console.log(`relationAadhaarNumber value : ${userRelationAadhaarNumber}`);
  }
}
/** Gets relation aadhaar number from database */
const getParentAadhaarNumber = async (parentAadhaarNumber, parentName) => {
  console.log(parentAadhaarNumber, parentName);
  try {
    // Get information about the user parent aadhaar number using unique aadhaar number and relation name
    if (relationName.value && relationAadhaarNumber.value) {
      const req = await fetch(
        `http://localhost:5000/register/${parentAadhaarNumber}/${parentName}`
      );

      const res = await req.json();
      console.log(res);
      if (res.length === 0) {
        alert(
          "No data found with that aadhaar number/relation name. Please check Your details once!!"
        );
      } else {
        let getUserParentData = res[0];
        console.log(getUserParentData);
        address.value = getUserParentData.Address;
        pinCode.value = getUserParentData.Pincode;
        State.value = getUserParentData.State;
        City.value = getUserParentData.City;
        District.value = getUserParentData.District;
        address.readOnly = true;
        pinCode.readOnly = true;
        State.readOnly = true;
        City.readOnly = true;
        District.readOnly = true;

        addressValue = address.value;
        pinCodeValue = pinCode.value;
        stateValue = State.value;
        cityValue = City.value;
        districtValue = District.value;
        console.log(addressValue);
        console.log(stateValue);
        console.log(cityValue);
      }
    }
  } catch {
    console.log("error");
  }
};

/** Phone Number Validate Function */
function phoneNumberValidate() {
  //validating phone number
  let numbers = /^[0-9]+$/;
  message[3].classList.remove("hidden");
  if (phoneNumber.value === "" || phoneNumber.value === null) {
    message[3].innerHTML = "Phone number should not be empty!!";
    checkStatus = false;
  } else if (!phoneNumber.value.match(numbers)) {
    message[3].innerHTML = "Only numbers are allowed";
    checkStatus = false;
  } else if (phoneNumber.value.length !== 10) {
    message[3].innerHTML = "Must be 10 digits";
    checkStatus = false;
  } else {
    message[3].classList.add("hidden");
    phoneNumberValue = phoneNumber.value;
    //console.log(phoneNumberValue);
  }
}

/** Email Validate Function */
function emailValidate() {
  //validating email
  let emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  message[4].classList.remove("hidden");
  if (email.value === "" || email.value === null) {
    message[4].innerHTML = "Email should not be empty!!";
    checkStatus = false;
  } else {
    if (!email.value.match(emailRegex)) {
      message[4].innerHTML =
        "InValid email address!Format should be anything@anything.com";
      checkStatus = false;
    } else {
      emailValue = email.value.toLowerCase();
      message[4].classList.add("hidden");
      //console.log(emailValue);
    }
  }
}

/** Sends Email if Registration was Successful */
function sendEmail() {
  let getEmail = emailValue;
  let emailOnly = getEmail.split("@").pop().split(".")[0];
  //console.log(emailOnly);

  let checkEmail;

  //console.log(getEmail);
  if (emailOnly === "gmail") {
    checkEmail = ".gmail";
  } else if (emailOnly === "yahoo") {
    checkEmail = ".mail.yahoo";
  } else if (emailOnly === "outlook") {
    checkEmail = "-mail.outlook";
  } else if (emailOnly === "live") {
    checkEmail = ".live";
  }
  Email.send({
    Host: `smtp${checkEmail}.com`,
    Username: "noreplyaadhaarcard@gmail.com",
    Password: "Aadhaar@123",
    To: emailValue,
    From: "noreplyaadhaarcard@gmail.com",
    Subject: "MyAadhaaar",
    Body: `<html><div class="email-template">
    <h3>Hi ${fullNameValue},</h3>
    <p class="email-body">You have successfully registered for Aadhaar. To check your Aadhaar Number please click
    <a href="http://localhost:4000" class="email-body-login-link">Login</a>!!</p>
    <p class="email-footer">Thank You,<br></br>Aadhaar Team.</p>
    </div></html>`,
  }).then(function (message) {
    console.log("Mail sent successfully!!");
    //message[4].innerHTML = "mail sent successfully";
  });
}

/** Password Validate Function */
function passwordValidate() {
  //validating password
  let pwd_expression =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;
  message[5].classList.remove("hidden");
  if (password.value === "" && confirmPassword.value === "") {
    //alert("password empty");
    message[5].innerHTML = "Password should not be empty!!";
    checkStatus = false;
  } else if (!pwd_expression.test(password.value)) {
    message[5].innerHTML =
      "Upper case, Lower case, Special character and Numeric letter are required in password filed";
    checkStatus = false;
  } else if (password.value != confirmPassword.value) {
    message[5].innerHTML = "Password not matched!!";
    checkStatus = false;
  } else if (
    confirmPassword.value.length < 4 ||
    confirmPassword.value.length > 12
  ) {
    message[5].innerHTML = "Password minimum length is 6 and max length is 12";
    checkStatus = false;
  } else {
    message[5].classList.add("hidden");
    passwordValue = confirmPassword.value;
  }
}

/** Address Validate Function */
function addressValidate() {
  let addressRegEx = /^[a-zA-Z0-9-:./,\s]+$/;
  message[9].classList.remove("hidden");
  //console.log(address.value);
  if (address.value.trim() === "") {
    message[9].innerHTML = "Address should not be empty!!";
    checkStatus = false;
  } else if (!address.value.match(addressRegEx)) {
    message[9].innerHTML = "Address should not contain special characters!!";
    checkStatus = false;
  } else {
    message[9].classList.add("hidden");
    addressValue = address.value.trimEnd().trimStart();
    //console.log(addressValue);
  }
}
/** Pincode Validate Function */
function pincodeValidate() {
  //validating pin code
  let pinCodeRegEx = /^[1-9]{1}[0-9]{2}[0-9]{3}$/;
  message[10].classList.remove("hidden");
  if (pinCode.value === "" || pinCode.value === null) {
    //alert("empty");
    message[10].innerHTML = "Pincode should not be empty!!";
    checkStatus = false;
  } else if (!pinCode.value.match(pinCodeRegEx)) {
    message[10].innerHTML = "Invalid pin code!!Pin code must contain 6 digits";
    checkStatus = false;
  } else {
    message[10].classList.add("hidden");
    pinCodeValue = pinCode.value;
    //console.log(`Pin code : ${pinCodeValue}`);
    getDataCityState(pinCodeValue);
  }
}

/** gets states,city,district using pincode from postal api */
const getDataCityState = async function (pinCodeValue) {
  try {
    const res = await fetch(
      `https://api.postalpincode.in/pincode/${pinCodeValue}`
    );

    //console.log(res);
    const data = await res.json();
    //console.log(data);
    let getPostOfficeData = data[0]["PostOffice"];
    for (let e of getPostOfficeData) {
      if (e.BranchType === "Head Post Office") {
        getCityStateValues(e);
        break;
      } else {
        if (
          e.BranchType !== "Head Post Office" &&
          e.BranchType === "Sub Post Office"
        ) {
          getCityStateValues(e);
        }
      }
    }
  } catch {
    console.log("error");
  }
};
//Assigning values to input fields
function getCityStateValues(e) {
  State.value = e.State;
  State.readOnly = true;
  City.value = e.Name;
  City.readOnly = true;
  District.value = e.District;
  District.readOnly = true;

  stateValue = State.value;
  cityValue = City.value;
  districtValue = District.value;
}

/**  Checks for multiple users */
const getUserNameAndAddress = async (getUserEmail) => {
  try {
    // Get information about the user email from database
    const req = await fetch(`http://localhost:5000/register/${getUserEmail}`);

    const res = await req.json();
    //console.log(res);
    if (res.length === 0) {
      randomUniqueAadhaarNumber(999999999, 1);
      sendDataToSQL();
    } else {
      alert("You have already registered!!");
      clear();
    }
  } catch {
    console.log("error");
  }
};

function validateStatus() {
  if (checkStatus === false || genderCheckStatus === false) {
    alert("Please enter fields correctly!!");
    checkStatus = true;
  } else {
    getUserNameAndAddress(emailValue);
    // randomUniqueAadhaarNumber(999999999999, 1);
    // sendDataToSQL();
  }
}

/** Generates Unique  aadhaar number */
const randomUniqueAadhaarNumber = (range, count) => {
  let nums = new Set();
  while (nums.size < count) {
    nums.add(
      pinCodeValue.slice(2, 5) + Math.floor(Math.random() * (range - 1 + 1) + 1)
    );
  }
  userAadhaarNumber = parseInt([...nums]);
  console.log(userAadhaarNumber);
};

// upload a photo
startCamera.addEventListener("click", function () {
  console.log("cam");
  startCam();
  takePhoto.addEventListener("click", takePicture);
  clearPhoto();
  stopCamera.addEventListener("click", stopCam);
  retakePhoto.addEventListener("click", retakePicture);
});

//to start the web camera
function startCam() {
  //   console.log("click");
  //to on web cam
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then(function (stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function (err) {
      console.log("An error occurred: " + err);
    });
  //sets size to the video
  video.addEventListener(
    "canplay",
    function (ev) {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);

        if (isNaN(height)) {
          height = width / (4 / 3);
        }

        video.setAttribute("width", width);
        video.setAttribute("height", height);
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        streaming = true;
      }
      video.style.display = "block";
      takePhoto.style.display = "block";
      stopCamera.style.display = "block";
      startCamera.style.display = "none";
    },
    false
  );
}
//takes picture
function takePicture(ev) {
  ev.preventDefault();

  let context = canvas.getContext("2d");
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    var data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
    // console.log(photo.setAttribute("src", data));
    // temp = pic.src;
    // userPic = temp.blob();

    stopCam();
    startCamera.style.display = "none";
    video.style.display = "none";
    takePhoto.style.display = "none";
    photo.style.display = "block";
    retakePhoto.style.display = "block";
  } else {
    clearPhoto();
  }
}

//to clear the saved image and gets the latest image
function clearPhoto() {
  var context = canvas.getContext("2d");
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);

  var data = canvas.toDataURL("image/png");
  photo.setAttribute("src", data);
}
// stops the webcam
function stopCam() {
  var stream = video.srcObject;
  var tracks = stream.getTracks();
  for (var i = 0; i < tracks.length; i++) {
    var track = tracks[i];
    track.stop();
  }
  video.srcObject = null;
  photo.style.display = "none";
  video.style.display = "none";
  takePhoto.style.display = "none";
  stopCamera.style.display = "none";
  startCamera.style.display = "block";
}

// retake photo
function retakePicture() {
  console.log("click");
  startCamera.style.display = "none";
  photo.style.display = "none";
  retakePhoto.style.display = "none";
  startCam();
}

/** Sends  Data to SQL */
function sendDataToSQL() {
  setTimeout(function () {
    saveDataToSQL(
      fullNameValue,
      genderValue,
      userDOB,
      userAge,
      phoneNumberValue,
      emailValue,
      passwordValue,
      //userPic,
      addressValue,
      pinCodeValue,
      stateValue,
      cityValue,
      districtValue,
      userAadhaarNumber
    );
    openModal();
    close_modal.addEventListener("click", function () {
      closeModal();
      //sendEmail();
    });
  }, 10000);
}

/** clear Register Form */

function clear() {
  registerForm.reset();
}
