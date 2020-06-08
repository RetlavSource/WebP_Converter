[![GitHub release (latest by date)](https://img.shields.io/github/v/release/RetlavSource/WebP_Converter?color=brightgreen&include_prereleases&label=latest%20release&style=plastic)](https://github.com/RetlavSource/WebP_Converter/releases)

# WebP Converter - Subject Project
![WebP Converter Info Banner](public/img/heading.png)

This is a project for the Multimedia II subject at UFP University - Portugal.

---

### Features
- Converts *`.jpeg`*, *`.jpg`* and *`.png`* in to *`.webp`* format
- *lossy* and *lossless* compression
- Ability to select the *quality* of the image for *lossy* and *effort* for *lossless* compression
- Quality/Speed trade off compression option
- Ability to select the desire *target file size* (<u>this option takes precedence over quality and speed trade off</u>)
- Image info: *name, type* and *size*
- Steps of WebP compression (*compress phases*)(*incomplete!*)
- Directs to a page where you can view the image in detail, with the help of a digital magnifying glass
- In the image view page:
    - *compress another* button (*home button*)
    - slider for selecting the zoom level (*4x max*)
    - Information of the Original image and the WebP image
    - Information about the options used in the WebP image compression
    - zoom aplied in the 2 images always on the same spot in each of them
    - mouse *click* for selecting the zoom spot (before was mouse *movement* over the image, but i think *click* is best for comparing images)

---

### Installation
- Instal [Node.js](https://nodejs.org/en/download/) from the Official Site *(Prefer LTS Version)*
- Clone the repo
- Go to the root folder of the project and run in terminal: 
    ```js
        npm install
    ```
- Then, in the same folder, run in terminal: 
    ```js
        npm run start
    ```
- Open your browser in the address: `http://localhost:3000`

---

### Thanks and Credits
The fun of this work was made possible by:
- Google [WebP](https://developers.google.com/speed/webp) Homepage
- [Precompiled](https://developers.google.com/speed/webp/docs/precompiled) Webp Utilities from Google
- [Compiling](https://developers.google.com/speed/webp/docs/compiling) Webp Utilities from Google
- Index for [Downloading](https://storage.googleapis.com/downloads.webmproject.org/releases/webp/index.html) Webp Releases
- [Node.js](https://nodejs.org/en/) Official Site
- [npm](https://www.npmjs.com) Official Site
