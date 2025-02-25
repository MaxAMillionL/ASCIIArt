/* Required dependencies and imports */
const { createCanvas, Image } = require('canvas');
const fs = require('fs');
const child_process = require('child_process');
const path = require('path');

class ImageScaling {
    /* 
     * Scales an image (canvas) to a new width and height 
     */
    static scaleImage(image, newWidth, newHeight) {
        let canvas = createCanvas(newWidth, newHeight);
        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, newWidth, newHeight);
        return canvas;
    }
}

class ArtMaker {
    // the image that gets read in from args
    // holds a double value for red in terms of black and white and assigns an ASCII character to it
    // self imposed limit for image resolution maximum
    // largest that alphaVals can have
    constructor(imageSize, imageFile) {
        // declare instance variables
        this.image = null;
        this.pixels = new Map();
        this.scale = imageSize;
        this.BYTES = 256;

        // check for null case
        try {
            // Read the image file synchronously into a buffer and load it into an Image object
            let imageBuffer = fs.readFileSync(imageFile);
            let img = new Image();
            img.src = imageBuffer;

            // Create a canvas from the Image for processing
            let canvas = createCanvas(img.width, img.height);
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            this.image = canvas;
        } catch (ex) {
            console.log("Error: imageFile is not accessable");
        }

        // initialize instance variables
        let myASCII = Array.from(" `.-':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@");
        
        for (let i = 1; i <= myASCII.length; i++) {
            // Using Math.floor to simulate integer division as in Java
            this.pixels.set(Math.floor(this.BYTES * i / myASCII.length), myASCII[i - 1]);
        }

        // grayscale image
        this.image = this.grayscale(this.image);

        // lower resolution
        let newHeight, newWidth;
        if (this.image.width > this.image.height) {
            newWidth = this.scale;
            newHeight = Math.floor((this.image.height / this.image.width) * this.scale);
        } else {
            newHeight = this.scale;
            newWidth = Math.floor((this.image.width / this.image.height) * this.scale);
        }
        this.image = ImageScaling.scaleImage(this.image, newWidth, newHeight);
    }  

    /*
     * Takes a buffered image input and returns a grayscale version of 
     * the image
     */
    grayscale(image) {
        if (image == null) {
            throw new Error("image is null for grayscale");
        }

        // create dummy image to grayscale from original
        let newCanvas = createCanvas(image.width, image.height);
        let newCtx = newCanvas.getContext("2d");
        let ctx = image.getContext("2d");

        // grayscale the image
        for (let y = 0; y < newCanvas.height; y++) {
            for (let x = 0; x < newCanvas.width; x++) {
                let pixelData = ctx.getImageData(x, y, 1, 1).data;
                let r = pixelData[0];
                let g = pixelData[1];
                let b = pixelData[2];

                // Calculate luminance (commonly used method for grayscale conversion)
                let gray = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
                
                // Set the gray value to the new image
                // Construct the grayRGB value as in Java: (gray << 16) | (gray << 8) | gray
                // Here we set the pixel data manually
                let newPixel = new Uint8ClampedArray([gray, gray, gray, 255]);
                let imgData = newCtx.createImageData(1, 1);
                imgData.data.set(newPixel);
                newCtx.putImageData(imgData, x, y);
            }
        }

        // return dummy image
        return newCanvas;
    }

    /* 
     * puts the image on a frame pixelated at the original resolution
     */
    displayImage() {
        // Scale the image by the factor scale
        let imageDisplay = ImageScaling.scaleImage(this.image, this.image.width * this.scale, this.image.height * this.scale);
        // Write the image to a temporary file
        const outputPath = path.join(__dirname, 'displayImage.png');
        const out = fs.createWriteStream(outputPath);
        const stream = imageDisplay.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => {
            // Open the image using system command based on platform
            let command;
            if (process.platform === "win32") {
                command = 'start "" "' + outputPath + '"';
            } else if (process.platform === "darwin") {
                command = 'open "' + outputPath + '"';
            } else {
                command = 'xdg-open "' + outputPath + '"';
            }
            child_process.exec(command);
        });
    }

    /*
     * Turns an image into ASCII art
     */
    ASCII() {
        let art = "";
        let ctx = this.image.getContext("2d");
        for (let y = 0; y < this.image.height; y++) {
            for (let x = 0; x < this.image.width; x++) {
                let pixelData = ctx.getImageData(x, y, 1, 1).data;
                // In a grayscale image, red, green, and blue are the same, so we use red
                let rgb = (pixelData[0] << 16) | (pixelData[1] << 8) | (pixelData[2]);
                let red = (rgb >> 16) & 0xFF;
                let working = true;
                while (red < this.BYTES + 1 && working) {
                    if (this.pixels.get(red) != null) {
                        art += this.pixels.get(red);
                        art += this.pixels.get(red);
                        working = false;
                    }
                    red++;
                }
            }
            art += '\n';
        }
        return art;
    }

    /*
     * Takes in args[0] as the filename in the directory
     */
    static main(args) {
        // In Node.js, process.argv[0] is "node", process.argv[1] is the script name,
        // so the equivalent of args[0] in Java is process.argv[2] and args[1] is process.argv[3]
        if (args.length < 4) {
            console.log("Usage: node script.js <imageSize> <imageFileName>");
            return;
        }
        let imageSize = parseInt(args[2]);
        let imageFile = path.join(__dirname, "Images", args[3]);
        let artmaker = new ArtMaker(imageSize, imageFile);

        document.write(artmaker.ASCII());
    }
}

/* Execute main if this script is run directly */
if (require.main === module) {
    ArtMaker.main(process.argv);
}