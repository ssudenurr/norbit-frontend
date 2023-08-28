// const addBtn = document.getElementById('addBtn')
// const deleteBtn = document.getElementById('deleteBtn')


// const productName = document.getElementById('productName');
// const price = document.getElementById('price');
// const link = document.getElementById('link');
// const description = document.getElementById('description');


// function addRowTable(user,productName,price,link,description){
//     const tableBody = document.querySelector('#purchaseTable tbody')

//     const newRow = document.createElement('tr');
//     newRow.innerHTML = `
//     <td><input class="form-check-input" type="checkbox" value=""></td>
//     <td>${user}</td>
//     <td>${productName}</td>
//     <td>${price}</td>
//     <td>${link}</td>
//     <td>${description}</td>
//     `;
//     tableBody.appendChild(newRow)
// }
// addBtn.addEventListener('click', function() {
//     const user = "A kişisi "
//     const productValue = productName.value;
//     const priceValue = price.value;
//     const linkValue = link.value;
//     const descriptionValue = description.value;

//     addRowTable(user,productValue, priceValue, linkValue, descriptionValue,);

//     productName.value = '';
//     price.value = '';
//     link.value = '';
//     description.value = '';

// });


const addBtn = document.getElementById('addBtn');
const productName = document.getElementById('productName');
const price = document.getElementById('price');
const link = document.getElementById('link');
const description = document.getElementById('description');

function addPurchaseValue(){
    const apiUrl= "http://backend.norbit.com.tr/purchase/list/"


axios ({
    method:'get',
    url: apiUrl,

}).then((response)=>{

    const purchaseData = response.data;
    console.log(purchaseData)
    purchaseDetails(purchaseData);

}).catch((error) => {
      console.log(error);
    });
}

function purchaseDetails(){
    document.getElementById('productName').textContent = purchaseData.productName;
    document.getElementById('price').textContent = purchaseData.price;
    document.getElementById('link').textContent = purchaseData.e_commerce_site;
    document.getElementById('price').textContent = purchaseData.price;

}



