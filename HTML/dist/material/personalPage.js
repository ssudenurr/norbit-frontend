const addBtn = document.getElementById('addBtn')
const deleteBtn = document.getElementById('deleteBtn')


const fullName = document.getElementById('inputName');
const job = document.getElementById('inputJob');
const entryDate = document.getElementById('inputDate');
const company = document.getElementById('inputCompany');
const username = document.getElementById('inputUsername');


function addRowTable(fullName,job,status,entryDate,company,username){
    const tableBody = document.querySelector('#personalTable tbody')

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




