window.onload = function(){
    var slideImage = document.getElementById("slide-image");
    var images = ["images/Istanbul.jpg", "images/istanbul2.jpg", "images/kars.jpg", "images/nevsehir.jpg", "images/denizli.jpg", "images/sivas.jpg", "images/izmir.jpg"];
    var counter = 1;
    slideImage.src = images[0];
    window.setInterval(changeImages,3000);

    function changeImages(){
        if(counter === images.length){
            counter = 0;
        }
        slideImage.src = images[counter];
        counter++;
    }

}