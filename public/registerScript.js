"use strict";

//Registration Form
const registerBtn = document.querySelector("#Register-form-submit");
const clearBtn = document.querySelector("#Register-form-clear-submit");
const firstName = document.querySelector(".register-firstname");
const lastName = document.querySelector(".register-lastname");
const gender = document.getElementsByName("gender");
const genderField = document.querySelector(".register-gender");
const dob = document.querySelector("#dob");
const pinCode = document.querySelector(".register-pincode");
const phoneNumber = document.querySelector(".register-phone-number");
const email = document.querySelector("#email");
const password = document.querySelector(".register-password");
const confirmPassword = document.querySelector(".register-confirmpassword");
const relationName = document.querySelector(".register-relation-name");
const relation = document.getElementsByName("relation");
const relationDetails = document.querySelectorAll(".relation-details");
const address = document.querySelector(".register-address");
const relationAadhaarNumber = document.querySelector(
  ".register-relation-aadhaarno"
);
const registerForm = document.querySelector(".register");
const pic = document.querySelector("#photo");

const message = document.querySelectorAll(".msg");

/** state city pincode */
let District, State, City;
State = document.querySelector(".register-state");
City = document.querySelector(".register-city");
District = document.querySelector(".register-district");

/** Register success message modal */
const successModal = document.querySelector(".register-modal");
const hidden = document.querySelectorAll(".hidden");
const registerOverlay = document.querySelector(".overlay");
const close_modal = document.querySelector(".close-modal");
const registerMessage = document.querySelector(".register-success-message");

function openModal() {
  successModal.classList.remove("hidden");
  registerOverlay.classList.remove("hidden"); // to add blur
}
//for close button
function closeModal() {
  successModal.classList.add("hidden");
  registerOverlay.classList.add("hidden");
}

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

  //clear form values
  clear();
};

/** Declaring Global Variables */
let checkStatus = true;
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

/** Calling all the valaidations */
function registration(ev) {
  ev.preventDefault();
  nameValidate();
  getSelectedGenderValue();
  phoneNumberValidate();
  emailValidate();
  passwordValidate();
  addressValidate();
  if (
    !firstName.value ||
    !lastName.value ||
    !genderField.value ||
    !dob.value ||
    !phoneNumber.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value ||
    !address.value
    // !pinCode.value
  ) {
    alert("Please fill all the input fields!!");
  } else {
    if (userAge < 18) {
      validateRelationGender();
      validateRelationName();
      validateRelationAadhaarNumber();
      getParentAadhaarNumber(userRelationAadhaarNumber, userRelationName);
      // if (relationName.value && relationAadhaarNumber.value) {
      //getUserNameAndAddress(fullNameValue, phoneNumberValue);
      if (checkStatus === false) {
        alert("please enter all fields correctly!!");
      } else {
        getUserNameAndAddress(emailValue);
        // randomUniqueAadhaarNumber(999999999999, 1);
        // sendDataToSQL();
        checkStatus = true;
      }
      // } else {
      //   alert("Please fill all the input fields!!");
      // }
    } else if (userAge > 18) {
      //console.log("age>18");
      pincodeValidate();
      //console.log("aftervalidatepin");
      address.readOnly = false;
      pinCode.readOnly = false;
      if (checkStatus === false) {
        alert("please enter all fields correctly!!");
      } else {
        getUserNameAndAddress(emailValue);
        // randomUniqueAadhaarNumber(999999999999, 1);
        // sendDataToSQL();
        checkStatus = true;
      }
    }
  }
}

/** Name Validate function */
function nameValidate() {
  //validating name field
  message[0].classList.remove("hidden");

  if (firstName.value === "" && lastName.value === "") {
    message[0].innerHTML = "Name should not be empty";
    checkStatus = false;
  } else if (
    !(
      firstName.value.match(fullNameRegEx) &&
      lastName.value.match(fullNameRegEx)
    )
  ) {
    message[0].innerHTML = "Name field required only alphabet characters";
    checkStatus = false;
  } else if (firstName.value === lastName.value) {
    message[0].innerHTML = "First and Last Names should be different";
    checkStatus = false;
  } else {
    message[0].classList.add("hidden");

    fullNameValue = firstName.value + " " + lastName.value;
    checkStatus = true;
    //console.log(fullNameValue);
  }
}

/** Gender Validate Function */
function getSelectedGenderValue() {
  //getting selected gender value
  message[1].classList.remove("hidden");
  gender.forEach((ele) => {
    if (ele.checked === false) {
      message[1].innerHTML = "Please Choose your Gender!";
      checkStatus = false;
      // return false;
    } else if (ele.checked) {
      message[1].classList.add("hidden");
      genderValue = ele.value;
      checkStatus = true;
      // console.log(`Gender : ${ele.value}`);
    }
  });
}
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
    checkStatus = true;
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
      checkStatus = true;
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
    Body: "You Have Suceessfully Registered for Aadhaar Card!!Please Login to check your Aadhaar Card",
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
    message[5].innerHTML = "Password should not be empty!!";
    checkStatus = false;
  } else if (!pwd_expression.test(password.value)) {
    message[5].innerHTML =
      "Upper case, Lower case, Special character and Numeric letter are required in Password filed";
    checkStatus = false;
  } else if (password.value != confirmPassword.value) {
    message[5].innerHTML = "Password not Matched!!Please Use Same Password";
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
    checkStatus = true;
  }
}

