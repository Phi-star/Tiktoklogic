const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const COOKIES_FILE = "cookies.json";

// Serve index.html directly
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Route to start Puppeteer login
app.get("/login", async (req, res) => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: false, // Allows login UI
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();

        // Load cookies if they exist
        try {
            const cookies = JSON.parse(await fs.readFile(COOKIES_FILE, "utf8"));
            await page.setCookie(...cookies);
            console.log("Loaded cookies.");
        } catch (err) {
            console.log("No saved cookies found.");
        }

        // Open TikTok login page
        await page.goto("https://www.tiktok.com/login", { waitUntil: "networkidle2" });

        console.log("Please log in through the browser.");
        res.send("Please log in to TikTok in the opened browser. Close the tab after logging in.");

        // Wait for manual login
        await new Promise(resolve => setTimeout(resolve, 30000));

        // Save cookies after login
        const cookies = await page.cookies();
        await fs.writeFile(COOKIES_FILE, JSON.stringify(cookies, null, 2));
        console.log("Cookies saved!");

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error occurred.");
    } finally {
        if (browser) await browser.close();
    }
});

// Route to download cookies.json
app.get("/download-cookies", async (req, res) => {
    try {
        const filePath = path.join(__dirname, COOKIES_FILE);
        res.download(filePath, "cookies.json");
    } catch (error) {
        console.error("Error downloading cookies:", error);
        res.status(500).send("Error downloading cookies.");
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
