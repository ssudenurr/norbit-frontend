
const addBtn = document.getElementById('addBtn')

const personName = document.getElementById('personName')
const account = document.getElementById('account')
const productName = document.getElementById('productName');
const price = document.getElementById('price');
const count = document.getElementById('count')
const link = document.getElementById('link');
const purchasingDate = document.getElementById('purchasingDate')
const description = document.getElementById('description');


const modalContent = document.getElementById('modalContent');

function addRowTable(personNameValue,accountValue,productNameValue,priceValue,countValue,linkValue,purchasingValue,descriptionValue){
    const tableBody = document.querySelector('#purchaseTable tbody')

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
    <td><input class="form-check-input" type="checkbox" value=""></td>
    <td>${personNameValue}</td>
    <td>${accountValue}</td>
    <td>${productNameValue}</td>
    <td>${priceValue}</td>
    <td>${countValue}</td>
    <td>${linkValue}</td>
    <td>${purchasingValue}</td>
    <td>${descriptionValue}</td>
    <td><button id="editBtn">Edit</button></td>
    <td><button id="deleteBtn">Delete</button></td>
    `;
    tableBody.appendChild(newRow)

}



addBtn.addEventListener('click', function() {
    
    const personNameValue = personName.value;
    const accountValue = account.value;
    const productNameValue = productName.value;
    const priceValue = price.value;
    const countValue = count.value;
    const linkValue = link.value;
    const purchasingValue = purchasingDate.value;
    const descriptionValue = description.value;


    const apiUrl= "http://backend.norbit.com.tr/purchase-request/list/"
    const token = localStorage.getItem('token');
    axios ({
        method:'post',
        url: apiUrl,
        headers: {
            "Authorization": `Token ${token}`
        },
        data: {
            owner: personNameValue,
            account: accountValue,
            product_name: productNameValue,
            price: priceValue,
            count: countValue,
            e_commerce_site: linkValue,
            purchasing_date: purchasingValue,
            description: descriptionValue,    
        }
    }).then((response)=>{
        addRowTable(personNameValue, accountValue, productNameValue, priceValue,countValue, linkValue, purchasingValue,descriptionValue)
        clearInput();
    }).catch((error) => {
          console.log(error);
        });

});






function openEditModal(personNameValue,accountValue,productNameValue,priceValue,countValue,linkValue,purchasingValue,descriptionValue){
    personName.value = personNameValue;
    account.value = accountValue;
    productName.value = productNameValue;
    price.value = priceValue;
    count.value = countValue;
    link.value = linkValue;
    purchasingDate.value = purchasingValue;
    description.value = descriptionValue;
}
function clearInput(){

    personName.value = '';
    account.value = '';
    productName.value = '';
    price.value = '';   
    count.value = '';
    link.value = '';
    purchasingDate.value = '';
    description.value = '';
}

    






function addPurchaseValue() {
    const apiUrl = "http://backend.norbit.com.tr/purchase-request/list/";
    const token  = localStorage.getItem('token');

    axios({
        method: 'get',
        url: apiUrl,
        headers: {
            "Authorization": `Token ${token}`
        },
    })
    .then(response => {
        const purchaseData = response.data;
        console.log(purchaseData); 
        populateTable(purchaseData.results); 
    })
    .catch(error => {
        console.error('Hata oluştu', error);
    });
}

function populateTable(purchaseData) {
    const tableBody = document.querySelector('#purchaseTable tbody')
    tableBody.innerHTML = ''; 

    purchaseData.forEach(item => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input class="form-check-input" type="checkbox" value=""></td>
            <td>${item.personName}</td>
            <td>${item.product_name}</td>
            <td>${item.price}</td>
            <td>${item.e_commerce_site}</td>
            <td>${item.description}</td>
            <td>${item.purchasing_date}</td>
            <td><button id="editBtn" class="btn btn-success btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button></td>
            <td><button id="deleteBtn" class="btn btn-danger btn-sm delete-btn"  data-bs-toggle="modal"   >Delete</button></td>
        `;

        tableBody.appendChild(newRow);

        const editBtns = document.querySelectorAll('.edit-btn'); 
        editBtns.forEach(editBtn => {
            editBtn.addEventListener('click', () => {    
                modalContent.style.display = "block";
              
                const personNameValue = row.querySelector('.person-name').textContent;
                const productNameValue = row.querySelector('.product-name').textContent;
                const priceValue = row.querySelector('.price').textContent;
                const linkValue = row.querySelector('.link').textContent;
                const descriptionValue = row.querySelector('.description').textContent;
                
                openEditModal(personNameValue, productNameValue, priceValue, linkValue, descriptionValue);
            });
        });
    });
}

window.onload = function () {
    addPurchaseValue();
}


// personName.value = newRow.querySelector()