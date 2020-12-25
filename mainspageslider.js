window.onload = function(){
    var div=document.getElementById("deneme");
    var slideImage = document.getElementById("slide-image");
    var h1=document.getElementById("tet");
    var images = ["images/concertsmoke.jpg","images/basketball2.jpg","images/theater.jpg","images/football.jpg"];
    var text =["deneme1","deneme2","deneme3","deneme4"];
    var text2 =["deneme3","deneme4","deneme53","deneme46"];
    var counter = 1;
    div.innerHTML="";
    slideImage.src = images[0];
    div.innerHTML+= `<h1 id="tet" class="tett">${text[0]}<span></span></h1>
    <h3>${text2[0]}<span></span></h3>`;
    window.setInterval(changeImages,7000);

    function changeImages(){
        if(counter === images.length){
            counter = 0;
        }
        slideImage.src = images[counter];
        div.innerHTML= "";
        div.innerHTML+= `<h1 id="tet" class="tett">${text[counter]}<span></span></h1>
    <h3>${text2[counter]}<span></span></h3>`;
        counter++;
    }

}