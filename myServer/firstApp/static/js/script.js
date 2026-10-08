/*
@file views.py
@author Ariyan Amiri
@version 1.0
@date 2026-05-23
@see https://github.com/AriyanAmiri01/Web_Playground
*/

document.addEventListener("DOMContentLoaded", () => {
    // Get Instances
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const navbar = document.getElementById("navbar");

    // Toggle Menu (NavBar)
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            navLinks.classList.toggle("active");
        });

        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                navLinks.classList.remove("active");
            });
        });
    }

    // Custum Observer Config
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    // Observe Elements
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {


            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Fade Elements 
    document.querySelectorAll(".fade-in").forEach(el => {
        observer.observe(el);
    });

});