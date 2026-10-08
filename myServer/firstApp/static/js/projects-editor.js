/*
@file projects-editor.js
@author Ariyan Amiri
@version 1.0
@date 2026-05-23
@see https://github.com/AriyanAmiri01/Web_Playground
*/

document.addEventListener("DOMContentLoaded", () => {
    // Get Instances
    const catalogBody = document.querySelector(".catalog-body");
    const saveButton = document.getElementById("save-change-button");
    const discardButton = document.getElementById("discard-change-button");
    const modalOverlay = document.getElementById("modalOverlay");
    const createBtn = document.getElementById("createBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    let currentPage = 1;

    // CSRF Token Getter
    function getCSRFToken() {
        return document.querySelector("[name=csrfmiddlewaretoken]")?.value;
    }

    // Loads Projects
    async function loadProjects() {
        // Get Projects
        const params = new URLSearchParams();
        params.append("page", currentPage);
        const response = await fetch(`/api/projects/?${params.toString()}`);

        // Error Check
        if (!response.ok) {
            const errorHtml = await response.text();
            console.error("Server returned error:", errorHtml);
            return;
        }

        // Get JSON
        const data = await response.json();

        // Fill Catalog
        catalogBody.innerHTML = "";
        data.projects.forEach(project => {
            // Extract item
            const item = document.createElement("div");
            item.className = "item";
            item.dataset.id = project.id;
            const tagsValue = Array.isArray(project.tags)? project.tags.join(", "): project.tags ?? "";
            item.innerHTML = `
                <input class="edit-title" value="${project.title ?? ""}">
                <textarea class="edit-desc">${project.description ?? ""}</textarea>
                <input class="edit-tags" value="${tagsValue}">
                <input class="edit-start-date" type="date" value="${project.start_date ?? ""}">
                <input class="edit-end-date" type="date" value="${project.end_date ?? ""}">
                <select class="edit-status">
                    <option value="planned" ${project.status === "planned" ? "selected" : ""}>Planned</option>
                    <option value="in_progress" ${project.status === "in_progress" ? "selected" : ""}>In Progress</option>
                    <option value="completed" ${project.status === "completed" ? "selected" : ""}>Completed</option>
                </select>
                <input class="edit-github" value="${project.github_link ?? ""}" placeholder="GitHub link">
                <div class="remove-container">
                    <p>Remove Card</p>
                    <input type="checkbox" class="select-btn">
                </div>
            `;

            // Append To Catalog
            catalogBody.appendChild(item);
        });

        // AddNewBtn (Admin Only)
        const addNew = document.createElement("div");
        addNew.className = "item add-new-item";
        addNew.id = "addNewBtn";
        addNew.innerHTML = `
            <div class="item-title">Add New</div>
            <div class="add-new-desc">+</div>
        `;
        
        // Pagination Buttons
        document.querySelector("#prev-btn").disabled =
        !data.pagination.has_previous;
        document.querySelector("#next-btn").disabled =
        !data.pagination.has_next;

        catalogBody.appendChild(addNew);
    }

    // Save New Changes
    async function saveChanges() {
        // Get Items
        const items = document.querySelectorAll(".catalog-body .item:not(.add-new-item)");

        // Update Items
        for (const item of items) {
            // Get the item ID
            const projectId = item.dataset.id;
            if (!projectId) {
                console.error("Missing project ID on item:", item);
                continue;
            }

            // Delete Item Case
            const shouldDelete = item.querySelector(".select-btn").checked;
            if (shouldDelete) {
                // If Yes sends the delete request
                await fetch(`/api/projects/${projectId}/delete/`, {
                    method: "POST",
                    headers: {
                        "X-CSRFToken": getCSRFToken(),
                    },
                });
                continue;
            }

            // Update Item Case
            const title = item.querySelector(".edit-title").value;
            const description = item.querySelector(".edit-desc").value;
            const tags = item.querySelector(".edit-tags").value;
            const github_link = item.querySelector(".edit-github").value;
            const start_date = item.querySelector(".edit-start-date").value;
            const end_date = item.querySelector(".edit-end-date").value;
            const status = item.querySelector(".edit-status").value;
            const projectData = {
                title: title,
                description: description,
                tags: tags,
                start_date: start_date,
                status: status,
                github_link: github_link,
                end_date: end_date
            };
            const response = await fetch(`/api/projects/${projectId}/update/`, {
                // Update Add Request
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken()
                },
                body: JSON.stringify(projectData)
            });

            // Error Check
            if (!response.ok) {
                const text = await response.text();
                console.error("Update failed:");
                console.error(text);
                return;
            }
        }

        // Reload
        await loadProjects();
    }

    // Discard Changes
    async function discardChanges(){
        await loadProjects();
    }

    // Function to create a new project
    async function createProject() {
        // Get Datas
        const title = document.getElementById("projectTitle").value;
        const description = document.getElementById("projectDesc").value;
        const tags = document.getElementById("projectTags").value;
        const start_date = document.getElementById("projectStartDate").value;
        const status = document.getElementById("projectStatus").value;
        const github_link = document.getElementById("projectGithub").value;
        const end_date = document.getElementById("projectEndDate").value;

        // Create JSON
        const projectData = {
            title: title,
            description: description,
            tags: tags,
            start_date: start_date,
            status: status,
            github_link: github_link,
            end_date: end_date
        };

        // Send request
        const response = await fetch("/api/projects/create/", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()
            },

            body: JSON.stringify(projectData)
        });

        // Handle Server Response
        if(response.ok){
            // Hide Overlay Window
            document.getElementById("modalOverlay").style.display = "none";

            // Reload
            await loadProjects();
        }
        else{
            // Error message
            const errorText = await response.text();
            console.error("Server Error:");
            console.error(errorText);
        }
    }

    // Event Listeners
    catalogBody.addEventListener("click", event => {
        const addNewBtn = event.target.closest("#addNewBtn");
        if (addNewBtn) {
            modalOverlay.classList.add("active");
        }
    });
    cancelBtn.addEventListener("click", () => {modalOverlay.classList.remove("active");});
    createBtn.addEventListener("click", createProject);
    saveButton.addEventListener("click", saveChanges);
    discardButton.addEventListener("click", discardChanges);
    document.querySelector("#prev-btn").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            loadProjects();
        }
    });
    document.querySelector("#next-btn").addEventListener("click", () => {
        currentPage++;
        loadProjects();
    });

    // Reload
    loadProjects();
});