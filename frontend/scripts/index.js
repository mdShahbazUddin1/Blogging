import { loginUser, registerUser, updateProfileVisibility,logoutUser } from "./auth.js";

let loginForm = document.getElementById("login");
let registerForm = document.getElementById("register");
let logOutBtn = document.getElementById("logout-btn")
let searchInput = document.getElementById("search-btn")
let loginPopUpBtn = document.getElementById("login-btn");
let popUp = document.getElementById("form-section");


let loginBtn = document.getElementById("logBtn");
let registerBtn = document.getElementById("regBtn");

let closePopup = document.getElementById("close-btn");

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

let blogMain = document.querySelector(".blog-card-section");


let BASEURL = `http://localhost:8080/`;

async function fecthBlog(query) {
  try {
    let response;
    if (query) {
      response = await fetch(`${BASEURL}blog/search?query=${query}`, {
        method: "GET",
      });
    } else {
      response = await fetch(`${BASEURL}blog/getblog`, {
        method: "GET",
      });
    }

    if (response.ok) {
      let data = await response.json();
      displayBlog(data);
    } else {
      console.error("Error fetching data:", response.statusText);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}



searchInput.addEventListener("input", (e) => {
  const query = e.target.value;
  fecthBlog(query);
});





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

      // Create a link to the blog.html page with blog ID as a query parameter
      const link = document.createElement("a");
      link.href = `./pages/blog.html?id=${blog._id}`;
      const blogBtn = document.createElement("div");
      blogBtn.classList.add("blog-btn");
      const button = document.createElement("button");
      button.textContent = "Read More";
      blogBtn.appendChild(button);
      link.appendChild(blogBtn); // Append the button to the link

      blogDetails.appendChild(h3);
      blogDetails.appendChild(p);
      blogDetails.appendChild(link); // Append the link to the blog details

      card.appendChild(blogImage);
      card.appendChild(blogDetails);

      blogMain.appendChild(card);
    });
  } catch (error) {
    console.error(error);
  }
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let formData = {
    email: loginForm.email.value,
    password: loginForm.password.value,
  };
  loginUser(formData);
});



document.addEventListener("DOMContentLoaded", () => {
  updateProfileVisibility();
  fecthBlog();
});

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let userForm = {
    name: registerForm.name.value,
    email: registerForm.emai.value,
    password: registerForm.pas.value,
  };
  registerUser(userForm);
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


