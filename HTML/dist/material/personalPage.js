const addBtn = document.getElementById('addBtn')
const deleteBtn = document.getElementById('deleteBtn')

const firsName = document.getElementById('inputFirstame');
const lastName = document.getElementById('inputLastname');
const job = document.getElementById('inputJob');
const userTypes = document.getElementById('inputUserType');
const entryDate = document.getElementById('inputDate');
const exitDate = document.getElementById('inputExitDate');
const company = document.getElementById('inputCompany');
const username = document.getElementById('inputUsername');
const password = document.getElementById('inputPassword')

const tableBody = document.querySelector('#personalTable tbody')

function addRowTable(firsName, lastName, job, userTypes, status, entryDate, exitDate, company, username, password){      //tabloya veri ekleme
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
    <td><input class="form-check-input" type="checkbox" value=""></td>
    <td>${firsName}</td>
    <td>${lastName}</td>
    <td>${job}</td>
    <td>${userTypes}</td>
    <td>${status}</td>
    <td>${entryDate}</td>
    <td>${exitDate}</td>
    <td>${company}</td>
    <td>${username}</td>
    <td>${password}</td>
    <td><button id="editBtn" class="btn btn-success btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button></td>
    <td><button id="deleteBtn" class="btn btn-danger btn-sm delete-btn" data-bs-toggle="modal">Delete</button></td>
    `;
    tableBody.appendChild(newRow)
}


addBtn.addEventListener('click', function() {
    const firstNameValue = firsName.value;
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
            job_start_date:entryDateValue,
            company_name:companyValue,
            username:usernameValue,
            password1:passwordValue,
            password2:passwordValue
        }
    }).then((response)=>{
        addRowTable(firstNameValue,lastNameValue, jobValue,userTypesValue, "Status", entryDateValue, "", companyValue, usernameValue, passwordValue);
        getJobTitle()
        // clearInput();
    }).catch((error) => {
          console.log(error);
        });

});

function getJobTitle() {
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
        console.log(jobList);
        const jobTitleList = document.getElementById('inputJob')

        jobTitleList.innerHTML = '';

        jobList.forEach((job) => {
            const option = document.createElement('option');

            option.text = job.job_title;
            jobTitleList.appendChild(option);
        });

    }).catch((error) => {
          console.log(error);
        });
}

const getJobTitleId  = async (job_id) => {
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


getJobTitleId();
function clearInput() {
    firsName.value = '';
    lastName.value = '';
    job.value = '';
    userTypes.value = '';
    entryDate.value = '';
    company.value = '';
    username.value = '';
    password.value = '';
};

const personalList = () => {    //backend içindeki personel bilgilerini alma
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
        console.log(personalData)
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
        const job = getJobTitleId().then((job_name) => { return job_name })
        newRow.innerHTML =  `
        <td><input class = "form-check-input" type = "checkbox" value=""</td>
        <td>${item.first_name}</td>
        <td>${item.last_name}</td>
        <td>${await getJobTitleId(item.job_title)}</td>
        <td>${item.user}</td>
        <td class="is_active">${item.is_active}</td>
        <td>${item.job_start_date}</td>
        <td>${item.job_end_date}</td>
        <td>${item.company_name}</td>
        <td>${item.username}</td>
        <td>${item.password}</td>
        <td><button id="editBtn" class="btn btn-success btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button></td>
        <td><button id="deleteBtn" class="btn btn-danger btn-sm delete-btn"  data-bs-toggle="modal">Delete</button></td>
        `;


        tableBody.appendChild(newRow);
        
    })
};

window.addEventListener("load", (event) => {
    personalList();
    getJobTitle();
});

        // const deleteBtn = newRow.querySelector('.delete-btn');
        // deleteBtn.addEventListener('click', function () {
        //     const indexToDelete = this.getAttribute('data-index');
        //     deleteRow(indexToDelete);
        // });
// const situationButton = document.getElementById('situation');
// const isActive = document.querySelectorAll('.is_active')

// situationButton('click',function(){
//     isActive.forEach(data => {
//         data.textContent = data.textContent === 'true' ? 'false' : 'true';
//     });

// })