export function logout() {
    const logoutBtn = document.querySelector('.js-logout-button');
    function setButtonLoading(btn, loading) {
      if (loading) {
        btn.disabled = true;
        btn._originalText = btn._originalText || btn.textContent;
        btn.innerHTML = '<span class="btn-spinner"></span>';
      } else {
        btn.disabled = false;
        if (btn._originalText) btn.textContent = btn._originalText;
      }
    }
    logoutBtn.addEventListener('click', async () => {
      setButtonLoading(logoutBtn, true);
      try {
        const res = await fetch('https://nilemarketfinalbackend.onrender.com/logout', {
          method: 'GET',
          credentials: 'include'
        });

        if (res.ok) {
          // remove any lingering token from storage
          localStorage.removeItem('accessToken');
          window.location.href = 'index.html';
          return;
        }

        console.error('Logout failed', res.status, res.statusText);
      } catch (err) {
        console.error(err);
      } finally {
        setButtonLoading(logoutBtn, false);
      }
    });
}