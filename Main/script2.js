// Adding new items
document.addEventListener("DOMContentLoaded", () => {
    const addNewBtn = document.getElementById("addNewBtn");
    const modalOverlay = document.getElementById("modalOverlay");
    const cancelBtn = document.getElementById("cancelBtn");
    const createBtn = document.getElementById("createBtn");

    const catalogBody = document.querySelector(".catalog-body");

    addNewBtn.addEventListener("click", () => {
        modalOverlay.classList.add("active");
    });

    cancelBtn.addEventListener("click", () => {
        modalOverlay.classList.remove("active");
    });

    createBtn.addEventListener("click", () => {
        const title = document.getElementById("projectTitle").value;
        const desc = document.getElementById("projectDesc").value;
        const tags = document.getElementById("projectTags").value;

        if (!title.trim()) return;

        const newItem = document.createElement("div");
        newItem.className = "item";

        newItem.innerHTML = `
            <div class="item-title">${title}</div>
            
            <div class="item-desc">
                ${desc}
            </div>
            
            <div class="item-tags">
                ${tags}
            </div>
            
            <div class="remove-container">
                <p>Remove Card</p>
                <input type="checkbox" class="select-btn">
            </div>
        `;

        catalogBody.insertBefore(newItem, addNewBtn);

        newItem.classList.add("new-item");

        // Hide the overlay window
        modalOverlay.classList.remove("active");

        // Reinitializing stuff for the next use
        document.getElementById("projectTitle").value = "";
        document.getElementById("projectDesc").value = "";
        document.getElementById("projectTags").value = "";

    });
});





// Removing Items
document.addEventListener("DOMContentLoaded", () => {
    // Get the items
    const clientItems = document.querySelectorAll(".item");
    const changedItems = {};

    // Update structures if something changed 
    clientItems.forEach(item=>{
        const toggleBtn = item.querySelector(".select-btn");
        if(!toggleBtn){
            console.warn("No .select-btn found inside item:", item);
            return;
        }
       
        // Add event listener for when toggle box is clicked
        toggleBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            changedItems[item.id] = {
                id: item.id,
                selected: item.querySelector(".select-btn").checked,
                title: item.querySelector(".item-title").innerText.trim(),
                description: item.querySelector(".item-desc").innerText.trim(),
                tags: item.querySelector(".item-tags").innerText.trim()
            };
            console.log("chagen item is called2 ");
        });
    })

    // Save changes
    console.log("save item is called ");
    const saveButton = document.getElementById("save-change-button");
    saveButton.addEventListener("click", () => {
        console.log("save button clicked");

        Object.values(changedItems).forEach(item => {
            console.log("id was", item.id);
        });
    });

    // Discard Changes
    document.getElementById("discard-change-button").addEventListener("click", () => {

        console.log("Changes discarded");
    });



});







