function change_image(link_image){
    document.getElementById("screen_image").setAttribute("xlink:href", link_image);
}

image = 1;
next_image();
setInterval(next_image, 3000);

function next_image(){
    link_img = "code/st7789/st7789_jpg/data/";
    if(image == 1){
        change_image(link_img + "ia.jpg");
    } else {
        change_image(link_img + "ia" + image + ".jpg");
    }

    image++
    if(image == 8){
        image = 1;
    }
}




