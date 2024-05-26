document.addEventListener("DOMContentLoaded", function () {
    var slideIndex = 0;
    showSlides();

    function showSlides() {
        var i;
        var slides = document.getElementsByClassName("mySlides");
        
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }

        slideIndex++;

        if (slideIndex > slides.length) {
            slideIndex = 1;
        }

        for (i = 0; i < slides.length; i++) {
            slides[i].classList.remove("active");
        }

        slides[slideIndex - 1].style.display = "block";
        slides[slideIndex - 1].classList.add("active");

        // Remove existing dots
        var existingDots = document.querySelectorAll('.dot');
        existingDots.forEach(dot => dot.remove());

        // Add dots dynamically
        for (i = 0; i < slides.length; i++) {
            var dot = document.createElement("div");
            dot.className = "dot";
            document.querySelector('.slideshow-container .mySlides:nth-child(' + (i + 1) + ')').appendChild(dot);
        }

        setTimeout(showSlides, 5000); // Change slide every 5 seconds
    }
});