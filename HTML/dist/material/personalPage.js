
const addRowButton = document.getElementById('add-btn');
const modaltitle = document.getElementById('exampleModalLabel');

const firstName = document.getElementById('inputFirstame');
const lastName = document.getElementById('inputLastname');
const job = document.getElementById('inputJob');
const userTypes = document.getElementById('inputUserType');
const entryDate = document.getElementById('inputDate');
const exitDate = document.getElementById('inputExitDate');
const company = document.getElementById('inputCompany');
const username = document.getElementById('inputUsername');
const password = document.getElementById('inputPassword');

const tableBody = document.querySelector('#personalTable tbody');
const modalButtonBox = document.getElementById('button-box');

const inputExitDate = document.getElementById('input-exit-date');

addRowButton.addEventListener('click', () => {
    clearInput();
    inputExitDate.style.display = 'none';
    modalButtonBox.innerHTML += `
    <button type="button" class="btn btn-primary" id="row-add-btn" onclick='createPersonel()'>Ekle</button>
    `;
});



const closeBtn = document.getElementById('btn-close');
closeBtn.addEventListener('click', () => {
    modalButtonBox.innerHTML = ''
})

async function createEditButton(userId){ 
    document.getElementById('job-date').style.display = 'none'
    inputExitDate.style.display = 'block'
    modalButtonBox.innerHTML += `
        <button type="button" class="btn btn-primary" id="row-edit-btn" onclick='editPersonel(${userId})'>Düzenle</button>
    `;   

    modaltitle.innerHTML = "Personel Düzenleme Formu"
    getRowData(userId)
}

function createPersonel(){ // CREATE NEW PERSONAL

    const apiUrl= "http://backend.norbit.com.tr/accounts/registration/"
        const token  = localStorage.getItem('token');
        
       
        const transDate = new Date(entryDate);

        const year = transDate.getFullYear();
        const month = transDate.getMonth();
        const day = transDate.getDay();
        const fullDate = `${year}-${month < 10 ? `0${month}` : month }-${day < 10 ?  `0${day}` : day}`;
        axios({
            method:'post',
            url:apiUrl,
            headers:{ 
                "Authorization": `Token ${token}`
            },
            data: {
                first_name:firstName.value,
                last_name:lastName.value,
                job_title:job.value,
                user_type:userTypes.value,
                job_start_date:fullDate,
                company_name:company.value,
                username:username.value,
                password1:password.value,
                password2:password.value,
            }
        }).then((response)=>{

            getJobTitle();
            getCompanyName();
            clearInput();
            window.location.reload();
        }).catch((error) => {
              console.log(error);
            });
    


}

function getModalValues(){   // GET MODAL INPUT VALUES
    const data = {
        "firstName": firstName.value,
        "lastName": lastName.value,
        "job": job.value,
        "userType" : userTypes.value,
        "entryDate": entryDate.value,
        "exitDate":exitDate.value,
        "company": company.value,
        "username": username.value,
        // "password": password.value
    }
    return data;

}

function clearInput() {  // CLEAR VALUE
    firstName.value = '';
    lastName.value = '';
    job.value = '';
    userTypes.value = '';
    entryDate.value = '';
    company.value = '';
    username.value = '';
    // password.value = '';
};

