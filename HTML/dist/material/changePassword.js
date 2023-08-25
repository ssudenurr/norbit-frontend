
const changePassword = document.getElementById('changePassword')

changePassword.addEventListener('click',function(e){
    e.preventDefault();
    const username = document.getElementById('username')
    const password = document.getElementById("password-input");

    const apiUrl = "http://backend.norbit.com.tr/accounts/password/change/";
    const token = localStorage.getItem('token');

    const data = {
        new_password: password
    };

    axios({
        method:'patch',
        url:apiUrl,
        data:data,
        headers: {
            "Authorization": `Token ${token}`
        },
    }) .then(response => {
        console.log('Şifre değiştirildi', response.data);

    }).catch(error => {
        console.error('Hata oluştu', error);
    });

})