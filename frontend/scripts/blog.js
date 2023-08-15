import {
  loginUser,
  registerUser,
  updateProfileVisibility,
  logoutUser,
} from "./auth.js";

const urlParams = new URLSearchParams(window.location.search);
const BASEURL = `https://erin-jolly-caridea.cyclic.app/`;

const loginForm = document.getElementById("login");
const logOutBtn = document.getElementById("logout-btn");
const registerForm = document.getElementById("register");
const commentSection = document.querySelector(".comment-section");
const commentForm = document.getElementById("comment-form");
const blogId = urlParams.get("id");

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
        Authorization: localStorage.getItem("token"),
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

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = {
    email: loginForm.email.value,
    password: loginForm.password.value,
  };
  await loginUser(formData);
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
    window.location.href = "/frontend/index.html";
  } else {
    alert(logoutResult.message);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  updateProfileVisibility();
  fetchBlog();
});
