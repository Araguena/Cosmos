document.addEventListener("DOMContentLoaded", topMenu);

function topMenu() {
    var menuIcon = document.getElementById("js-toggle-menu-button");
    menuIcon.addEventListener("click", toggleMenu);

    var menu = document.getElementById("myTopnav");
    menu.addEventListener("click", hideMenuItems);

    function toggleMenu() {

        if (menu.className === "topnav") {
            menu.className += " responsive";
        } else {
            menu.className = "topnav";
        }
    }

    function hideMenuItems(event) {
        var target = event.target;
        console.log(target);
        if (target.classList.contains("js-hide-menu")) {
            menu.className = "topnav";
        }
    }
}