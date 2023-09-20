
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
async function userDetails(userData){

    const company = await getCompanyNameId(userData.company_name);
    
    document.getElementById('userNameValue').textContent = userData.username;
    document.getElementById("firstNameValue").textContent = userData.first_name;
    document.getElementById("lastNameValue").textContent = userData.last_name;
    document.getElementById("lastLoginValue").textContent = userData.last_login;
    document.getElementById("emailValue").textContent = userData.email;
    document.getElementById("companyNameValue").textContent = company;
    document.getElementById("userTypeValue").textContent = userData.user_type;

}
function getCompanyName() {      // GET COMPANY NAME
    const apiUrl= "http://backend.norbit.com.tr/company/list/"
    const token  = localStorage.getItem('token');

    axios({
        method:'get',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
    }).then((response)=>{
        const companyData = response.data.results;

        const companyList = document.getElementById('inputCompany')
        companyList.innerHTML = '';

        companyData.forEach((company) => {
            const companyName = document.getElementById("companyNameValue");
            companyName.text = company.company_name;

        });

    }).catch((error) => {
          console.log(error);
        });
}
const getCompanyNameId  = async (id) => {    // GET COMPANY NAME ID
    const apiUrl= `http://backend.norbit.com.tr/company/${id}/`
    const token  = localStorage.getItem('token');

    const api = new Promise((resolve, reject) => {
        axios({
            method:'get',
            url:apiUrl,
            headers:{ 
                "Authorization": `Token ${token}`
            },
        }).then((response)=>{
            const companyList = response.data.company_name;
            resolve(companyList)
        }).catch((error) => {
            reject("null")
        });
    });

    try {
        const response = await api;
        return response;
    }
    catch (e) {
        return e
    }
};

window.onload = function () {
    getUserInfo();
    getCompanyName();  
    getCompanyNameId();
};