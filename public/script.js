document.addEventListener('DOMContentLoaded', () => {

    // আপনার নতুন Vercel ব্যাকএ্যান্ড URL
    const BASE_URL = 'https://success-business-9k3r.vercel.app';

    // ১. সাইনআপ / রেজিস্ট্রেশন ফর্ম হ্যান্ডলার
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('regName')?.value.trim();
            const email = document.getElementById('regEmail')?.value.trim();
            const password = document.getElementById('regPassword')?.value.trim();

            try {
                // নতুন লিঙ্ক আপডেট করা হয়েছে
                const res = await fetch(`${BASE_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await res.json();
                alert(data.message);

                if (res.ok && data.success) {
                    // রেজিস্ট্রেশন সফল হলে লগইন ট্যাবে নিয়ে যাওয়া
                    switchTab('login');
                }
            } catch (err) {
                console.error("Register Error:", err);
                alert('সার্ভারে সংযোগ করা যাচ্ছে না।');
            }
        });
    }

    // ২. লগইন ফর্ম হ্যান্ডলার
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('loginEmail')?.value.trim();
            const password = document.getElementById('loginPassword')?.value.trim();

            try {
                // নতুন লিঙ্ক আপডেট করা হয়েছে
                const res = await fetch(`${BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (res.ok && data.success) {
                    alert('লগইন সফল হয়েছে!');
                    window.location.href = '/dashboard.html';
                } else {
                    alert(data.message || 'ইমেইল বা পাসওয়ার্ড ভুল!');
                }
            } catch (err) {
                console.error("Login Error:", err);
                alert('সার্ভারে সংযোগ করা যাচ্ছে না।');
            }
        });
    }
});
