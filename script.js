document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("loginButton");
    const downloadButton = document.getElementById("downloadButton");
    const statusText = document.getElementById("status");

    loginButton.addEventListener("click", () => {
        statusText.textContent = "Opening TikTok login...";
        window.location.href = "/login";
    });

    downloadButton.addEventListener("click", () => {
        statusText.textContent = "Downloading cookies...";
        window.location.href = "/download-cookies";
    });
});
