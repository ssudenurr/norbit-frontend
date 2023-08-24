
document.addEventListener("DOMContentLoaded", function () {
userControl();
  // loginForm.addEventListener("submit", function (event) {
  //   event.preventDefault();
  //   const username = usernameInput.value;
  //   const password = passwordInput.value;

  //   if (username.trim() === "" || password.trim() === "") {
  //     window.alert("Kullanıcı adı ve şifre boş geçilemez");
  //     return;
  //   }

  //   const data = {
  //     username: username,
  //     password: password,
  //   };

  // });
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password-input");
  const loginBtn = document.getElementById('loginBtn');  

  loginBtn.addEventListener('click', function (e) {
    e.preventDefault();
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

      if (status==200){     
        const userToken = response.data.key;
        localStorage.setItem('token',userToken);
        window.location.href = "homePage.html" 
      }

    }).catch((error) => {
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
