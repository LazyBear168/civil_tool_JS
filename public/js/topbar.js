// File name: topbar.js
// Author: sunny

// Button of function
const sharedMenus = [
    {
        type: "logo",
        href: "index.html",
        class: "logo-img"
    },
    {
        label: "general Mode",
        aria: "Design mode selection",
        id: "generalMode",
        items: ["Professional", "Project"],
        scroll: "front"
    },
    {
        label: "⚙️",
        aria: "Settings menu",
        id: "settingsMenu",
        items: ["Client mode", "Dark mode"],
        scroll: "front"
    },
    {
        label: "External Forces",
        aria: "External force calculations",
        id: "ExternalForce",
        items: ["Seismic Load", "Wind Load"],
    },
    {
        label: "Design Tools",
        aria: "Structural design tools",
        id: "DesignTools",
        items: ["Steel Beam", "Steel Column"]
    },
    {
        label: "Code Navigator",
        aria: "Navigate building codes and regulations",
        id: "RegulatoryNavi",
        items: ["Steel Beam", "Steel Column"]
    },
    {
        label: "Quantity Estimator",
        aria: "Material quantity and cost estimation",
        id: "QuantityCal",
        items: ["New Sheet", "Export to Excel"]
    },
    {
        label: "Message Board",
        aria: "User message board or feedback area",
        id: "MessageWall",
        items: []
    },
    {
        label: "About",
        aria: "About the author and feedback options",
        id: "QAboutAuthor",
        items: ["Author", "Report an Issue"]
    }
];


renderMenu(".topBarWrapper");
initTopBar();

/* 
    The structure of navigation is:
        <ul>
            <li class="dropdown">
                <button></button>
                <ul class="dropdown-content">
                    <li>
                        <button></button>
                    </li>
                    ... sub menu's button
                </ul>
                ...other button
            </li>
        </ul>
*/
function renderMenu(containerSelector, isMobile = false) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const ul = document.createElement("ul");

    sharedMenus.forEach((menu) => {
        if (menu.type === "logo") {
            const logoLi = document.createElement("li");
            const logooLink = document.createElement("a");
            logooLink.href = menu.href || "#";
            logooLink.classList.add(menu.class || "logo-img");
            logoLi.appendChild(logooLink);
            ul.appendChild(logoLi);
            return;
        }
        
        const li = document.createElement("li");
        li.classList.add("dropdown");

        const button = document.createElement("button");
        button.classList.add("dropBtn");
        button.innerText = menu.label;
        button.setAttribute("aria-haspopup", "true");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", menu.id); // Call ulSub
        button.setAttribute("aria-label", menu.aria);

        const ulSub = document.createElement("ul");
        ulSub.classList.add("dropdown-content");
        ulSub.id = menu.id;

        menu.items.forEach(item => {
            const subLi = document.createElement("li");
            const subBtn = document.createElement("button");
            subBtn.innerText = item;
            
            subLi.appendChild(subBtn);
            ulSub.appendChild(subLi);
        });
        li.appendChild(button);
        li.appendChild(ulSub);
        ul.appendChild(li);
    });
    container.appendChild(ul);
}

function initTopBar() {
    const dropdownButtons = document.querySelectorAll(".dropBtn");

    dropdownButtons.forEach(button => {
        const menuId = button.getAttribute("aria-controls");
        const menu = document.getElementById(menuId);

        // Click toggles dropdown and aria-expanded
        button.addEventListener("click", (e) =>{
            e.preventDefault();
            e.stopPropagation();

            const isOpen = menu.classList.contains("show");
            CloseAllDropdowns();

            if (!isOpen) {
                menu.classList.add("show");
                button.setAttribute("aria-expanded", "true");
            }else {
                // Optional: allow re-click to close
                menu.classList.remove("show");
                button.setAttribute("aria-expanded", "false");
            }
        });
    });

    // Hover behavior: only switch if a menu is already open
    document.querySelectorAll(".dropdown").forEach(item => {
        item.addEventListener("mouseenter", function () {
            const activeDropdown = document.querySelector(".dropdown-content.show");
            if (!activeDropdown) return;

            const newDropdown = this.querySelector(".dropdown-content");
            if (newDropdown && newDropdown !== activeDropdown) {
                CloseAllDropdowns()
                newDropdown.classList.add("show");

                const btn = this.querySelector(".dropBtn");
                if (btn) btn.setAttribute("aria-expanded", "true");
            }
        });
    });

    // Click anywhere else to close dropdown
    document.addEventListener("click", () => {
        CloseAllDropdowns();
    })
}

function CloseAllDropdowns() {
    document.querySelectorAll(".dropdown-content").forEach(menu =>
        menu.classList.remove("show")
    );
    document.querySelectorAll(".dropBtn").forEach(button => {
        button.setAttribute("aria-expanded", "false")
    });
}