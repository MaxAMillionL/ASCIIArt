// generates context information for the canvas
function createCTX(canvas, img){
    
    const ctx = canvas.getContext('2d');
  
    if(img.height > img.width){
        newHeight = size;
        newWidth = img.width * newHeight / img.height
    }
    else{
        newWidth = size;
        newHeight = img.height * newWidth / img.width
    }

    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return ctx;
}

// copies the text
function copyText(){
    var copyText = document.getElementById("asciiArt");
    navigator.clipboard.writeText(copyText.innerText);
    alert("Copied");
}

// all sliders
document.getElementById('sizeSlider').oninput = function(){
    size = document.getElementById('sizeSlider').value;
    document.getElementById('sizeValue').textContent = size;
    generateASCII(image)
}
document.getElementById('cutoffSlider').oninput = function(){
    cutoff = document.getElementById('cutoffSlider').value;
    document.getElementById('cutoffValue').textContent = cutoff;
    generateASCII(image);
}
document.getElementById('contrastSlider').oninput = function(){
    contrast = document.getElementById('contrastSlider').value;
    document.getElementById('contrastValue').textContent = contrast;
    generateASCII(image);
}
document.getElementById('brightnessSlider').oninput = function(){
    brightness = document.getElementById('brightnessSlider').value;
    document.getElementById('brightnessValue').textContent = (brightness - 1).toFixed(2);
    generateASCII(image);
}

// all buttons
document.getElementById('inverseButton').onclick = function(){
    inverse = !inverse;
    document.getElementById('inverseValue').textContent = inverse.value;
    generateASCII(image);
}
document.getElementById('reset').onclick = function(){
    size = 50;
    document.getElementById('sizeValue').textContent = 50;
    cutoff = 0;
    document.getElementById('cutoffValue').textContent = 0;
    contrast = 1;
    document.getElementById('contrastValue').textContent = 1;
    brightness = 0;
    document.getElementById('brightnessValue').textContent = 0;
    inverse = false;
    generateASCII(image);
}

// insert file
document.getElementById('imageInput').oninput = function(event){
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        image.src = e.target.result;
        image.onload = function() {
            generateASCII(image)
        };
    };
    reader.readAsDataURL(file);
}