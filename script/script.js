document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:5000"; // ✅ BACKEND BASE URL

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

      try {
        const res = await fetch(`${API_BASE}/api/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            email,
            phone,
            password,
            location,
          }),
        });

        const data = await res.json();

        if (res.status === 201) {
          alert("Signup successful! Please login.");
          window.location.href = "login.html";
        } else {
          alert(data.message || "Signup failed");
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
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          window.location.href = "dashboard.html";
        } else {
          alert(data.message || "Login failed");
        }
      } catch (err) {
        console.error(err);
        alert("Server error. Try again later.");
      }
    });
  }

  // ================= PROTECTED PAGES =================
  const protectedPages = [
    "dashboard.html",
    "reports.html",
    "alerts.html",
    "setting.html",
  ];

  const currentPage = window.location.pathname.split("/").pop();

  if (protectedPages.includes(currentPage)) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      window.location.href = "login.html";
      return;
    }

    // ✅ USER NAME UPDATE (ALL DASHBOARD PAGES)
    const userNameElement = document.getElementById("username");
    if (userNameElement) {
      userNameElement.textContent = user.fullName;
    }

    // Logout
    const logoutLink = document.querySelector('nav a[href="./index.html"]');
    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = "index.html";
      });
    }
  }

  // ================= LIVE TIME =================
  function updateTime() {
    const now = new Date();
    const timeEl = document.getElementById("time");
    if (timeEl) timeEl.textContent = now.toLocaleTimeString();
  }
  setInterval(updateTime, 1000);
  updateTime();
});
