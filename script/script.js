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

    // ✅ USER NAME
    const userNameElement = document.getElementById("username");
    if (userNameElement) {
      userNameElement.textContent = user.fullName;
    }

    // ✅ AVATAR LOAD (FIXED)
    const avatarImg = document.getElementById("avatar");
    if (avatarImg) {
      avatarImg.src = user.avatar
        ? `${API_BASE}${user.avatar}`
        : `${API_BASE}/uploads/avatars/default.png`;
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

  // ================= SETTINGS PAGE =================
  if (currentPage === "setting.html") {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // ===== Auto fill profile data =====
    if (user) {
      document.getElementById("profile-name").value = user.fullName || "";
      document.getElementById("profile-email").value = user.email || "";
      document.getElementById("profile-phone").value = user.phone || "";
    }

    // ================= PROFILE IMAGE UPLOAD =================
    const avatarImg = document.getElementById("avatar");
    const avatarInput = document.getElementById("avatarInput");

    if (avatarImg && avatarInput) {
      avatarImg.addEventListener("click", () => avatarInput.click());

      avatarInput.addEventListener("change", async () => {
        const file = avatarInput.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        const res = await fetch(`${API_BASE}/api/user/upload-avatar`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();

        if (res.ok) {
          avatarImg.src = `${API_BASE}${data.avatar}`;

          // 🔥 update localStorage user
          user.avatar = data.avatar;
          localStorage.setItem("user", JSON.stringify(user));

          alert("Profile picture updated");
        } else {
          alert(data.message || "Avatar upload failed");
        }
      });
    }

    // ===== Change Password =====
    const passwordForm = document.getElementById("password-form");
    if (passwordForm) {
      passwordForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const currentPassword =
          document.getElementById("current-password").value;
        const newPassword = document.getElementById("new-password").value;
        const confirmPassword =
          document.getElementById("confirm-password").value;

        if (newPassword !== confirmPassword) {
          alert("New passwords do not match");
          return;
        }

        try {
          const res = await fetch(`${API_BASE}/api/user/change-password`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              currentPassword,
              newPassword,
            }),
          });

          const data = await res.json();

          if (res.ok) {
            alert("Password updated successfully");
            passwordForm.reset();
          } else {
            alert(data.message || "Password update failed");
          }
        } catch (err) {
          console.error(err);
          alert("Server error");
        }
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
