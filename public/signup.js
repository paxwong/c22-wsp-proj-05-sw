async function signup() {
    const loginForm = document.querySelector('.signup-form');
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
        const referral = event.target.referral.value;
        const res = await fetch('/signup', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password,
                referral
            })
        })
        if (res.ok) {
            alert("Account created successfully")
            location.replace('http://localhost:8080/login.html')
        }
})}

signup()