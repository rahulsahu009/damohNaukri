// auth.js (Updated Code)
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('form');
    const signupButton = document.querySelector('.signup-btn');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            signupButton.textContent = 'Creating Account...';
            signupButton.disabled = true;

            const fullName = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const mobile = document.getElementById('mobile').value;
            const qualification = document.getElementById('qualification').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                signupButton.textContent = 'Signup';
                signupButton.disabled = false;
                return;
            }

            try {
                //  <<<<<<<<<<<<<<<<<< यहाँ बदलाव किया गया है >>>>>>>>>>>>>>>>
                // URL को आपकी फाइल के नाम 'candidateSignup.js' से मैच कर दिया गया है
                const response = await fetch('/.netlify/functions/candidateSignup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        full_name: fullName,
                        email: email,
                        mobile: mobile,
                        qualification: qualification,
                        password: password,
                    }),
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result.message);
                    window.location.href = '/login.html';
                } else {
                    alert("Error: " + result.error);
                }

            } catch (error) {
                console.error('Submission error:', error);
                alert('An error occurred. Please try again.');
            } finally {
                signupButton.textContent = 'Signup';
                signupButton.disabled = false;
            }
        });
    }
});