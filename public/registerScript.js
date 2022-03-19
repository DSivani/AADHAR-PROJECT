"use strict";

//Registration Form
/** DOM Elements */
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
const photoMessage = document.querySelector(".photoMsg");

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

/**
 * To open success message modal when user clicks on register
 *
 */
function openModal() {
  registerSuccessModal.classList.remove("hidden");
  registerSuccessOverlay.classList.remove("hidden"); // to add blur
}
/**
 * To close success message modal when user clicks on close button
 *
 */
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

let width = 320; // We will scale the photo width to this
let height = 0; // This will be computed based on the input stream
let streaming = false;

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
  clicked,
  userPhotoPath,
  addressValue,
  pinCodeValue,
  stateValue,
  cityValue,
  districtValue,
  cityParentValue,
  stateParentValue,
  districtParentValue,
  userAadhaarNumber;

/**  Saving Data To SQL using asynchronous function  */

const saveDataToSQL = async (
  fullNameValue,
  genderValue,
  userDOB,
  userAge,
  phoneNumberValue,
  emailValue,
  passwordValue,
  userPhotoPath,
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
      Picture: userPhotoPath,
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

// Regular Expressions for Input Name and Email Field
let fullNameRegEx = /^[A-Za-z_ ]+$/;
let emailRegex =
  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

/**
 * Click event for rgistration buttion
 * @param {EventListener} "click"
 * @param {Function} "registration"
 */
registerBtn.addEventListener("click", registration.bind(this));
/**
 * Click event for clear buttion
 * @param {EventListener} "click"
 * @param {Function} "clear"
 */
clearBtn.addEventListener("click", clear);

/**
 * validates all input fields and then sends data to sql
 * @param {Event} "ev - To prevent form default behaviour"
 * @returns {any}
 */
function registration(ev) {
  ev.preventDefault();
  /**functions to validate input fields */
  nameValidate();
  genderValidate();
  phoneNumberValidate();
  emailValidate();
  passwordValidate();
  /** checks whether DOB and Photo field is selected or not */
  if (!dob.value || !clicked) {
    swal("Please select your DOB or upload photo");
  } else {
    /** If user age is less than 18 then validate parent details  */
    if (userAge < 18) {
      /** Functions to validate parent details */
      validateRelationGender();
      validateRelationName();
      validateRelationAadhaarNumber();
      /** Gets Parents details from database */
      getParentAadhaarNumber(userRelationAadhaarNumber, userRelationName);
      /** calling validatestatus function */
      validateStatus();
    } else if (userAge > 18) {
      /** If user age is greater than 18 then validates user address an pincode */
      addressValidate();
      pincodeValidate();
      address.readOnly = false;
      pinCode.readOnly = false;
      validateStatus();
    }
  }
}

/**
 * Name Validate function
 * @returns {string} "username"
 */
function nameValidate() {
  message[0].classList.remove("hidden");

  /** checks all validations for name field */
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
/**
 * Gender Validate function
 * @returns {string} " returns userGender"
 */
function genderValidate() {
  //getting selected gender value and validating gender field
  message[1].classList.remove("hidden");
  /** checks wheather gender selected or not */
  for (const ele of gender) {
    if (ele.checked) {
      message[1].classList.add("hidden");
      genderValue = ele.value;
      genderCheckStatus = true;
      break;
    } else if (!ele.checked) {
      message[1].innerHTML = "Please Choose your Gender!";
      genderCheckStatus = false;
    }
  }
}

/**
 * Date of Birth Validation.If user clicks on calender widget then age will be calculated.
 * If age is less than 18 then user need to fill his parent details.Otherwise we will hide parent details.
 * @param {EventListener} "change"
 * @param {Function} "checks all validations for DOB"
 * @returns {String} "user dob and age"
 */
dob.addEventListener("change", function () {
  let now = new Date();
  userDOB = dob.value;
  dateOfBirth = new Date(userDOB);
  /** checks the dob is less than current date */
  message[2].classList.remove("hidden");
  /** If user selects DOB less than today */
  if (dateOfBirth < now) {
    let userYear = dateOfBirth.getFullYear();

    let currentYear = now.getFullYear();
    /** Calculation user age */
    userAge = currentYear - userYear;

    /** If user age less than 18 then user need to enter his parent details */
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
    /** Throws error if user selects date future date */
    message[2].innerHTML = "Invalid date!!Please select date upto today";
    dob.value = "";
    hideUserRelationDetails();
  }
});

/** Hide user relation details for age greater than 18 */
function hideUserRelationDetails() {
  relationDetails.forEach((ele) => {
    ele.classList.add("hidden");
  });
}

/**
 * validate relation gender for age less than 18
 * @returns {String} "user-relation-gender"
 */
function validateRelationGender() {
  message[6].classList.remove("hidden");
  /** checks wheather gender selected or not */
  for (const ele of relationGender) {
    if (ele.checked) {
      message[6].classList.add("hidden");
      userRelationGender = ele.value;
      genderCheckStatus = true;
      break;
    } else if (!ele.checked) {
      message[6].innerHTML = "Please Choose your Gender!";
      genderCheckStatus = false;
    }
  }
}
/**
 * validate relation name for age less than 18
 * @returns {String} "user-relation-name"
 */
function validateRelationName() {
  message[7].classList.remove("hidden");
  /** validate user relation name field */
  if (relationName.value === "") {
    message[7].innerHTML = "Name should not be empty";
    checkStatus = false;
  } else if (!relationName.value.match(fullNameRegEx)) {
    message[7].innerHTML = "Name field required only alphabet characters";
    checkStatus = false;
  } else {
    message[7].classList.add("hidden");
    userRelationName = relationName.value;
  }
}

/**
 * validate relation Aadhaar number for age less than 18
 * @returns {String} "user-relation-aadhaarnumber"
 */
function validateRelationAadhaarNumber() {
  /** Regular expression checks whether number contains 12 digits of 0 to 9 */
  let relationAadhaarNumRegEx = /^[0-9]{12}$/;
  message[8].classList.remove("hidden");
  /**validate user relation aadhaar number */
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
  }
}

/**
 * Gets relation aadhaar number and name from database for user age less than 18.
 * @param {number} parentAadhaarNumber
 * @param {string} parentName
 */
const getParentAadhaarNumber = async (parentAadhaarNumber, parentName) => {
  try {
    // Get information about the user parent aadhaar number using unique aadhaar number and relation name
    if (relationName.value && relationAadhaarNumber.value) {
      const req = await fetch(
        `http://localhost:5000/register/${parentAadhaarNumber}/${parentName}`
      );

      const res = await req.json();
      /** Throws error if data is not present in database */
      if (res.length === 0) {
        swal(
          "No data found with that aadhaar number/relation name. Please check Your details once!!"
        );
      } else {
        let getUserParentData = res[0];
        /** if user relation age is greater than 18 then address,pincode,state,city,district data will be autopopulated from the databse */
        if (getUserParentData.Age >= 18) {
          /** Assigning address,pincode,state,city,district data to html elements and makes as readable only */
          address.value = getUserParentData.Address;
          pinCode.value = getUserParentData.Pincode;
          State.value = getUserParentData.State;
          City.value = getUserParentData.City;
          District.value = getUserParentData.District;
          /** makes readable */
          address.readOnly = true;
          pinCode.readOnly = true;
          State.readOnly = true;
          City.readOnly = true;
          District.readOnly = true;
          /** assigns to DOM Element */
          addressValue = address.value;
          pinCodeValue = pinCode.value;
          stateValue = State.value;
          cityValue = City.value;
          districtValue = District.value;
        } else {
          /**Throws error if user enetered parent data not matched with database */
          swal("Please check your parent details!!");
          checkStatus = false;
        }
      }
    }
  } catch {
    console.log("error");
  }
};

/**
 * Phone Number Validate Function
 * @returns {number} "phonenumber"
 */
function phoneNumberValidate() {
  /** Regular expression checks number contains only 0-9 digits */
  let numbers = /^[0-9]+$/;
  message[3].classList.remove("hidden");
  /** validating phone number */
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
  }
}

