
// const addBtn = document.getElementById('addBtn')
// // const deleteBtn = document.getElementById('deleteBtn')

// const personName = document.getElementById('personName')
// const productName = document.getElementById('productName');
// const price = document.getElementById('price');
// const link = document.getElementById('link');
// const description = document.getElementById('description');

// const modalContent = document.getElementById('modalContent');

// function addRowTable(personName,productName,price,link,description){
//     const tableBody = document.querySelector('#purchaseTable tbody')

//     const newRow = document.createElement('tr');
//     newRow.innerHTML = `
//     <td><input class="form-check-input" type="checkbox" value=""></td>
//     <td>${personName}</td>
//     <td>${productName}</td>
//     <td>${price}</td>
//     <td>${link}</td>
//     <td>${description}</td>
//     <td><button id="editBtn">Edit</button></td>
//     <td><button id="deleteBtn">Delete</button></td>
//     `;
//     tableBody.appendChild(newRow)

// }

// addBtn.addEventListener('click', function() {
    
//     const personNameValue = personName.value;
//     const productNameValue = productName.value;
//     const priceValue = price.value;
//     const linkValue = link.value;
//     const descriptionValue = description.value;

//     const apiUrl= "http://backend.norbit.com.tr/purchase-request/list/"
//     const token  = localStorage.getItem('token');
//     axios ({
//         method:'post',
//         url: apiUrl,
//         headers: {
//             "Authorization": `Token ${token}`
//         },
//         data: {
//             personName: personNameValue,
//             product_name: productNameValue,
//             price: priceValue,
//             e_commerce_site: linkValue,
//             description: descriptionValue
//         }
//     }).then((response)=>{
//         addRowTable(personNameValue, productNameValue, priceValue, linkValue, descriptionValue)
//         clearInput();
//     }).catch((error) => {
//           console.log(error);
//         });

// });


// function openEditModal(personNameValue,productNameValue,priceValue,linkValue,descriptionValue){
//     personName.value = personNameValue;
//     productName.value = productNameValue;
//     price.value = priceValue;
//     link.value = linkValue;
//     description.value = descriptionValue;


// }
// function clearInput(){
//     personName.value = '';
//     productName.value = '';
//     price.value = '';   
//     link.value = '';
//     description.value = '';
// }

    









function addPurchaseValue() {
    const apiUrl = "http://backend.norbit.com.tr/purchase/list/";
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
            <td><button class="editBtn">Edit</button></td>
            <td><button class="deleteBtn">Delete</button></td>
        `;

        tableBody.appendChild(newRow);

        // const editBtn = document.getElementById('editBtn');
        const editBtn = newRow.querySelector('.editBtn');
            
        editBtn.addEventListener('click', ()=> {    
        
            modalContent.style.display  = "block";
        
            const personNameValue = personName.value;
            const productNameValue = productName.value;
            const priceValue = price.value;
            const linkValue = link.value;
            const descriptionValue = description.value;
            
            openEditModal(personNameValue, productNameValue, priceValue, linkValue, descriptionValue);
        });
    });
}

window.onload = function () {
    addPurchaseValue();
}
