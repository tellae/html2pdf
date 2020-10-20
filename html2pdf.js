#!/usr/bin/node
const path = require("path");
const puppeteer = require("puppeteer");
const fs = require("fs");

const args = process.argv;

if(args.length != 4) {
  console.log("Path error")
  console.log("Usage: html2pdf inputdir outputdir")
} else {
  const dirpath = path.resolve(args[2]);
  const outpath = path.resolve(args[3]);
  (async () => {
    // Launch the browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    // Get all the .html filesystem items
    let files = fs.readdirSync(dirpath).filter((f) => f.endsWith(".html"));
    for (let f in files) {
      console.log(files[f]);
      let htmlFile = path.join(dirpath, files[f]);
      // Skip anything that is not a file
      if (!fs.statSync(htmlFile).isFile()) {
        continue;
      }
      // Load the html
      await page.goto("file://" + htmlFile);
      // Export to PDF
      await page.pdf({
        path: path.join(outpath, files[f].replace(/\.html$/, ".pdf")),
        format: "A4",
        landscape: true,
        printBackground: true,
      });
    }
    // Close the browser
    await browser.close();
  })();
}
const arg = process.argv.pop();
// Fallback to current dir if none is specified
const dirpath = path.resolve(arg === __filename ? "." : arg);

