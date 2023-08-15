const BASEURL = "https://erin-jolly-caridea.cyclic.app/";
let popUp = document.getElementById("form-section");

// Function to update the visibility of the profile link
function updateProfileVisibility() {
  const profileLink = document.getElementById("profile");
  const token = localStorage.getItem("token");
  const loginBtn = document.getElementById("login-btn");
  const loginOut = document.getElementById("logout-btn");

  if (token) {
    // User is logged in, show profile link
    profileLink.style.display = "block";
    loginBtn.style.display = "none";
    loginOut.style.display = "block";
  } else {
    // User is not logged in, hide profile link
    profileLink.style.display = "none";
    loginBtn.style.display = "block";
    loginOut.style.display = "none";
  }
}

// Function to handle user login
async function loginUser(userData) {
  try {
    const response = await fetch(`${BASEURL}user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
  alert("login success")
       setTimeout(() => {
         popUp.style.visibility = "hidden";
       }, 2000);
      updateProfileVisibility();
    } else {
      alert("User not found. Please check your credentials.");
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
}

// Function to handle user logout
async function logoutUser() {
  try {
    const response = await fetch(`${BASEURL}user/logout`, {
      method: "GET",
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      localStorage.removeItem("token"); 
      return { success: true, message: "Logout successful" };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.message || "Logout failed" };
    }
  } catch (error) {
    return { success: false, message: "An error occurred while logging out" };
  }
}

// Function to handle user registration
async function registerUser(regData) {
  try {
    const response = await fetch(`${BASEURL}user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(regData),
    });

    const data = await response.json();
   if(response.ok){
    alert("Registration success")
   }
  } catch (error) {
    console.error("Error registering user:", error);
  }
}

// Call this function when the page loads
updateProfileVisibility();

// Export the functions for use in other scripts
export { loginUser, logoutUser, registerUser,updateProfileVisibility};