/**
 * Email Validate Function
 * @returns {String} "Email"
 */
function emailValidate() {
  message[4].classList.remove("hidden");
  /** validate email */
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
    }
  }
}

/** Sends Email if Registration was Successful */
function sendEmail() {
  let getEmail = emailValue;
  let emailOnly = getEmail.split("@").pop().split(".")[0];

  let checkEmail;

  /** checks what type of mail */
  if (emailOnly === "gmail") {
    checkEmail = ".gmail";
  } else if (emailOnly === "yahoo") {
    checkEmail = ".mail.yahoo";
  } else if (emailOnly === "outlook") {
    checkEmail = "-mail.outlook";
  } else if (emailOnly === "live") {
    checkEmail = ".live";
  }

  /** sends mail  */
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
    <a href="http://localhost:5000" class="email-body-login-link">Login</a>!!</p>
    <p class="email-footer">Thank You,<br></br>Aadhaar Team.</p>
    </div></html>`,
  }).then(function (message) {
    console.log("Mail sent successfully!!");
    //message[4].innerHTML = "mail sent successfully";
  });
}

/**
 * Password Validate Function
 * @returns {string} "userpassword"
 */
function passwordValidate() {
  let pwd_expression =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;
  message[5].classList.remove("hidden");
  /** validating password */
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

/**
 * Address Validate Function
 * @returns {string} "address"
 */
function addressValidate() {
  let addressRegEx = /^[a-zA-Z0-9-:./,\s]+$/;
  message[9].classList.remove("hidden");
  /** Validate address filed */
  if (address.value.trim() === "") {
    message[9].innerHTML = "Address should not be empty!!";
    checkStatus = false;
  } else if (!address.value.match(addressRegEx)) {
    message[9].innerHTML = "Address should not contain special characters!!";
    checkStatus = false;
  } else {
    message[9].classList.add("hidden");
    addressValue = address.value.trimEnd().trimStart();
  }
}

/**
 * Pincode Validate Function
 * @returns {number} "userpincode"
 */
function pincodeValidate() {
  let pinCodeRegEx = /^[1-9]{1}[0-9]{2}[0-9]{3}$/;
  message[10].classList.remove("hidden");
  /** validating pin code */
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
    getDataCityState(pinCodeValue);
  }
}

/** gets states,city,district using pincode from postal api using asynchronous function */
const getDataCityState = async function (pinCodeValue) {
  try {
    /** fetch api by pincode */
    const res = await fetch(
      `https://api.postalpincode.in/pincode/${pinCodeValue}`
    );
    const data = await res.json();
    let getPostOfficeData = data[0]["PostOffice"];
    /** assigns state,city,district based on branch type */
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
/** Assigning state,city,district values to input fields and makes readable only */
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

