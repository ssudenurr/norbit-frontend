const addBtn = document.getElementById('addBtn')
const deleteBtn = document.getElementById('deleteBtn')


const fullName = document.getElementById('inputName');
const job = document.getElementById('inputJob');
const entryDate = document.getElementById('inputDate');
const company = document.getElementById('inputCompany');
const username = document.getElementById('inputUsername');
const tableBody = document.querySelector('#personalTable tbody')

function addRowTable(fullName,job,status,entryDate,company,username){


    const newRow = document.createElement('tr');
    newRow.innerHTML = `
    <td><input class="form-check-input" type="checkbox" value=""></td>
    <td>${fullName}</td>
    <td>${job}</td>
    <td>${status}</td>
    <td>${entryDate}</td>
    <td>${company}</td>
    <td>${username}</td>
    `;
    tableBody.appendChild(newRow)
}
addBtn.addEventListener('click', function() {
    const fullNameValue = fullName.value;
    const jobValue = job.value;
    const status = "aktif";
    const entryDateValue = entryDate.value;
    const companyValue = company.value;
    const usernameValue = username.value;

    addRowTable(fullNameValue, jobValue, status, entryDateValue, companyValue, usernameValue);

    fullName.value = '';
    job.value = '';
    entryDate.value = '';
    company.value = '';
    username.value = '';

});



function personalList (){
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
        const personalData = response.data;
        console.log(personalData)
        addPersonal(personalData.results)
    })
    .catch(error => {
        console.error('hata oluştu',error);
    })
}

personalList();

function addPersonal(personalData){
    tableBody.innerHTML = '';

    personalData.forEach(item => {
        const newRow = document.createElement('tr');
        newRow.innerHTML =  `
        <td><input class = "form-check-input" type = "checkbox" value=""</td>
        <td>${item.first_name + ' ' + item.last_name}</td>
        <td>${item.job_title}</td>
        <td class="is_active">${item.is_active}</td>
        <td>${item.date_joined}</td>
        <td>${item.company_name}</td>
        <td>${item.username}</td>
        <td><button id="editBtn" class="btn btn-success btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button></td>
        <td><button id="deleteBtn" class="btn btn-danger btn-sm delete-btn"  data-bs-toggle="modal">Delete</button></td>
        `;

        // const deleteBtn = newRow.querySelector('.delete-btn');
        // deleteBtn.addEventListener('click', function () {
        //     const indexToDelete = this.getAttribute('data-index');
        //     deleteRow(indexToDelete);
        // });
        tableBody.appendChild(newRow);
        
    })
}
const situationButton = document.getElementById('situation');
const isActive = document.querySelectorAll('.is_active')

situationButton('click',function(){
    isActive.forEach(data => {
        data.textContent = data.textContent === 'true' ? 'false' : 'true';
    });

})
window.onload = function () {
    personalList();
}

