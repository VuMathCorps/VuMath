function loadSidebar() {
    fetch('sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
        })
        .catch(error => console.error('Error loading sidebar:', error));
}

document.addEventListener('DOMContentLoaded', loadSidebar);

function openNav() {
    document.getElementById("mySidebar").style.width = "280px";
    document.getElementById("main").style.marginLeft = "280px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}