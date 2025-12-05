document.addEventListener("DOMContentLoaded", () => {
  // ================= PASSWORD TOGGLE =================
  const passwordImg = document.getElementById("password-img");
  if (passwordImg) {
    passwordImg.addEventListener("click", () => {
      const passwordInputField = document.getElementById("password");
      if (passwordInputField.type === "password") {
        passwordInputField.type = "text";
        passwordImg.src = "./images/eye-on.png";
      } else {
        passwordInputField.type = "password";
        passwordImg.src = "./images/eye-off.png";
      }
    });
  }

  // ================= SIGNUP =================
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fullName = document.getElementById("full-name").value.trim();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const phone = document.getElementById("phone").value.trim();
      const password = document.getElementById("password").value.trim();
      const location = document.getElementById("location").value;

      const data = { fullName, email, phone, password, location };

      try {
        const res = await fetch("http://localhost:5000/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (res.status === 201) {
          alert("Signup successful! Please login.");
          window.location.href = "login.html";
        } else {
          alert(result.message);
        }
      } catch (err) {
        console.error(err);
        alert("Server error. Try again later.");
      }
    });
  }

  // ================= LOGIN =================
  const loginForm = document.querySelector(".login-form form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        alert("Please fill all fields");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          // Save JWT token + user info
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          alert("Login successful!");
          window.location.href = "dashboard.html"; // redirect
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error(err);
        alert("Server error. Try again later.");
      }
    });
  }

  // ================= DASHBOARD USER NAME & LOGOUT =================
  if (window.location.pathname.includes("dashboard.html")) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first!");
      window.location.href = "login.html";
    } else {
      // Update user name in top bar
      const userNameElement = document.querySelector(
        "header h1.text-xl.font-bold.text-gray-900"
      );
      if (userNameElement) {
        userNameElement.textContent = user.fullName;
      }

      // Logout
      const logoutLink = document.querySelector('nav a[href="./index.html"]');
      if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "login.html";
        });
      }
    }
  }
});
