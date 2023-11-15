
document.getElementById('closeBtn').addEventListener('click', function() {
    document.getElementById('passwordModal').style.display = 'block';
 });
 
document.getElementById('submitPassword').addEventListener('click', function() {
    const newPassword1 = document.getElementById('newPassword1').value; // .value eklendi
    const newPassword2 = document.getElementById('newPassword2').value; // .value eklendi

    if (newPassword1 !== newPassword2) {
        window.alert("Şifreler Eşleşmiyor");
        return;
    }

    const apiUrl = `${baseUrl}accounts/password/change/`;
    const token = localStorage.getItem('token');

    const data = {
        new_password1: newPassword1,
        new_password2: newPassword2
    };

    axios({
        method: 'post',
        url: apiUrl,
        data: data,
        headers: {
            "Authorization": `Token ${token}`
        }
    })
    .then(response => {
        console.log('Şifre değiştirildi', response.data);
        // Başarılı bildirim sağlayabilirsiniz
    })
    .catch(error => {
        console.error('Hata oluştu', error);
        // Hata bildirimi sağlayabilirsiniz
    });

    // Modal'ı kapat
    document.getElementById('passwordModal').style.display = 'none';
});
