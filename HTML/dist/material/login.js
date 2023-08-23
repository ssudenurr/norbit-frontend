userControl();
document.addEventListener("DOMContentLoaded", function () {

  // loginForm.addEventListener("submit", function (event) {
  //   event.preventDefault();

  //   const email = emailInput.value;
  //   const password = passwordInput.value;

  //   if (email.trim() === "" || password.trim() === "") {
  //     window.alert("Email ve şifre boş geçilemez");
  //     return;
  //   }

  //   const data = {
  //     email: email,
  //     password: password,
  //   };

  //   const apiUrl = "https://backend.fidauth.com/accounts/user/";

  //   axios
  //     .post(apiUrl, data)
  //     .then((response) => {
  //       console.log(JSON.stringify(response.data));
        
  //       // Kullanıcı girişi başarılı ise users.html sayfasına yönlendir
  //       window.location.href = "users.html";
  //     })
  //     .catch(function (error) {
  //       window.alert("API error:", error);
  //       // Handle API request errors here
  //     });
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
