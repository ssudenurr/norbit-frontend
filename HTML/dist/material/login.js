
document.addEventListener("DOMContentLoaded", function () {
userControl();


  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password-input");
  const loginBtn = document.getElementById('loginBtn');  

  loginBtn.addEventListener('click', function (e) {
    e.preventDefault();

    const usernameValue = usernameInput.value;
    const passwordValue = passwordInput.value;

    if (usernameValue.trim() === "" || passwordValue.trim() === "") {
      window.alert("Kullanıcı adı ve şifre boş geçilemez");
      return;
    } 
    const usersApiUrl = "http://backend.norbit.com.tr/accounts/login/";
    
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

function userControl() {
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = "homePage.html";
  }

}
