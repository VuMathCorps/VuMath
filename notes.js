window.onload = function() {
    var fileInput = document.getElementById('note-image');
    var textInput = document.getElementById('note-prompt');
    var generateButton = document.getElementById('generate-button');
    var storedImages = [];
    var promptText = '';

    textInput.addEventListener('input', function() {
        promptText = textInput.value;
    });

    fileInput.addEventListener('change', function() {
        var files = fileInput.files;
        var imageType = /image.*/;
        storedImages = []; 

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (file.type.match(imageType)) {
                var reader = new FileReader();
                reader.onload = (function(file) {
                    return function(e) {
                        var img = new Image();
                        img.src = e.target.result;
                        storedImages.push(img); 
                    };
                })(file);

                reader.readAsDataURL(file);
            } else {
                console.log("File not supported");
            }
        }
    });

    generateButton.addEventListener('click', function() {
        if (storedImages.length > 0||promptText!='') {

        } else {
            console.log("No images or text added");
        }
    });
}
