document.addEventListener("DOMContentLoaded", topMenu);

function topMenu() {

    var menuIcon = document.getElementById("toggleIcon");

    menuIcon.addEventListener("click", toggleMenu);

    function toggleMenu() {
        var navigationMenu = document.getElementById("myTopnav");
        if (navigationMenu.className === "topnav") {
            navigationMenu.className += " responsive";
        } else {
            navigationMenu.className = "topnav";
        }
    }
}