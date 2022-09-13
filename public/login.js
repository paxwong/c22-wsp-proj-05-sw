async function login() {
    const loginForm = document.querySelector('.login-form');
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
        const res = await fetch('/login', {
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
            console.log('login successful')
        }
})}

login()