/**
 * Checks for multiple users  registration from database using email.
 * If user register with same email then throws an error
 * @param {string} "getUserEmail"
 */
const getUserNameAndAddress = async (getUserEmail) => {
  try {
    // Get information about the user email from database
    /** fetch users details based on user email id */
    const req = await fetch(`http://localhost:5000/register/${getUserEmail}`);

    const res = await req.json();
    /** If there is no user with that email then random number will generates and data will send to sql */
    if (res.length === 0) {
      randomUniqueAadhaarNumber(999999999, 1);
      sendDataToSQL();
    } else {
      /** If user register with same email then throws an error */
      swal("You have already registered!!");
      clear();
    }
  } catch {
    console.log("error");
  }
};
/** checks status before sending data to sql whether user fill all input fields correctly or not */
function validateStatus() {
  if (checkStatus === false || genderCheckStatus === false) {
    swal("Please enter fields correctly!!");
    checkStatus = true;
  } else {
    getUserNameAndAddress(emailValue);
  }
}

/**
 * Generates Unique  12 aadhaar number from the combination first 3 digits of pincode and 9 digits of unique random number
 * @param {number} "range-9digits"
 * @param {number} "count-1"
 */
const randomUniqueAadhaarNumber = (range, count) => {
  let nums = new Set();
  while (nums.size < count) {
    /**generate 12 digit unique nnumber */
    nums.add(
      pinCodeValue.slice(0, 3) + Math.floor(Math.random() * (range - 1 + 1) + 1)
    );
  }
  userAadhaarNumber = parseInt([...nums]);
  // console.log(userAadhaarNumber);
};

/**
 * upload a photo using web api
 * @param {EventListener} "click"
 * @param {Event} "To stop default form behaviour"
 */
startCamera.addEventListener("click", function (ev) {
  ev.preventDefault();
  // clicked = true;
  /** start camera function */
  startCam();
  /** To stop camera function */
  stopCamera.addEventListener("click", function (eve) {
    eve.preventDefault();
    stopCam();
  });
  /** To take and save the user hoto */
  takePhoto.onclick = (e) => {
    e.preventDefault();
    clicked = true;
    takeASnap().then(download);
  };
  /** clear photo fuction */
  clearPhoto();
});

/** To start the web camera */
function startCam() {
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
/** To capture user photo from webcam */
function takeASnap() {
  let context = canvas.getContext("2d");
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    return new Promise((res, rej) => {
      canvas.toBlob(res, "image/jpeg"); // request a Blob from the canvas
    });
  }
}
/** To download the capture image and save to database */
function download(blob) {
  // uses the <a download> to download a Blob
  if (email.value && email.value.match(emailRegex)) {
    let a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    /** To save  and download image with email name */
    let saveImageNameAs = email.value.split("@")[0];

    a.download = `${saveImageNameAs}.jpg`;

    /** Downloaded image path */
    userPhotoPath = `userPhotos/${a.download}`;
    // console.log(userPhotoPath);

    document.body.appendChild(a);

    stopCam();

    a.click();
    startCamera.style.display = "none";
    video.style.display = "none";
    takePhoto.style.display = "none";
    photo.style.display = "none";
    photoMessage.innerHTML =
      "Your Photo has been successfully downloaded  and saved to database";

    // clearPhoto();
  } else {
    swal("Please enter your valid email id!!");
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
      userPhotoPath,
      addressValue,
      pinCodeValue,
      stateValue,
      cityValue,
      districtValue,
      userAadhaarNumber
    );
    openModal();
    close_modal.addEventListener("click", function () {
      sendEmail();
      closeModal();
    });
  }, 10000);
}

/** clear Register Form */
function clear() {
  registerForm.reset();
  /**clear the user photo */
  photoMessage.innerHTML = "";
  clearPhoto();
  startCamera.style.display = "block";
  photo.style.display = "none";
  video.style.display = "none";
  takePhoto.style.display = "none";
  stopCam();
  stopCamera.style.display = "none";
}
