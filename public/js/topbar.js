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
        hidePriority: 1
    },
    {
        label: "⚙️",
        aria: "Settings menu",
        id: "settingsMenu",
        items: ["Client mode", "Dark mode"],
        hidePriority: 2
    },
    {
        label: "External Forces",
        aria: "External force calculations",
        id: "ExternalForce",
        items: ["Seismic Load", "Wind Load"],
        hidePriority: 3
    },
    {
        label: "Design Tools",
        aria: "Structural design tools",
        id: "DesignTools",
        items: ["Steel Beam", "Steel Column"],
        hidePriority: 4
    },
    {
        label: "Code Navigator",
        aria: "Navigate building codes and regulations",
        id: "RegulatoryNavi",
        items: ["Steel Beam", "Steel Column"],
        hidePriority: 5
    },
    {
        label: "Quantity Estimator",
        aria: "Material quantity and cost estimation",
        id: "QuantityCal",
        items: ["New Sheet", "Export to Excel"],
        hidePriority: 6
    },
    {
        label: "Message Board",
        aria: "User message board or feedback area",
        id: "MessageWall",
        items: [],
        hidePriority: 7
    },
    {
        label: "About",
        aria: "About the author and feedback options",
        id: "QAboutAuthor",
        items: ["Author", "Report an Issue"],
        hidePriority: 8
    },

];
/* Default */
renderMenu(".topBarWrapper");
initTopBar();

window.addEventListener("resize", () => {
    renderMenu(".topBarWrapper");
    initTopBar();
});


/* 
    The structure of navigation is:
        <ul>
            <li class="dropdown">
                <button class="dropBtn"></button>
                <ul class="dropdown-content">
                    <li>
                        <button></button>
                    </li>
                    ... sub menu's button
                </ul>
            </li>
            ...other button
        </ul>
*/
function createMenuItem(menu, overflow = false) {
    const li = document.createElement("li");
    li.classList.add(overflow ? "has-submenu" : "dropdown");

    const button = document.createElement("button");
    button.classList.add("dropBtn");
    button.innerText = menu.label;
    button.setAttribute("aria-haspopup", "true");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", menu.id || ""); // Call subUl
    button.setAttribute("aria-label", menu.aria || "");

    const subUl = document.createElement("ul");
    if (overflow) {
        subUl.classList.add("dropdown-submenu", "left");
    } else {
        subUl.classList.add("dropdown-content");
    }
    subUl.id = menu.id;

    menu.items.forEach(item => {
        const subLi = document.createElement("li");
        const subBtn = document.createElement("button");
        subBtn.innerText = item;
        subLi.appendChild(subBtn);
        subUl.appendChild(subLi);
    });

    li.appendChild(button);
    li.appendChild(subUl);
    return li;
}


function renderMenu(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.innerHTML = ""; // Clear old content

    const ul = document.createElement("ul");

    // Determine how many to show based on screen size
    let visibleCount = 8;
    if (window.innerWidth < 600) {
    visibleCount = 2;
    } else if (window.innerWidth < 888) {
    visibleCount = 4;
    } else if (window.innerWidth < 1050) {
    visibleCount = 6;
    } else {
    visibleCount = 8; 
    }

    let count = 0;
    const overflowMenu = [];

    sharedMenus.forEach( menu => {
        if (menu.type === "logo") {
            const logoLi = document.createElement("li");
            const logoLink = document.createElement("a");
            logoLink.href = menu.href || "#";
            logoLink.classList.add(menu.class || "logo-img");
            logoLi.appendChild(logoLink);
            ul.appendChild(logoLi);
            return;
        }

        if (count < visibleCount) {
            ul.appendChild(createMenuItem(menu));
        } else {
            overflowMenu.push(createMenuItem(menu, true));
        }
        count ++;
    });

    // Add overflow toggle
    if (overflowMenu.length > 0) {
        const li = document.createElement("li");
        li.classList.add("dropdown");

        const btn =document.createElement("button");
        btn.innerText = "☰";
        btn.classList.add("dropBtn");
        btn.setAttribute("aria-haspopup", "true");
        btn.setAttribute("aria-expanded", "false");
        btn.setAttribute("aria-label", "Toggle overflow");
        btn.setAttribute("aria-controls", "burgerMenu");

        const subUl = document.createElement("ul");
        subUl.classList.add("dropdown-content");
        subUl.id = "burgerMenu"; 
        overflowMenu.forEach(el => subUl.appendChild(el));

        li.appendChild(btn);
        li.appendChild(subUl);
        ul.appendChild(li);
    }
    container.appendChild(ul);
}

function initTopBar() {
    const dropdownButtons = document.querySelectorAll(".dropBtn");

    dropdownButtons.forEach(button => {
        const menuId = button.getAttribute("aria-controls");
        let menu = document.getElementById(menuId);



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
            const currentDropdown = this.querySelector(".dropdown-content");
            const isInsideBurger = this.closest("#burgerMenu");

            // If hovering inside an open menu (like the burger), don’t auto-close
            if (isInsideBurger) {
            // 💡 Inside burger: Close all submenus in burger, then show current
            const allSubmenus = isInsideBurger.querySelectorAll(".dropdown-content, .dropdown-submenu");
            allSubmenus.forEach(menu => menu.classList.remove("show"));
            const allButtons = isInsideBurger.querySelectorAll(".dropBtn");
            allButtons.forEach(btn => btn.setAttribute("aria-expanded", "false"));

            currentDropdown?.classList.add("show");
            const btn = this.querySelector(".dropBtn");
            if (btn) btn.setAttribute("aria-expanded", "true");
            return;
        }

        // 💡 Outside burger: default hover logic
        const activeDropdown = document.querySelector(".dropdown-content.show");
        if (!activeDropdown) return;

        if (currentDropdown && currentDropdown !== activeDropdown) {
            CloseAllDropdowns();
            currentDropdown.classList.add("show");

            const btn = this.querySelector(".dropBtn");
            if (btn) btn.setAttribute("aria-expanded", "true");
        }
        });
    });

    const burgerMenu = document.getElementById("burgerMenu");
    if (burgerMenu) {
        burgerMenu.addEventListener("mouseleave", () => {
            const submenus = burgerMenu.querySelectorAll(".dropdown-content");
            submenus.forEach(menu => menu.classList.remove("show"));
            const buttons = burgerMenu.querySelectorAll(".dropBtn");
            buttons.forEach(btn => btn.setAttribute("aria-expanded", "false"));
        });
    }


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