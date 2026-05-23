// Main Entry
document.addEventListener("DOMContentLoaded", () => {

    // Finds the CSRF token of the HTML page for the post request
    function getCSRFToken() {
        return document.querySelector("[name=csrfmiddlewaretoken]")?.value;
    }

    // Loads the projects
    async function loadProjects() {
        // Get the searching stuffs
        const search = document.querySelector("#search-bar").value;
        const category = document.querySelector("#category-filter").value;
        const sort = document.querySelector("#sort-filter").value;

        // Get Searching Params to be passed to the django server
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (category) params.append("category", category);
        if (sort) params.append("sort", sort);


        // Send a fetch request to the server for getting the projects
        const response = await fetch(`/api/projects/?${params.toString()}`);
        //const response = await fetch("/api/projects/");

        // Check if it is OK
        if (!response.ok) {
            const errorHtml = await response.text();
            console.error("Server returned error:", errorHtml);
            return;
        }

        // Get the datas from its response
        const data = await response.json();

        // Get catalogBody for rendering newly fetched data
        const catalogBody = document.querySelector(".catalog-body");
        catalogBody.innerHTML = "";

        // Extract raw datas from JSON struct
        data.projects.forEach(project => {
            // Extract each item
            const item = document.createElement("div");

            // Set its HTML properties
            item.className = "item";
            item.dataset.id = project.id;

            // Separating tags
            const tagsValue = Array.isArray(project.tags) ? project.tags.join(", "): project.tags ?? "";

            // Get liked class based on what user did in pased
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
            // Append it to the catalog body
            catalogBody.appendChild(item);
            item.querySelector(".like-btn").addEventListener("click", async () => {
            const response = await fetch(`/projects/${project.id}/like/`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCSRFToken(),
                },
            });

            if (response.ok) {
            loadProjects();
            }
        });
    });

    // Also adding the addNewItem for the Admin only
    const addNew = document.createElement("div");

    catalogBody.appendChild(addNew);
    }

    // Add the event listener for searching stuff
    document.querySelector("#filter-btn").addEventListener("click", loadProjects);

    loadProjects();
});