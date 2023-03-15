const modeToggle = document.body.querySelector(".mode-toggle"),
sidebar = document.body.querySelector("nav"),
sidebarToggle = document.body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if(getMode && getMode ==="dark"){
document.body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if(getStatus && getStatus ==="close"){
sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () =>{
document.body.classList.toggle("dark");
if(document.body.classList.contains("dark")){
  localStorage.setItem("mode", "dark");
}else{
  localStorage.setItem("mode", "light");
}
});

sidebarToggle.addEventListener("click", () => {
sidebar.classList.toggle("close");
if(sidebar.classList.contains("close")){
  localStorage.setItem("status", "close");
}else{
  localStorage.setItem("status", "open");
}
})