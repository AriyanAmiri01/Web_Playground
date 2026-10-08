/*
@file views.py
@author Ariyan Amiri
@version 1.0
@date 2026-05-23
@see https://github.com/AriyanAmiri01/Web_Playground
*/

// Main Entry
document.addEventListener("DOMContentLoaded", () => {
    // Get Token
    function getCSRFToken() {
        return document.querySelector("[name=csrfmiddlewaretoken]")?.value;
    }

    // For pagination 
    let currentPage = 1;

    // Loads the projects
    async function loadProjects() {
        // Get Instances
        const search = document.querySelector("#search-bar").value;
        const category = document.querySelector("#category-filter").value;
        const sort = document.querySelector("#sort-filter").value;
        const catalogBody = document.querySelector(".catalog-body");

        // Get Searching Params
        const params = new URLSearchParams();
        if(currentPage) params.append("page", currentPage);
        if (search) params.append("search", search);
        if (category) params.append("category", category);
        if (sort) params.append("sort", sort);


        // Get Projects Request
        const response = await fetch(`/api/projects/?${params.toString()}`);

        // Error Check
        if (!response.ok) {
            const errorHtml = await response.text();
            console.error("Server returned error:", errorHtml);
            return;
        }

        // Extract Json
        const data = await response.json();



        // Add Catalog Elements
        catalogBody.innerHTML = "";
        data.projects.forEach(project => {
            // Prapare Item
            const item = document.createElement("div");
            item.className = "item";
            item.dataset.id = project.id;
            const tagsValue = Array.isArray(project.tags) ? project.tags.join(", "): project.tags ?? "";
            const likedClass = project.liked_by_user ? "liked" : "";
            item.innerHTML = `
                <div class="item-title">${project.title ?? ""}</div>  
                <div class="item-desc">${project.description ?? ""}</div>
                <div class="item-tags">${tagsValue}</div>    
                <div class="item-start-date">Start: ${project.start_date ?? ""}</div> 
                <div class="item-end-date">End: ${project.end_date ?? "Not finished"}</div>      
                <div class="item-status">Status: ${project.status ?? "planned"}</div>
                <a class="item-github"href="${project.github_link ?? "#"}"target="_blank">GitHub Link</a>
                <button class="like-btn ${likedClass}" data-project-id="${project.id}">
                <span class="likes-count ${likedClass}">
                    ${project.likes_count ?? 0}
                </span>
                </button>
            `;

            // Append Item
            catalogBody.appendChild(item);

            // Like Event
            item.querySelector(".like-btn").addEventListener("click", async () => {
                const response = await fetch(`/projects/${project.id}/like/`, {
                    method: "POST",
                    headers: {
                        "X-CSRFToken": getCSRFToken(),
                    },
                });
                // Reload
                if (response.ok) {
                    loadProjects();
                }
            });
        });

        // Pagination Buttons State
        document.querySelector("#prev-btn").disabled =!data.pagination.has_previous;
        document.querySelector("#next-btn").disabled =!data.pagination.has_next;

        // Append to catalog
        catalogBody.appendChild(addNew);
    }

    // Event Listeners
    document.querySelector("#filter-btn").addEventListener("click", () => {
        currentPage = 1;
        loadProjects();
    });
    document.querySelector("#prev-btn").addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                loadProjects();
            }
    });
    document.querySelector("#next-btn").addEventListener("click", () => {
        currentPage++;loadProjects();
    });
    
    // Reload
    loadProjects();
});