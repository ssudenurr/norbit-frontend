/*İNPUT ALANLARINDAKİ BİLGİYİ BACKEND DE KAYITLI BİLGİLERLE
 KARŞILAŞTIRIP KULLANICI GİRİŞİ SAĞLAR */
document.addEventListener("DOMContentLoaded", function () {
// userControl();
    const baseUrl = "https://backend.norbit.com.tr:9999/";

  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password-input");
  const loginBtn = document.getElementById('loginBtn'); 
  loginBtn.addEventListener('click', function (e) {
    e.preventDefault();

    const usernameValue = usernameInput.value;
    const passwordValue = passwordInput.value;

    if (usernameValue.trim() === "" || passwordValue.trim() === "") { //EĞER İNPUT ALANLARI BOŞSA UYARI VER
      window.alert("Kullanıcı adı ve şifre boş geçilemez");
      return;
    } 
    const usersApiUrl = `${baseUrl}accounts/login/`;
    
    axios({
      method: 'post',
      url: usersApiUrl,
      data: {
        "username": usernameInput.value,
        "password": passwordInput.value,
      },

    }).then((response) => {

      const status = response.status;

      if (status===200){     
        const userToken = response.data.key;
        localStorage.setItem('token',userToken);
        window.location.href = "homePage.html" 
      }

    }).catch((error) => {
      if (error.response) {
        if (error.response.status === 400 || error.response.status === 401) {
          window.alert("Kullanıcı adı veya şifre yanlış");
        }
      }
      console.log(error);
    });
  });

})

// const sendEmail = document.getElementById('send-email');
// const userEmail = document.getElementById('email').value;
// sendEmail.addEventListener('click', () => {
//   const apiUrl = `${baseUrl}accounts/password/reset/`
//   const token = localStorage.getItem('token');

// axios({
//   method:'post',
//   url:apiUrl,
//   headers:{ 
//     "Authorization": `Token ${token}`
//     },
//     data: {
//       email: userEmail,
//     },
// }).then((response) => {
//   console.log('Password reset email sent successfully');
// }).catch((error) => {
//   console.log('Error sending password reset email:', error);
// })
// });
