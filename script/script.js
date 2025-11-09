const passwordImg = document.getElementById("password-img");

passwordImg.addEventListener("click", changePasswordState);

function changePasswordState() {
  var originalImg = passwordImg.src;
  const passwordInputField = document.getElementById("password");
  if (originalImg.indexOf("eye-off.png") != -1) {
    passwordImg.setAttribute("src", "./images/eye-on.png");
    passwordInputField.setAttribute("type", "text");
  } else {
    passwordImg.setAttribute("src", "./images/eye-off.png");
    passwordInputField.setAttribute("type", "password");
  }
}
