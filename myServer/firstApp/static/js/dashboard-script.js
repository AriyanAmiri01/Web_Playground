/*
@file views.py
@author Ariyan Amiri
@version 1.0
@date 2026-05-23
@see https://github.com/AriyanAmiri01/Web_Playground
*/

document.addEventListener("DOMContentLoaded", () => {
    // Get buttons of the sidebar
    const personalInfoBtn = document.getElementById("personalInfoBtnID");
    const projectsBtn = document.getElementById("projectsBtnID");

    // Get windows
    const personalInfoWin = document.getElementById("personalInfoWinID");
    const projectsWin = document.getElementById("projectsWinID");

    // Add behavior
    personalInfoBtn.addEventListener("click", () => {
        personalInfoWin.classList.add("active");
        projectsWin.classList.remove("active");
        personalInfoBtn.classList.add("active");
        projectsBtn.classList.remove("active");
    });
    projectsBtn.addEventListener("click", () => {
        personalInfoWin.classList.remove("active");
        projectsWin.classList.add("active");
        personalInfoBtn.classList.remove("active");
        projectsBtn.classList.add("active");
    });
});