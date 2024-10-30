let currentIndex = 0;
const imgItems = document.querySelectorAll('.img-item');
const totalImages = imgItems.length;

document.querySelector('.next').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalImages;
    updateCarousel();
});

document.querySelector('.prev').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;
    updateCarousel();
});

function updateCarousel() {
    const imgList = document.querySelector('.carousel .img-list'); // Updated to target the img-list class
    imgList.style.transform = `translateX(-${currentIndex * 100}%)`;
}
