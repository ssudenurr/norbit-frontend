
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

    const company = await getCompanyNameId(userData.id);
    const job = await getJobTitleId(userData.job_title); 
    
    document.getElementById('userNameValue').textContent = userData.username;
    document.getElementById("firstNameValue").textContent = userData.first_name;
    document.getElementById("lastNameValue").textContent = userData.last_name;
    document.getElementById("lastLoginValue").textContent = userData.last_login;
    document.getElementById("emailValue").textContent = userData.email;
    document.getElementById("companyNameValue").textContent = company;
    document.getElementById("userTypeValue").textContent = userData.user_type;
    document.getElementById('job-title').textContent = job;

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
            console.log(companyList)
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
function getJobTitle() {     // GET JOB TİTLE
    const apiUrl= "http://backend.norbit.com.tr/jobs/list/"
    const token  = localStorage.getItem('token');

    axios({
        method:'get',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
    }).then((response)=>{
        const jobList = response.data.results;

        const jobTitleList = document.getElementById('inputJob')

        jobTitleList.innerHTML = '';

        jobList.forEach((job) => {
            const option = document.createElement('option');
            option.value = job.id;
            option.text = job.job_title;
            jobTitleList.appendChild(option);
        });

    }).catch((error) => {
          console.log(error);
        });
}

const getJobTitleId  = async (job_id) => {    // GET JOB TİTLE ID
    const apiUrl= `http://backend.norbit.com.tr/jobs/${job_id}/`
    const token  = localStorage.getItem('token');

    const api = new Promise((resolve, reject) => {
        axios({
            method:'get',
            url:apiUrl,
            headers:{ 
                "Authorization": `Token ${token}`
            },
        }).then((response)=>{
            const jobList = response.data.job_title;
            resolve(jobList)
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


function updateUserInfo() {
    const apiUrl = "http://backend.norbit.com.tr/accounts/user/";
    const token = localStorage.getItem('token');

    const newFirstName = document.getElementById('newFirstName').value;
    const newLastName = document.getElementById('newLastName').value;

    if (newFirstName.trim() === "" || newLastName.trim() === "") {
        window.alert("Alanlar Boş Geçilemez");
        return;
    }        

    const updateData = {
        first_name: newFirstName,
        last_name: newLastName
    };

    axios({
        method: 'patch',
        url: apiUrl,
        headers: {
            "Authorization": `Token ${token}`
        },
        data: updateData
    }).then((response) => {
        const userData = response.data;
        UserDetails(userData);
        
        // Modalı kapat
        const updateModal = document.getElementById('updateModal');
        updateModal.style.display = "none";
    }).catch((error) => {
        console.log(error);
    });
}
document.addEventListener("DOMContentLoaded", function () {
    const updateButton = document.getElementById('updateBtn');
    updateButton.addEventListener('click', function () {
        openUpdateModal();
    });

    function openUpdateModal() {
        const updateModal = document.getElementById('updateModal');
        updateModal.style.display = "block";
    }

    function updateUserInfo() {
        const apiUrl = "http://backend.norbit.com.tr/accounts/user/";
        const token = localStorage.getItem('token');

        const newFirstName = document.getElementById('newFirstName').value;
        const newLastName = document.getElementById('newLastName').value;

        if (newFirstName.trim() === "" || newLastName.trim() === "") {
            window.alert("Alanlar Boş Geçilemez");
            return;
        }        

        const updateData = {
            first_name: newFirstName,
            last_name: newLastName
        };

        axios({
            method: 'patch',
            url: apiUrl,
            headers: {
                "Authorization": `Token ${token}`
            },
            data: updateData
        }).then((response) => {
            const userData = response.data;
            UserDetails(userData);
            
            // Modalı kapat
            const updateModal = document.getElementById('updateModal');
            updateModal.style.display = "none";
        }).catch((error) => {
            console.log(error);
        });
    }

    function UserDetails(userData) {
        document.getElementById("firstNameValue").textContent = userData.first_name;
        document.getElementById("lastNameValue").textContent = userData.last_name;
    }

    const saveChangesBtn = document.getElementById('saveChangesBtn');
    saveChangesBtn.addEventListener('click', function () {
        updateUserInfo();
    });
    document.getElementById('close').addEventListener('click', function() {
        document.getElementById('updateModal').style.display = 'none';
     });
    window.onload = function () {
        getUserInfo();
    };
});
   
window.onload = function () {
    getUserInfo();
    getJobTitle();
    getJobTitleId();
    getCompanyName();  
    getCompanyNameId();
};