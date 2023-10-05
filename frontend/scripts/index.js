import {
  loginUser,
  registerUser,
  updateProfileVisibility,
  logoutUser,
} from "./auth.js";

const loginForm = document.getElementById("login");
const registerForm = document.getElementById("register");
const logOutBtn = document.getElementById("logout-btn");
const searchInput = document.getElementById("search-btn");
const loginPopUpBtn = document.getElementById("login-btn");
const popUp = document.getElementById("form-section");
const loginBtn = document.getElementById("logBtn");
const registerBtn = document.getElementById("regBtn");
const closePopup = document.getElementById("close-btn");
const blogMain = document.querySelector(".blog-card-section");
const BASEURL = `https://blushing-bedclothes-toad.cyclic.app/`;

// Declare a variable to store a timeout for debounce
let searchTimeout;

// Function to perform a debounced search
function debouncedSearch(query) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fecthBlog(query);
  }, 300); // Adjust the debounce delay as needed
}

searchInput.addEventListener("input", (e) => {
  const query = e.target.value;
  debouncedSearch(query);
});

// Throttle clicks on the "Read More" button
function throttle(fn, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

async function displayBlog(data) {
  try {
    blogMain.innerHTML = "";

    data.forEach((blog) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const blogImage = document.createElement("div");
      blogImage.classList.add("blog-image");
      const img = document.createElement("img");
      img.src = blog.image;
      img.alt = "Blog Image";
      blogImage.appendChild(img);

      const blogDetails = document.createElement("div");
      blogDetails.classList.add("blog-details");
      const h3 = document.createElement("h3");
      h3.textContent = blog.title;
      const p = document.createElement("p");
      p.textContent = blog.content;

      const link = document.createElement("a");
      link.href = `./pages/blog.html?id=${blog._id}`;
      const blogBtn = document.createElement("div");
      blogBtn.classList.add("blog-btn");
      const button = document.createElement("button");
      button.textContent = "Read More";

      const buttonClickHandler = throttle(() => {
        window.location.href = link.href;
      }, 1000); // Adjust the throttle delay as needed

      button.addEventListener("click", buttonClickHandler);

      blogBtn.appendChild(button);
      link.appendChild(blogBtn);
      blogDetails.appendChild(h3);
      blogDetails.appendChild(p);
      blogDetails.appendChild(link);
      card.appendChild(blogImage);
      card.appendChild(blogDetails);
      blogMain.appendChild(card);
    });
  } catch (error) {
    console.error(error);
  }
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = {
    email: loginForm.email.value,
    password: loginForm.password.value,
  };
  await loginUser(formData);
});

document.addEventListener("DOMContentLoaded", async () => {
  updateProfileVisibility();
  await fecthBlog();
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userForm = {
    name: registerForm.name.value,
    email: registerForm.email.value,
    password: registerForm.password.value,
  };
  await registerUser(userForm);
});

logOutBtn.addEventListener("click", async () => {
  const logoutResult = await logoutUser();
  if (logoutResult.success) {
    alert(logoutResult.message);
    window.location.href = "./index.html";
  } else {
    alert(logoutResult.message);
  }
});

async function fecthBlog(query) {
  try {
     const loader = document.getElementById("loader");
     const footer = document.getElementById("footer")
     loader.style.display = "block";
     footer.style.position = "fixed";
     footer.style.bottom = "0";
    const response = await fetch(
      query ? `${BASEURL}blog/search?query=${query}` : `${BASEURL}blog/getblog`,
      {
        method: "GET",
      }
    );

    if (response.ok) {
      const data = await response.json();
      displayBlog(data);
        loader.style.display = "none";
           footer.style.position = "relative";
    } else {
      console.error("Error fetching data:", response.statusText);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Popup login button function
registerBtn.addEventListener("click", () => {
  registerForm.style.left = "22px";
  loginForm.style.left = "-450px";
  loginBtn.style.background = "none";
  loginBtn.style.color = "black";
  loginBtn.style.border = "2px solid black";
  registerBtn.style.background =
    "linear-gradient(90deg,rgba(255,137,53,1)6%,rgba(217.97,152,1)100%";
  registerBtn.style.color = "white";
  registerBtn.style.border = "none";
});
loginBtn.addEventListener("click", () => {
  loginForm.style.left = "22px";
  registerForm.style.left = "500px";
  loginBtn.style.background = "rgb(61, 184, 209)";
  loginBtn.style.color = "white";
  loginBtn.style.border = "none";
  registerBtn.style.background = "none";
  registerBtn.style.color = "black";
  registerBtn.style.border = "2px solid black";
});

// popup login button function

loginPopUpBtn.addEventListener("click", () => {
  popUp.style.top = "50%";
  popUp.style.transform = "translate(-50%, -50%)scale(1)";
  popUp.style.visibility = "visible";
  popUp.style.position = "fixed";
});

closePopup.addEventListener("click", () => {
  popUp.style.visibility = "hidden";
});
