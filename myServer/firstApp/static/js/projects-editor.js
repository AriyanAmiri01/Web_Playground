// Main Entry
document.addEventListener("DOMContentLoaded", () => {
    // Get Buttens Instances
    const catalogBody = document.querySelector(".catalog-body");
    const saveButton = document.getElementById("save-change-button");
    const discardButton = document.getElementById("discard-change-button");
    const modalOverlay = document.getElementById("modalOverlay");
    const createBtn = document.getElementById("createBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    // Finds the CSRF token of the HTML page for the post request
    function getCSRFToken() {
        return document.querySelector("[name=csrfmiddlewaretoken]")?.value;
    }

    // Loads the projects
    async function loadProjects() {
        // Send a fetch request to the server for getting the projects
        const response = await fetch("/api/projects/");

        // Check if it is OK
        if (!response.ok) {
        const errorHtml = await response.text();
        console.error("Server returned error:", errorHtml);
        return;}

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

            const tagsValue = Array.isArray(project.tags)
                ? project.tags.join(", ")
                : project.tags ?? "";

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


            // Append it to the catalog body
            catalogBody.appendChild(item);
        });

    // Also adding the addNewItem for the Admin only
    const addNew = document.createElement("div");
    addNew.className = "item add-new-item";
    addNew.id = "addNewBtn";
    addNew.innerHTML = `
        <div class="item-title">Add New</div>
        <div class="add-new-desc">+</div>
    `;
    catalogBody.appendChild(addNew);
    }

    //This function loops through all items and if it is selected it sends a delete request 
    async function saveChanges() {
        // Getting all the items
        const items = document.querySelectorAll(".catalog-body .item:not(.add-new-item)");

        console.log("save chnages is clicked");
        // Looping through all items and deleteing the selected ones from server
        for (const item of items) {
            // Get the item ID
            const projectId = item.dataset.id;
            if (!projectId) {
             console.error("Missing project ID on item:", item);
                continue;}

            // Check if it should be deleted
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

            // First it gets the datas of the new item
            const title = item.querySelector(".edit-title").value;
            const description = item.querySelector(".edit-desc").value;
            const tags = item.querySelector(".edit-tags").value;
            const github_link = item.querySelector(".edit-github").value;
            const start_date = item.querySelector(".edit-start-date").value;
            const end_date = item.querySelector(".edit-end-date").value;
            const status = item.querySelector(".edit-status").value;

            // Create the JSON structure
                    // Create JSON structure
            const projectData = {
                title: title,
                description: description,
                tags: tags,
                start_date: start_date,
                status: status,
                github_link: github_link,
                end_date: end_date
            };
            console.log(projectData);

            // Then sends them to the server for updating them using JSON
            const response = await fetch(`/api/projects/${projectId}/update/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken()
                },
                body: JSON.stringify(projectData)
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Update failed:");
                console.error(text);
                return;
            }

        }

        // At the end it reload all the projects(items)
        await loadProjects();
    }

    // Discard changes
    async function discardChanges(){
        await loadProjects();
    }

    // Function to create a new project
    async function createProject() {
        // First it gets the datas of the new item
        const title = document.getElementById("projectTitle").value;
        const description = document.getElementById("projectDesc").value;
        const tags = document.getElementById("projectTags").value;
        const start_date = document.getElementById("projectStartDate").value;
        const status = document.getElementById("projectStatus").value;
        const github_link = document.getElementById("projectGithub").value;
        const end_date = document.getElementById("projectEndDate").value;

        // Create JSON structure
        const projectData = {
            title: title,
            description: description,
            tags: tags,
            start_date: start_date,
            status: status,
            github_link: github_link,
            end_date: end_date
        };
        console.log(projectData);

        // Send request
        const response = await fetch("/api/projects/create/", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()
            },

            body: JSON.stringify(projectData)
        });

        // Check server response
        if(response.ok){

            console.log("Project created successfully");

            document.getElementById("modalOverlay").style.display = "none";

            await loadProjects();
        }
        else{

            const errorText = await response.text();

            console.error("Server Error:");
            console.error(errorText);
        }
    }

    // When addNewBtn is pressed
    catalogBody.addEventListener("click", event => {
        const addNewBtn = event.target.closest("#addNewBtn");

        if (addNewBtn) {
            modalOverlay.classList.add("active");
        }
    });

    // Cancel Adding New element process
    cancelBtn.addEventListener("click", () => {
        modalOverlay.classList.remove("active");
    });

    // Proceed with Adding New element process
    createBtn.addEventListener("click", createProject);

    // Save changes 
    saveButton.addEventListener("click", saveChanges);

    // Discard Changes
    discardButton.addEventListener("click", discardChanges);

    loadProjects();
});