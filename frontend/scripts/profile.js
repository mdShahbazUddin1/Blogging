import {
  loginUser,
  registerUser,
  updateProfileVisibility,
  logoutUser,
} from "./auth.js";
let loginForm = document.getElementById("login");
let logOutBtn = document.getElementById("logout-btn");
let registerForm = document.getElementById("register");
let searchInput = document.getElementById("search-btn");
let blogMain = document.querySelector(".blog-card-section");
let creatorText = document.getElementById("creator-text");
let editBtnUser = document.getElementById("edit-btn");
let createBtn = document.getElementById("create-btn");
let creatBlog = document.getElementById("create-blog-form");
let editBlog = document.getElementById("create-blog-form2");

let BASEURL = `https://blushing-bedclothes-toad.cyclic.app/`;

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

async function getCreatorBlog(query) {
  try {
    let response;
     const loader = document.getElementById("loader");
     loader.style.display = "block";
    if (query) {
      response = await fetch(`${BASEURL}blog/search?query=${query}`, {
        method: "GET",
      });
    } else {
      response = await fetch(`${BASEURL}blog/getcreatorblog`, {
        method: "GET",
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 400) {
        creatorText.innerText = "No blog ! Please create blog ";
      } else {
        creatorText.innerText = "Blog created by you";
      }
    }

    const data = await response.json();
    displayBlog(data);
       loader.style.display = "none";
  } catch (error) {
    console.log(error);
  }
}

searchInput.addEventListener("input", (e) => {
  const query = e.target.value;
  getCreatorBlog(query);
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

      const link = document.createElement("a");
      link.href = `../pages/blog.html?id=${blog._id}`;
      const blogBtn = document.createElement("div");
      blogBtn.classList.add("blog-btn");
      const readMoreBtn = document.createElement("button");
      readMoreBtn.textContent = "Read More";
      const editDeleteBtns = document.createElement("div");
      editDeleteBtns.classList.add("edit-delete-btns");
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.classList.add("edit-button");
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-button");

      // Event listener for the "Edit" button
      editBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Scroll the page to the top
        window.scrollTo({ top: 0, behavior: "smooth" });

        creatBlog.style.display = "none";
        editBlog.style.display = "block";
        editBtnUser.style.display = "block";
        editBtnUser.style.backgroundColor = "#42A5F5";
        createBtn.style.backgroundColor = "transparent";

        // Event listener for the edit form submission
        editBlog.addEventListener("submit", async (e) => {
          e.preventDefault();

          const formData = new FormData();
          formData.append("title", editBlog.title2.value);
          formData.append("image", editBlog.image2.files[0]);
          formData.append("content", editBlog.content2.value);

          try {
            const response = await fetch(
              `${BASEURL}blog/updateblog/${blog._id}`,
              {
                method: "PUT",
                headers: {
                  Authorization: `${localStorage.getItem("token")}`,
                },
                body: formData,
              }
            );

            if (response.ok) {
              const data = await response.json();
              alert("Blog updated");
              editBlog.title2.value = "";
              editBlog.image2.value = "";
              editBlog.content2.value = "";
              editBlog.style.display = "none";
              editBtnUser.style.display = "none";
              creatBlog.style.display = "block";
              getCreatorBlog();
            } else {
              console.error("Error updating blog");
            }
          } catch (error) {
            console.error("Error updating blog:", error);
          }
        });
      });

      // Event listener for the "Delete" button
      deleteBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Scroll the page to the top
        window.scrollTo({ top: 0, behavior: "smooth" });

        const response = await fetch(`${BASEURL}blog/deleteblog/${blog._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          alert("Blog deleted");
          getCreatorBlog();
        }
      });

      // Append buttons to the editDeleteBtns container
      editDeleteBtns.appendChild(editBtn);
      editDeleteBtns.appendChild(deleteBtn);

      // Append buttons and container to the blogBtn
      blogBtn.appendChild(readMoreBtn);
      blogBtn.appendChild(editDeleteBtns);

      // Append the container to the link (NOT the button)
      link.appendChild(blogBtn);

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


creatBlog.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", creatBlog.title.value);
  formData.append("image", creatBlog.image.files[0]);
  formData.append("content", creatBlog.content.value);

  try {
    const response = await fetch(`${BASEURL}blog/addpost`, {
      method: "POST",
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      alert("New blog added");
      creatBlog.title.value = "";
      creatBlog.image.value = "";
      creatBlog.content.value = "";
      getCreatorBlog();
    } else {
      console.error("Error creating blog");
    }
  } catch (error) {
    console.error("Error creating blog:", error);
  }
});

createBtn.addEventListener("click", () => {
  creatBlog.style.display = "block";
  editBlog.style.display = "none";
  editBtnUser.style.display = "none";
  createBtn.style.backgroundColor = "#1E88E5";
});

document.addEventListener("DOMContentLoaded", () => {
  updateProfileVisibility();
  getCreatorBlog();
});