/** Address Validate Function */
function addressValidate() {
  let addressRegEx = /^[a-zA-Z0-9-:./,\s]+$/;
  message[10].classList.remove("hidden");
  //console.log(address.value);
  if (address.value.trim() === "") {
    message[10].innerHTML = "Address should not be empty!!";
    checkStatus = false;
  } else if (!address.value.match(addressRegEx)) {
    message[10].innerHTML = "Address should not contain special characters!!";
    checkStatus = false;
  } else {
    message[10].classList.add("hidden");

    addressValue = address.value.trimEnd().trimStart();
    checkStatus = true;
    //console.log(addressValue);
  }
}

dob.addEventListener("change", function () {
  //console.log("clickdob");
  let now = new Date();
  userDOB = dob.value;
  console.log(userDOB);
  dateOfBirth = new Date(userDOB);
  //console.log(dateOfBirth);
  /** checks the dob is less than current date */
  //message[2].classList.remove("hidden");
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
    //message[2].classList.add("hidden");
  } else {
    alert("Invalid Date!!Please select date upto today");
    dob.value = "";
    hideUserRelationDetails();
  }
});

function validateRelationGender() {
  message[7].classList.remove("hidden");
  relation.forEach((ele) => {
    if (ele.checked === false) {
      message[7].innerHTML = "Please Choose your relation!";
      checkStatus = false;
    } else if (ele.checked) {
      message[7].classList.add("hidden");

      console.log(`relation : ${ele.value}`);
      userRelationGender = ele.value;
      checkStatus = true;
    }
  });
}
function validateRelationName() {
  message[8].classList.remove("hidden");
  if (relationName.value === "") {
    message[8].innerHTML = "Name should not be empty";
    checkStatus = false;
  } else if (!relationName.value.match(fullNameRegEx)) {
    message[8].innerHTML = "Name field required only alphabet characters";
    checkStatus = false;
  } else {
    message[8].classList.add("hidden");

    userRelationName = relationName.value;
    checkStatus = true;
    console.log(userRelationName);
  }
}
function validateRelationAadhaarNumber() {
  let relationAadhaarNumRegEx = /^[0-9]{12}$/;
  message[9].classList.remove("hidden");
  if (
    relationAadhaarNumber.value === "" ||
    relationAadhaarNumber.value === null
  ) {
    message[9].innerHTML = "relationAadhaarNumber should not be empty!!";
    checkStatus = false;
  } else if (!relationAadhaarNumber.value.match(relationAadhaarNumRegEx)) {
    message[9].innerHTML = "Invalid Aadhaar Number!!Must contain 12 digits";
    checkStatus = false;
  } else {
    message[9].classList.add("hidden");

    userRelationAadhaarNumber = relationAadhaarNumber.value;
    checkStatus = true;
    console.log(`relationAadhaarNumber value : ${userRelationAadhaarNumber}`);
  }
}

function hideUserRelationDetails() {
  relationDetails.forEach((ele) => {
    ele.classList.add("hidden");
  });
}

// gets parent aadhaar
const getParentAadhaarNumber = async (parentAadhaarNumber, parentName) => {
  console.log("getparentaadhaar");
  console.log(parentAadhaarNumber, parentName);
  try {
    // Get information about the user parent aadhaar number using unique aadhaar number and relation name
    console.log("try");
    if (!relationName.value || !relationAadhaarNumber.value) {
      alert("Please fill all the fields");
    } else {
      const req = await fetch(
        `http://localhost:4500/register/${parentAadhaarNumber}/${parentName}`
      );

      const res = await req.json();
      console.log(res);
      if (res.length === 0) {
        alert(
          "No Data Found with that Aaddhar number/Relation Name. Please check Your Details Once!!"
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

/** Pincode Validate Function */
function pincodeValidate() {
  //validating pin code
  //console.log("pin");
  //alert("pin");
  let pinCodeRegEx = /^[1-9]{1}[0-9]{2}[0-9]{3}$/;
  message[11].classList.remove("hidden");
  if (pinCode.value === "" || pinCode.value === null) {
    //alert("empty");
    message[11].innerHTML = "Pincode should not be empty2!!";
    checkStatus = false;
  } else if (!pinCode.value.match(pinCodeRegEx)) {
    message[11].innerHTML = "Invalid pin code!!Pin code must contain 6 digits";
    checkStatus = false;
  } else {
    message[11].classList.add("hidden");

    pinCodeValue = pinCode.value;
    //checkStatus = true;
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

/**  for multiple users */
const getUserNameAndAddress = async (getUserEmail) => {
  //console.log("getUserNameAndAddress");
  //console.log(userName);
  try {
    // Get information about the user name and address
    const req = await fetch(`http://localhost:4500/register/${getUserEmail}`);

    const res = await req.json();
    console.log(res);
    if (res.length === 0) {
      console.log("res len ==0");
      randomUniqueAadhaarNumber(999999999, 1);
      sendDataToSQL();
    } else {
      alert("You have Already Register!!");
    }
  } catch {
    console.log("error");
  }
};

/** Generates Unique  aadhaar number */
const randomUniqueAadhaarNumber = (range, count) => {
  let nums = new Set();
  while (nums.size < count) {
    nums.add(
      Math.floor(pinCodeValue.slice(2, 5) + Math.random() * (range - 1 + 1) + 1)
    );
  }
  userAadhaarNumber = parseInt([...nums]);
  console.log(userAadhaarNumber);
  //sendDataToSQL();
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
    alert("You Have Successfully registered!!");
    sendEmail();
  }, 10000);
}

/** clear Register Form */

function clear() {
  registerForm.reset();
}
