// DOM Elements
const currentPageElement = document.getElementById("currentPage");
const perPageSelectElement = document.getElementById("perPage");
const usernameInput = document.getElementById("username");
const profileContainer = document.getElementById("profile");
const repositoriesContainer = document.getElementById("repositories");
const searchInput = document.getElementById("search");
const paginationContainer = document.getElementById("pagination");
const accessToken = "YOUR_PERSONAL_ACCESS_TOKEN";

const loader = document.getElementById("loader");
loader.style.position = "fixed";
loader.style.top = "50%";
loader.style.left = "50%";
loader.style.transform = "translate(-50%, -50%)";

let currentPage = 1;
let perPage = 10;
let activeButton = "";

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".container").style.display = "none";
  fetchGitHubData();
  updateActiveButton();
});

usernameInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    fetchGitHubData();
  }
});

searchInput.addEventListener("keyup", filterRepositories);

// Functions

function fetchGitHubData() {
  const username = usernameInput.value;

  if (!username) {
    alert("Please enter a GitHub username.");
    document.querySelector(".container").style.display = "none";
    return;
  }

  document.querySelector(".container").style.display = "block";
  loader.style.display = "block";
  perPage = parseInt(perPageSelectElement.value);

  const apiUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${currentPage}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(apiUrl, { headers }),
  ])
    .then(([profileResponse, repositoriesResponse]) => {
      if (!profileResponse.ok || !repositoriesResponse.ok) {
        throw new Error("Error fetching data from GitHub API.");
      }
      return Promise.all([profileResponse.json(), repositoriesResponse.json()]);
    })
    .then(([profile, repositories]) => {
      loader.style.display = "none";
      repositoriesContainer.innerHTML = "";

      displayUserProfile(profile);
      displayRepositories(repositories);
      updatePagination(profile.public_repos);
    })
    .catch(handleError);
}

function updatePagination(totalRepositories) {
  const totalPages = Math.ceil(totalRepositories / perPage);
  paginationContainer.innerHTML = "";

  function createPaginationButton(text, onClick) {
    const element = document.createElement("div");
    element.textContent = text;
    element.style.padding = "8px 12px";
    element.style.color = "grey";
    element.style.border = "1px solid #000";
    element.style.borderRadius = "";
    element.style.background = "#fff";
    element.style.cursor = "pointer";
    element.style.display = "inline-block";
    element.addEventListener("click", onClick);
    return element;
  }

  const prevElement = createPaginationButton("←prev", function () {
    if (currentPage > 1) {
      currentPage--;
      activeButton = "prev";
      fetchGitHubData();
    }
  });

  paginationContainer.appendChild(prevElement);

  for (let i = 1; i <= totalPages; i++) {
    const pagination = createPaginationButton(i, function () {
      currentPage = i;
      activeButton = "";
      fetchGitHubData();
    });

    if (i === currentPage) {
      pagination.classList.add("active");
      pagination.style.color = "#000";
      pagination.style.background = "#3498db";
    }

    paginationContainer.appendChild(pagination);
  }

  const nextElement = createPaginationButton("next→", function () {
    if (currentPage < totalPages) {
      currentPage++;
      activeButton = "next";
      fetchGitHubData();
    }
  });

  paginationContainer.appendChild(nextElement);

  updateActiveButton();
}

function updateActiveButton() {
  const buttons = Array.from(paginationContainer.children);
  buttons.forEach((button) => button.classList.remove("active"));

  if (activeButton) {
    const activeButtonElement = buttons.find((button) =>
      button.textContent.includes(activeButton)
    );
    if (activeButtonElement) {
      activeButtonElement.classList.add("active");
      activeButtonElement.style.color = "#000";
      activeButtonElement.style.background = "#3498db";
    }
  }
}

function displayUserProfile(profile) {
  profileContainer.innerHTML = `
    <div class="profile-content" style="display: flex; align-items: center;">
      <div class="profile-image" style="margin-right: 20px;">
        <img src="${
          profile.avatar_url
        }" alt="Profile Picture" width="100" style="border-radius: 50px; border: 3px solid grey;">
      </div>
      <div class="profile-info" style="flex-grow: 1;">
        <h2 style="color: #000; font-family: 'Cursive', sans-serif; font-weight: bolder; margin-bottom: 10px; margin-top: 0;">${
          profile.name
        }</h2>
        <p style="margin-bottom: 10px; margin-top: 0; font-weight: bolder;">${
          profile.bio || "No bio available"
        }</p>
        <div style="display: flex; align-items: center;">
          <img src="./img/location.png" alt="Logo" width="20" style="margin-right:px; margin-bottom:10px;">
          <p style="margin-bottom: 10px; margin-top: 0; font-weight: bolder;">${
            profile.location
          }</p>
        </div>
      </div>
    </div>
    <p class="github-link" style="margin-top: 30px;">GitHub: <a href="${
      profile.html_url
    }" target="_blank">${profile.login}</a></p>
  `;
}

function displayRepositories(repositories) {
  repositories.forEach((repo) => {
    const repoElement = createRepoElement(repo);
    repositoriesContainer.appendChild(repoElement);
  });
}
function createRepoElement(repo) {
  const repoElement = document.createElement("div");
  repoElement.classList.add("repo-card");
  repoElement.style.display = "";
  // Check if there are topics
  const topicsHTML =
    repo.topics && repo.topics.length > 0
      ? repo.topics
          .map((topic) => `<div class="topic-box">${topic}</div>`)
          .join("")
      : '<button class="no-topics-button">No Topics</button>';

  repoElement.innerHTML = `
    <h3>${repo.name}</h3>
    <p class="repo-description">${repo.description || "No description"}</p>
    <div class="topics-container" style="display: flex; flex-wrap: wrap; align-items: center;">
      ${topicsHTML}
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    .repo-description {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .topic-box {
      display: inline-block;
      padding: 5px 10px;
      background-color: #3498db;
      color: #fff;
      margin-right: 5px;
      margin-top:30px;
      border-radius: 5px;
    }

    .no-topics-button {
      padding: 5px 10px;
      background-color: #3498db;
      color: #fff;
      border: none;
      border-radius: 5px;
    }
  `;
  repoElement.appendChild(style);

  return repoElement;
}

function filterRepositories() {
  const repos = document.getElementsByClassName("repo-card");

  for (const repo of repos) {
    const repoName = repo.querySelector("h3").textContent.toLowerCase();
    const searchTerm = searchInput.value.toLowerCase();

    repo.style.display = repoName.includes(searchTerm) ? "block" : "none";
  }
}

function handleError(error) {
  console.error("Error fetching data:", error);
  loader.style.display = "none";
  window.location.href = "error.html";
}
