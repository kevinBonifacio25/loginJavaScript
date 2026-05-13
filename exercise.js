
const API_URL = "http://localhost:3000/";

let username = document.getElementById("username");
let password = document.getElementById("password");
let loginBtn = document.getElementById("loginBtn");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
   
fetch(API_URL + "usuarios")
    .then(response => response.json())
    .then(usuarios => {
        const user = usuarios.find(u => u.correo === username.value && u.password === password.value);
        if (user) {
            alert("¡Login exitoso!");
            localStorage.setItem("currentUser", JSON.stringify(user));
            window.location.href = "shop.html";
        } else {
            alert("Correo o contraseña inválidos.");
        }
    })
    .catch(error => console.error("Error fetching usuarios:", error));
});
