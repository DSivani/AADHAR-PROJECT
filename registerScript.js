"use strict";

//Registration Form
const registerBtn = document.querySelector("#Register-form-submit");
const firstName = document.querySelector(".register-firstname");
const lastName = document.querySelector(".register-lastname");
const gender = document.getElementsByName("gender");
const dob = document.querySelector("#dob");
const pinCode = document.querySelector(".register-pincode");
const phoneNumber = document.querySelector(".register-phone-number");
const email = document.querySelector("#email");
const password = document.querySelector(".register-password");
const confirmPassword = document.querySelector(".register-confirmpassword");
const relationName = document.querySelector(".register-relation-name");
const relation = document.getElementsByName("relation");
const relationDetails = document.getElementsByClassName("relation-details");
const address = document.querySelector(".register-address");
const relationAadhaarNumber = document.querySelector(
  ".register-relation-aadhaarno"
);
let District, State, City;
State = document.getElementsByClassName("register-state").value;
City = document.getElementsByClassName("register-city").value;
District = document.getElementsByClassName("register-district").value;

// upload photo
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

let userAge, emailValue, fullNameValue, addressValue, pinCodeValue;

registerBtn.addEventListener("click", registration);
function registration() {
  //nameValidate();
  //getSelectedGenderValue();
  //DOBValidate();
  //phoneNumberValidate();
  //emailValidate();
  //passwordValidate();
  //pincodeValidate();
  //addressValidate();
  //randomUniqueAadhaarNumber(999999999, 1);
}
function nameValidate() {
  //validating name field
  let letters = /^[A-Za-z]+$/;
  if (firstName.value === "" && lastName.value === "") {
    // alert("Name should not be empty!!");
    document.getElementById("msg").innerHTML = "Name should not be empty";
  } else if (
    !(firstName.value.match(letters) && lastName.value.match(letters))
  ) {
    document.getElementById("msg").innerHTML =
      "Name field required only alphabet characters";
  } else if (firstName.value === lastName.value) {
    document.getElementById("msg").innerHTML =
      "First and Last Names should be different";
  } else {
    document.getElementById("msg").innerHTML = "";
    fullNameValue = firstName.value + " " + lastName.value;
    console.log(fullNameValue);
  }
}
function getSelectedGenderValue() {
  //getting selected gender value
  for (let i = 0; i < gender.length; i++) {
    if (gender[i].checked === false) {
      document.getElementById("msg1").innerHTML = "Please Choose your Gender!";
    } else if (gender[i].checked) {
      document.getElementById("msg1").innerHTML = "";
      console.log(`Gender : ${gender[i].value}`);
    }
  }
}

function DOBValidate() {
  //validating date of birth
  let userDOB = dob.value;
  let dateOfBirth = new Date(userDOB);
  console.log(dateOfBirth);

  if (userDOB == null || userDOB == "") {
    document.getElementById("msg2").innerHTML = "**Choose a date please!";
    return false;
  }
  //execute if the user entered a date
  else {
    document.getElementById("msg2").innerHTML = "";
    //extract the year, month, and date from user date input
    let userYear = dateOfBirth.getFullYear();
    console.log(userYear);

    let userMonth = dateOfBirth.getMonth();
    let userDate = dateOfBirth.getDate();

    //get the current date from the system
    let now = new Date();
    //extract the year, month, and date from current date
    let currentYear = now.getFullYear();
    console.log(currentYear);

    let currentMonth = now.getMonth();
    let currentDate = now.getDate();
    userAge = currentYear - userYear;
    console.log(userAge);
    if (dateOfBirth > now) {
      alert("Invalid Date!!Please select date upto today");
    }
    validateRelationDetails();
  }
}
// validate age and links to parent's aadhaar
function validateRelationDetails() {
  //console.log(relationDetails);

  if (userAge < 18) {
    for (let i = 0; i < relationDetails.length; i++) {
      relationDetails[i].style.display = "block";
      validateRelationGender();
      validateRelationName();
      validateRelationAadhaarNumber();
    }
  } else if (userAge > 18) {
    for (let i = 0; i < relationDetails.length; i++) {
      relationDetails[i].style.display = "none";
    }
  }
}
function validateRelationGender() {
  for (let i = 0; i < relation.length; i++) {
    if (relation[i].checked === false) {
      document.getElementById("msg6").innerHTML =
        "Please Choose your relation!";
    } else if (relation[i].checked) {
      document.getElementById("msg6").innerHTML = "";
      console.log(`relation : ${relation[i].value}`);
    }
  }
}
function validateRelationName() {
  let letters = /^[A-Za-z]+$/;
  if (relationName.value === "") {
    // alert("Name should not be empty!!");
    document.getElementById("msg7").innerHTML = "Name should not be empty";
  } else if (!relationName.value.match(letters)) {
    document.getElementById("msg7").innerHTML =
      "Name field required only alphabet characters";
  } else {
    document.getElementById("msg7").innerHTML = "";
  }
}
function validateRelationAadhaarNumber() {
  let relationAadhaarNumRegEx = /^[1-9]{12}$/;
  if (
    relationAadhaarNumber.value === "" ||
    relationAadhaarNumber.value === null
  ) {
    alert("relationAadhaarNumber should not be empty!!");
  } else if (!relationAadhaarNumber.value.match(relationAadhaarNumRegEx)) {
    alert("Invalid Aadhaar Number!!Must contain 12 digits");
  } else {
    relationAadhaarNumberValue = relationAadhaarNumber.value;
    console.log(`relationAadhaarNumber value : ${relationAadhaarNumberValue}`);
  }
}

