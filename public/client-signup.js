// swipe
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('back');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});
//signup
async function signup() {
    const loginForm = document.querySelector('.signup-form');
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
        const res = await fetch('/signup/client', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        if (res.ok) {
            alert("Account created successfully")
            location.replace('/loginsignup.html')
        }
    })
}

signup()