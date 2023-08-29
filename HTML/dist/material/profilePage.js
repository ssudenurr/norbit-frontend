
function getUserInfo(){
    const apiUrl= "http://backend.norbit.com.tr/accounts/user/"
    const token  = localStorage.getItem('token');

axios ({
    method:'get',
    url: apiUrl,
    headers: {
        "Authorization": `Token ${token}`
    },
}).then((response)=>{
    const userData = response.data;
    userDetails(userData);
    console.log(userData)
}).catch((error) => {
      console.log(error);
    });
}
function userDetails(userData){
    document.getElementById('userNameValue').textContent = userData.username;
    document.getElementById("firstNameValue").textContent = userData.first_name;
    document.getElementById("lastNameValue").textContent = userData.last_name;
    document.getElementById("lastLoginValue").textContent = userData.last_login;
    document.getElementById("emailValue").textContent = userData.email;
    document.getElementById("companyNameValue").textContent = userData.company_name;
    document.getElementById("userTypeValue").textContent = userData.user_type;
}

window.onload = function () {
    getUserInfo();

};