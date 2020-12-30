const hb=document.querySelector('.header .navbar .navlist .hb' );
const mobile=document.querySelector('.header .navbar .navlist ul' );
const header =document.querySelector('.header.container');

hb.addEventListener('click',()=>{
    hb.classList.toggle('active');
    mobile.classList.toggle('active');
});
document.addEventListener('scroll',()=>{
    var sp=window.scrollY;
    if(sp>250){
    header.style.backgroundColor ='#22395c';
    }
    else{
        header.style.backgroundColor="";
    }
});