function phoneNumberValidate() {
  //validating phone number
  let numbers = /^[0-9]+$/;
  if (phoneNumber.value === "" || phoneNumber.value === null) {
    alert("Phone number should not be empty!!");
  } else if (!phoneNumber.value.match(numbers)) {
    alert("Only numbers are allowed");
  } else if (phoneNumber.value.length !== 10) {
    alert("Must be 10 digits");
  } else {
    let phoneNumberValue = phoneNumber.value;
    console.log(phoneNumberValue);
  }
}
function emailValidate() {
  //validating email
  let emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (email.value === "" || email.value === null) {
    alert("Email should not be empty!!");
  } else {
    if (!email.value.match(emailRegex)) {
      alert("InValid email address!Format should be anything@anything.com");
    } else {
      emailValue = email.value.toLowerCase();
      console.log(emailValue);
      sendEmail();
    }
  }
}

function sendEmail() {
  let getEmail = emailValue;
  let emailOnly = getEmail.split("@").pop().split(".")[0];
  console.log(emailOnly);

  let checkEmail;

  console.log(getEmail);
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
    Body: "You Have Suceessfully Registered for Aadhaar Card!!Please Login to see your Aadhaar Card",
  }).then(function (message) {
    alert("mail sent successfully");
  });
}

function passwordValidate() {
  //validating password
  let pwd_expression =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;
  if (password.value === "" && confirmPassword.value === "") {
    alert("Password should not be empty!!");
  } else if (!pwd_expression.test(password.value)) {
    alert(
      "Upper case, Lower case, Special character and Numeric letter are required in Password filed"
    );
  } else if (password.value != confirmPassword.value) {
    alert("Password not Matched!!Please Use Same Password");
  } else if (
    confirmPassword.value.length < 4 ||
    confirmPassword.value.length > 12
  ) {
    alert("Password minimum length is 6 and max length is 12");
  }
}
function addressValidate() {
  // - : . / -- valid address
  let addressRegEx = /^[a-zA-Z0-9-:./,\s]+$/; ///^[,#-\/\s\!\@\$]+$/;
  if (address.value === "") {
    alert("Address should not be empty!!");
  } else if (!address.value.match(addressRegEx)) {
    alert("Address should not contain special characters!!");
  }
}
function pincodeValidate() {
  //validating pin code
  let pinCodeRegEx = /^[1-9]{1}[0-9]{2}[0-9]{3}$/;
  if (pinCode.value === "" || pinCode.value === null) {
    alert("Pincode should not be empty!!");
  } else if (!pinCode.value.match(pinCodeRegEx)) {
    alert("Invalid pin code!!Pin code must contain 6 digits");
  } else {
    pinCodeValue = pinCode.value;
    console.log(`Pin code : ${pinCodeValue}`);
    getDataCityState(pinCodeValue);
  }
}
const getDataCityState = async function (pinCodeValue) {
  try {
    const res = await fetch(
      `https://api.postalpincode.in/pincode/${pinCodeValue}`
    );

    //console.log(res);
    const data = await res.json();
    console.log(data);
    let getPostOfficeData = data[0]["PostOffice"];
    for (let e of getPostOfficeData) {
      if (e.BranchType === "Head Post Office") {
        console.log((State = e.State));
        City = e.Name;
        District = e.District;
        break;
      } else {
        if (
          e.BranchType !== "Head Post Office" &&
          e.BranchType === "Sub Post Office"
        ) {
          State = e.State;
          City = e.Name;
          District = e.District;
        }
      }
    }
  } catch {
    console.log("error");
  }
};

//generating aadhaar number
const randomUniqueAadhaarNumber = (range, count) => {
  let nums = new Set();
  while (nums.size < count) {
    nums.add(
      Math.floor(pinCodeValue.slice(2, 5) + Math.random() * (range - 1 + 1) + 1)
    );
  }
  console.log(parseInt([...nums]));
};

/***
 * Upload a Photo
 */
startCamera.addEventListener("click", function () {
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
    console.log(photo.setAttribute("src", data));

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
