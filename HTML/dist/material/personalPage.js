const addBtn = document.getElementById('addBtn')
const editButton = document.getElementById('editBtn')
editButton.style.display= 'none'

const firstName = document.getElementById('inputFirstame');
const lastName = document.getElementById('inputLastname');
const job = document.getElementById('inputJob');
const userTypes = document.getElementById('inputUserType');
const entryDate = document.getElementById('inputDate');
const exitDate = document.getElementById('inputExitDate');
const company = document.getElementById('inputCompany');
const username = document.getElementById('inputUsername');
const password = document.getElementById('inputPassword')

const tableBody = document.querySelector('#personalTable tbody')

function addRowTable(firstName, lastName, job, userTypes, status, entryDate, exitDate, company, username, password){      //tabloya veri ekleme
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
    <td><input class="form-check-input" type="checkbox" value=""></td>
    <td>${firstName}</td>
    <td>${lastName}</td>
    <td>${job}</td>
    <td>${userTypes}</td>
    <td>${status}</td>
    <td>${entryDate}</td>
    <td>${exitDate}</td>
    <td>${company}</td>
    <td>${username}</td>
    <td>${password}</td>
    <td><button id="editBtn" class="btn btn-success btn-icon waves-effect waves-light edit-btn"data-user-id='${item.id} data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button></td>
    <td><button class="btn btn-danger btn-icon waves-effect waves-light delete-btn" data-user-id='${item.id} ><i class="ri-delete-bin-5-line"></i></button></td>
    
    `;
    tableBody.appendChild(newRow)

    const deleteBtn = newRow.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function () {
    deleteRow(this);
    });

    const editBtn = newRow.querySelector('.edit-btn');
    editBtn.addEventListener('click', function () {
        window.location.search = '?type=edit'
    editRow(this);
});
}


addBtn.addEventListener('click', function() {  // BUTONA TIKLAYINCA MODAL İÇİNE GİRİLEN BİLGİLERİ TABLOYA EKLEME
    const firstNameValue = firstName.value;
    const lastNameValue = lastName.value;
    const jobValue = job.value;
    const userTypesValue = userTypes.value;
    // const statusValue = 
    const entryDateValue = entryDate.value;
    const companyValue = company.value;
    const usernameValue = username.value;
    const passwordValue = password.value;

    const apiUrl= "http://backend.norbit.com.tr/accounts/registration/"
    const token  = localStorage.getItem('token');
    
   
    const transDate = new Date(entryDateValue)
    axios({
        method:'post',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
        data: {
            first_name:firstNameValue,
            last_name:lastNameValue,
            job_title:jobValue,
            user_type:userTypesValue,
            job_start_date:transDate,
            company_name:companyValue,
            username:usernameValue,
            password1:passwordValue,
            password2:passwordValue
        }
    }).then((response)=>{
        addRowTable(firstNameValue,lastNameValue, jobValue,userTypesValue, "Status", entryDateValue, companyValue, usernameValue, passwordValue);
        getJobTitle();
        getCompanyName();
        clearInput();
    }).catch((error) => {
          console.log(error);
        });

});

function clearInput() {  // MODAL İÇİNE BİLGİ GİRİLİP ADD BUTONUNA BASILINCA KUTULARI TEMİZLEME
    firstName.value = '';
    lastName.value = '';
    job.value = '';
    userTypes.value = '';
    entryDate.value = '';
    company.value = '';
    username.value = '';
    password.value = '';
};

const deleteRow = async(delete_button) =>{     // iLGİLİ SATIRI SİLME

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
            resolve(dataList)
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

function getRowData(userId){ 

    userId = userId.getAttribute('data-user-id');
    const apiUrl = `http://backend.norbit.com.tr/ems/employee/${userId}/`;
    const token  = localStorage.getItem('token');
        axios({
            method:'get',
            url:apiUrl,
            headers:{ 
                "Authorization": `Token ${token}`
            },
        })
        .then((response)=>{
            const userData = response.data
            console.log(userData)

            const nameData = userData.first_name;
            const surnameData = userData.last_name;
            const entryData = userData.job_start_date;
            const jobData = userData.job_title;
            const companyData = userData.company_name;
            const typeData = userData.user;
            const userNameData = userData.username;
            const passwordData = userData.password;

            firstName.value = nameData;
            lastName.value = surnameData;
            entryDate.value = entryData;
            job.value = jobData;
            company.value = companyData;
            userTypes.value = typeData;
            username.value = userNameData;
            password.value = passwordData;

        }).catch((error) => {
            console.error(`Edit button clicked for user with ID: ${userId}`)
        });

}
editButton.addEventListener('click',function(){
    editRow
})
function editRow(userId){ 

    userId = userId.getAttribute('data-user-id');
    const apiUrl = `http://backend.norbit.com.tr/ems/employee/${userId}/`;
    const token  = localStorage.getItem('token');

    const newFirstName = document.getElementById('inputFirstame');
    const newLastName = document.getElementById('inputlastame');
    const newEntryDate = document.getElementById('inputDate');
    const newjob = document.getElementById('inputJob');
    const newCompany = document.getElementById('inputCompany');
    const newUserType = document.getElementById('inputUserType');
    const newUsername = document.getElementById('inputUsername');

        axios({
            method:'patch',
            url:apiUrl,
            headers:{ 
                "Authorization": `Token ${token}`
            },
            data:{
                first_name:newFirstName,
                last_name:newLastName,
                job_start_date:newEntryDate,
                job_title:newjob ,
                company_name:newCompany,
                user:newUserType ,
                username:newUsername,
        
            }
        })
        .then((response)=>{
            const userData = response.data
            console.log(userData)

            getRowData(nameData,surnameData,entryData,jobData,companyData,typeData,userNameData,passwordData)

            // const nameData = userData.first_name;
            // const surnameData = userData.last_name;
            // const entryData = userData.job_start_date;
            // const jobData = userData.job_title;
            // const companyData = userData.company_name;
            // const typeData = userData.user;
            // const userNameData = userData.username;
            // const passwordData = userData.password;


        }).catch((error) => {
            console.error(`Edit button clicked for user with ID: ${userId}`)
        });

}

            // firstName.value = nameData;
            // lastName.value = surnameData;
            // entryDate.value = entryData;
            // job.value = jobData;
            // company.value = companyData;
            // userTypes.value = typeData;
            // username.value = userNameData;
            // password.value = passwordData;

            
            // userData.first_name.value = nameData;
            // userData.last_name.value = surnameData;
            // userData.job_start_date = entryData;
            // userData.job_title = jobData;
            // userData.company_name = companyData;
            // userData.user = typeData;
            // userData.username = userNameData;
            // userData.password = passwordData;
