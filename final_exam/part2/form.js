// Validation for password pattern
document.getElementById("passwordForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const message = document.getElementById("message");

  const validPattern = /^(?=(?:.*[A-Z]){2})(?=.*[!@#$%^&*]).{9,}$/;

  if (!validPattern.test(newPassword)) {
    message.textContent = "Password must have at least 9 chars, 2 uppercase letters, and 1 special symbol.";
    message.style.color = "red";
  } else if (newPassword !== confirmPassword) {
    message.textContent = "Passwords do not match.";
    message.style.color = "red";
  } else {
    message.textContent = "Password successfully changed!";
    message.style.color = "green";
  }
});

// Toggle visibility for each password field
function togglePassword(id, icon) {
  const input = document.getElementById(id);
  if (input.type === "password") {
    input.type = "text";
    icon.src = "../asset/images/eye-open.png";
  } else {
    input.type = "password";
    icon.src = "../asset/images/eye-close.png";
  }
}
