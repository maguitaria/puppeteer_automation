const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  // Launch a headless browser instance
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the webpage
  await page.goto("https://fi.jamix.cloud/apps/menu/?anro=93077&k=48&mt=89");

  //   await page.waitForResponse(
  //     "https://fi.jamix.cloud/apps/menu/?anro=93077&k=48&mt=89"
  //   );
  // Find the element by the text "English"

await page.evaluate(() => {
  Array.from(document.querySelectorAll("span"))
    .filter((li) => {
      return li.innerText == "English"; // filter il for specific text
    })
    .forEach((element) => {
      if (element) element.click(); // click on il with specific text
    });
});
 
  // Save a snapshot of the webpage in MHTML format
  const cdp = await page.target().createCDPSession();
  const { data } = await cdp.send("Page.captureSnapshot", { format: "mhtml" });
  fs.writeFileSync("page.mhtml", data);
  console.log("MHTML snapshot saved");

  // Set the dimensions of the viewport (the visible part of the web page)
  await page.setViewport({ width: 1920, height: 1080 });

  // Take a screenshot and save it to a file
  await page.screenshot({ path: "screenshot.png" }); // You can specify the file name and format
  console.log("Screenshot saved as 'screenshot.png'");

  // Extract and save the text content of the webpage
  const extractedText = await page.$eval("*", (el) => el.innerText);
  fs.writeFileSync("./foodoo_menu.txt", extractedText);
  console.log("Text content saved as 'foodoo_menu.txt'");

  // Close the browser
  await browser.close();
})();
