// swipe
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});


// login js

// async function login() {
//     const loginForm = document.querySelector('.login-form');
//     loginForm.addEventListener('submit', async function (event) {
//         event.preventDefault();
//         const username = event.target.username.value;
//         const password = event.target.password.value;
//         const res = await fetch('/login', {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 username,
//                 password
//             })
//         })
//         if (res.ok) {
//             alert('Login successfully')
//             location.replace('http://localhost:8080/chatroom.html')
//         }
// })}

// login()


// signup js

// async function signup() {
//     const loginForm = document.querySelector('.signup-form');
//     loginForm.addEventListener('submit', async function (event) {
//         event.preventDefault();
//         const username = event.target.username.value;
//         const password = event.target.password.value;
//         const referral = event.target.referral.value;
//         const res = await fetch('/signup', {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 username,
//                 password,
//                 referral
//             })
//         })
//         if (res.ok) {
//             alert("Account created successfully")
//             location.replace('http://localhost:8080/login.html')
//         }
// })}

// signup()