import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBPE6TbZykGf7Kui6fsR6-3W9w6uuzg0ms",
  authDomain: "login-12d02.firebaseapp.com",
  projectId: "login-12d02",
  storageBucket: "login-12d02.appspot.com",
  messagingSenderId: "894912184495",
  appId: "1:894912184495:web:2a6fadb14356c49b24545a",
  measurementId: "G-G9XVZSVL5Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
}

const forgotPasswordForm = document.getElementById("forgotPasswordForm");
forgotPasswordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset email sent. Check your inbox.");
      // Redirect the user to the sign-in page or another page
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error(error.message);
      alert(error.message);
    });
});
