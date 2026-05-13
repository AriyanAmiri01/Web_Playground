/*!
 * @file script.js
 * @brief Handles mobile navigation, navbar scroll effects,
 *        fade-in animations, and form submission behavior.
 *
 * @details
 * This script provides:
 * - Mobile menu toggle functionality
 * - Automatic menu closing when navigation links are clicked
 * - Dynamic navbar styling during page scrolling
 * - Fade-in animations using IntersectionObserver
 * - Demo form submission handling
 *
 * @author Ariyan Amiri
 * @version 1.0
 * @date 2026-05-13
 *
 * @see https://github.com/AriyanAmiri01/Web_Playground
 */



document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const navbar = document.getElementById("navbar");

    /*
     * Mobile menu toggle
     */
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