const deleteRow = async(delete_button) =>{     // DELETE TO PERSONAL

    userId = delete_button.getAttribute('data-user-id');
    const apiUrl = `http://backend.norbit.com.tr/ems/employee/${userId}/`;
    const token  = localStorage.getItem('token');

    const api = new Promise((resolve, reject) => {
        axios({
            method:'delete',
            url:apiUrl,
            headers:{ 
                "Authorization": `Token ${token}`
            },
        }).then((response)=>{
            console.log(response.data)
            if (response.status === 204) {

                window.location.reload();
               
            } else {
                console.error('Satır silinemedi.');
            }
            //resolve(dataList)
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
}

function getRowData(userId){ // GET CURRENT ROW USER'S DATA 
    const apiUrl = `http://backend.norbit.com.tr/ems/employee/${userId}/`;
    const token  = localStorage.getItem('token');
        axios({
            method:'get',
            url:apiUrl,
            headers:{ 
                "Authorization": `Token ${token}`
            },
        })
        .then( async (response)=>{
            const userData = response.data;
            console.log(userData)
            const nameData = userData.first_name;
            const surnameData = userData.last_name;
            const exitData = userData.job_end_date;
            const jobData = userData.job_title;
            const companyData = userData.company_name;
            const typeData = userData.user;
            const userNameData = userData.username;

            const transDate = new Date(exitData);

            const year = transDate.getFullYear();
            const month = transDate.getMonth();
            const day = transDate.getDay();
            const fullDate = `${year}-${month < 10 ? `0${month}` : month }-${day < 10 ?  `0${day}` : day}`;
            console.log(fullDate)

            firstName.value = nameData;
            lastName.value = surnameData;
            exitDate.value = fullDate;
            job.value = jobData;
            company.value = companyData;
            userTypes.value = typeData;
            username.value = userNameData;


        }).catch((error) => {
            console.error(`Edit button clicked for user with ID: ${userId}`)
        });

}

function editPersonel(userID){ // EDİT PERSONAL DATA
    const apiUrl = `http://backend.norbit.com.tr/ems/employee/${userID}/`; 
    const token  = localStorage.getItem('token');

    const newFirstName = document.getElementById('inputFirstame');
    const newLastName = document.getElementById('inputLastname');
    const newExitDate = document.getElementById('inputExitDate');
    const newjob = document.getElementById('inputJob');
    const newCompany = document.getElementById('inputCompany');
    const newUserType = document.getElementById('inputUserType');
    const newUsername = document.getElementById('inputUsername');
    const newPassword = document.getElementById('inputPassword')
        axios({
            method:'patch',
            url:apiUrl,
            headers:{ 
                "Authorization": `Token ${token}`
            },
            data:{
                first_name:newFirstName.value,
                last_name:newLastName.value,
                job_title:newjob.value,
                user:newUserType.value,
                job_end_date:new Date(newExitDate.value),
                company_name:newCompany.value,               
                password1:newPassword.value,
                password2:newPassword.value,
        
            }
        })
        .then((response)=>{
            // const userData = response.data
            window.location.reload();   

        }).catch((error) => {
            console.error(error)
        });

}
            
const personalList = () => {    // GETTING CONTACT INFORMATION FROM API
    const apiUrl = "http://backend.norbit.com.tr/ems/list/";
    const token  = localStorage.getItem('token');
       
    axios({                                          
        method: 'get',
        url: apiUrl,
        headers: {
            "Authorization": `Token ${token}`
        }
    })
    .then(response =>{
        const personalData = response.data.results;

        showPersonal(personalData)
    })
    .catch(error => {
        console.error('hata oluştu',error);
    })
};

const showPersonal = async (personalData) => {
    tableBody.innerHTML = '';
    personalData.forEach(async  item => {
        const newRow = document.createElement('tr');
        const job = await getJobTitleId(item.job_title); 
        const company = await getCompanyNameId(item.company_name);
        newRow.innerHTML =  `
        <td><input class = "form-check-input" type = "checkbox" value=""</td>
        <td>${item.first_name}</td>
        <td>${item.last_name}</td>
        <td>${job}</td>
        <td>${item.user}</td>
        <td>${item.job_start_date}</td>
        <td>${item.job_end_date}</td>
        <td>${company}</td>
        <td>${item.username}</td>
        <td><button id="editBtn" class="btn btn-success btn-sm edit-btn" onclick='createEditButton(${item.id})' data-user-id='${item.id}' data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button></td>
        <td><button class="btn btn-danger btn-sm delete-btn" data-user-id='${item.id}'>Delete</button></td>
        `;
        editClickFunction();
        tableBody.appendChild(newRow);
        const deleteBtn = newRow.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function () {
            deleteRow(this);
        });

    });
};    
const editClickFunction = async () =>{
    const editButtons = document.querySelectorAll('edit-btn');
    
    editButtons.forEach( async (editBtn) => {
        const loginnedUserId = await getUserInfoId()
        editBtn.addEventListener('click', (event) => {
            const userId = event.currentTarget.getAttribute('data-user-id');

            if(loginnedUserId==userId){
                editPersonel(userId);
            }else {
                console.log('You are not authorized to delete this item.');
            }
        });
    })
}

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
            const option = document.createElement('option');
            option.value = company.id;
            option.text = company.company_name;
            companyList.appendChild(option);
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



window.addEventListener("load", (event) => {
    personalList();
    getJobTitle();
    getJobTitleId();
    getCompanyName();
    getCompanyNameId();


});

const getUserInfoId = async () => { //GİRİŞ YAPAN KİŞİNİN BİLGİLERİ
    const apiUrl= "http://backend.norbit.com.tr/accounts/user/"
    const token  = localStorage.getItem('token');
    const api = new Promise((resolve, reject) => {
        axios ({
            method:'get',
            url: apiUrl,
            headers: {
                "Authorization": `Token ${token}`
            },
        }).then((response)=>{
            const loginId = response.data.id;
            resolve(loginId);

        }).catch((error) => {
            reject(error);
            });
    });

    try{
        const res = await api;
        return res;
    }
    catch (e){
        console.log(loginId)
    }
    
}
getUserInfoId();
// const searchBtn = document.getElementById('search-btn')
// const searchBox = document.getElementById('search-box')

// searchBtn.addEventListener('click', (event) => {
// event.preventDefault();
//     const searchTerm = searchBox.value.trim();
//     makeSearch(searchTerm);
// });
// function makeSearch(searchTerm){

//     const rows = document.querySelectorAll('#personalTable tbody tr');  
//     rows.forEach((personal) => {

//         const searchText = personal.textContent.toLowerCase();

//         if(searchText.includes(searchTerm.toLowerCase())){
//             personal.style.display = 'table-row';

//         }else{
            
//             personal.style.display = 'none';
//         }

//         // if(searchBox.value=''){
//         //     personal.style.display = 'table-row';
//         // }
//     });
// }
// function getUserType(){
//     const apiUrl= "http://backend.norbit.com.tr/accounts/user/"
//     const token  = localStorage.getItem('token');

//     axios ({
//         method:'get',
//         url: apiUrl,
//         headers: {
//             "Authorization": `Token ${token}`
//         },
//     }).then((response)=>{
//         const userType = response.data.user_type;
//         if (userType === "NormalUser") {
//             console.log(userType);
//             addRowButton.disabled = true; 
//         } else {
//             addRowButton.disabled = false;
//         }
        
//     }).catch((error) => {
//         console.log(error);
//     });
// }
// getUserType();

// const situationButton = document.getElementById('situation');
// const isActive = document.querySelectorAll('.is_active')

// situationButton('click',function(){
//     isActive.forEach(data => {
//         data.textContent = data.textContent === 'true' ? 'false' : 'true';
//     });

// })