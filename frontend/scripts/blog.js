import {
  loginUser,
  registerUser,
  updateProfileVisibility,
  logoutUser,
} from "./auth.js";
const urlParams = new URLSearchParams(window.location.search);
let loginForm = document.getElementById("login");
let logOutBtn = document.getElementById("logout-btn");
let registerForm = document.getElementById("register");
const blogId = urlParams.get("id");
const BASEURL = `http://localhost:8080/`;

async function fetchBlog() {
  try {
    const response = await fetch(`${BASEURL}blog/getblog/${blogId}`);
    if (response.ok) {
      const data = await response.json();
      displayBlog(data);
    } else {
      console.error(`Error fetching blog with ID ${blogId}`);
    }
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchBlog();
});

const commentSection = document.querySelector(".comment-section");

function displayBlog(blog) {
  const blogTitle = document.querySelector(".blog-title h1");
  const blogImage = document.querySelector(".blog-data-image img");
  const blogContent = document.querySelector(".attractive-text");

  blogTitle.textContent = blog.title;
  blogImage.src = blog.image;
  blogContent.textContent = blog.content;

  commentSection.innerHTML = "";

  blog.comments.forEach((comment) => {
    const commentCard = document.createElement("div");
    commentCard.classList.add("comment-card");
    commentCard.innerHTML = `
      <h3>${comment.name}</h3>
      <p>${comment.comment}</p>
    `;
    commentSection.appendChild(commentCard);
  });
}

const commentForm = document.getElementById("comment-form");

commentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const commentText = document.getElementById("comment-text");
  if (!localStorage.getItem("token")) {
    alert("Please login first to post a comment.");
    return;
  }

  const data = {
    comment: commentText.value,
  };

  try {
    const response = await fetch(`${BASEURL}blog/${blogId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log("Comment posted successfully");
      commentText.value = "";
      fetchBlog();
    } else {
      console.error("Failed to post comment");
    }
  } catch (error) {
    console.error("Error posting comment:", error);
  }
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let formData = {
    email: loginForm.email.value,
    password: loginForm.password.value,
  };
  loginUser(formData);
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
   window.location.href = "/frontend/index.html";

  } else {
    alert(logoutResult.message);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  updateProfileVisibility();
});