const personalList = () => {    // APİDEN GELEN KİŞİ BİLGİLERİNİ ALMA 
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

        addPersonal(personalData)
    })
    .catch(error => {
        console.error('hata oluştu',error);
    })
};

const addPersonal = async (personalData) => {
    tableBody.innerHTML = '';
    // <td class="is_active">${item.is_active}</td>
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
        <td class="is_active">${item.is_active}</td>
        <td>${item.job_start_date}</td>
        <td>${item.job_end_date}</td>
        <td>${company}</td>
        <td>${item.username}</td>
        <td>${item.password}</td>
        <td><button id="editBtn" class="btn btn-success btn-sm edit-btn"  data-user-id='${item.id}' data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button></td>
        <td><button class="btn btn-danger btn-sm delete-btn" data-user-id='${item.id}'>Delete</button></td>
        `;

        tableBody.appendChild(newRow);
        const deleteBtn = newRow.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function () {
            deleteRow(this);
        });

        const editBtn = newRow.querySelector('.edit-btn');
        editBtn.addEventListener('click', function () {
            addBtn.style.display = 'none'
            editButton.style.display = 'block'
            getRowData(this);

        });
    });
};    




function getJobTitle() {     // ÇALIŞAN ÜNVANLARINI ALMA
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

const getJobTitleId  = async (job_id) => {    //ÜNVANLARIN İD DEĞERLERİNİ ALMA 
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

function getCompanyName() {      // ŞİRKET İSİMLERİNİ ALMA
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
        console.log(companyData)
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

const getCompanyNameId  = async (id) => {    // ŞİRKET İSİMLERİNİN İD DEĞERLERİNİ ALMA 
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



window.addEventListener("load", (event) => {
    personalList();
    getJobTitle();
    getJobTitleId();
    getCompanyName();
    getCompanyNameId();
});


// const situationButton = document.getElementById('situation');
// const isActive = document.querySelectorAll('.is_active')

// situationButton('click',function(){
//     isActive.forEach(data => {
//         data.textContent = data.textContent === 'true' ? 'false' : 'true';
//     });

// })