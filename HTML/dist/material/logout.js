const logout = document.getElementById('logout')

logout.addEventListener('click',function(){
    localStorage.removeItem('token');
    window.location.href = "index.html";
        // window.location.href = "index.html";
})