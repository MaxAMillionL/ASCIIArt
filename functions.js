// copies the text
function copyText(){
    // alert("button clicked!")
    var copyText = document.getElementById("asciiArt");

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.innerText);

    // Alert the copied text
    alert("Copied the text: " + copyText.innerText);

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
document.getElementById('inverseButton').onclick = function(){
    inverse = !inverse;
    document.getElementById('inverseValue').textContent = inverse.value;
    generateASCII(image);
}

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