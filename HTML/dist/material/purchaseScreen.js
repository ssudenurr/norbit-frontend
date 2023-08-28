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
function addPurchaseValue() {
    console.log('hello');
    const apiUrl = "http://backend.norbit.com.tr/purchase/list/";

    axios({
        method: 'get',
        url: apiUrl,
    })
    .then(response => {
        const purchaseData = response.data;
        console.log(purchaseData);
        populateTable(purchaseData.results); // Doğru veriyi gönder
    })
    .catch(error => {
        console.error('Hata oluştu', error);
        // Hata bildirimi sağlayabilirsiniz
    });
}

function populateTable(purchaseData) {
    const tableBody = document.getElementById('purchaseTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Tabloyu temizle

    purchaseData.forEach(item => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input class="form-check-input" type="checkbox" value=""></td>
            <td>${item.user}</td>
            <td>${item.productName}</td>
            <td>${item.price}</td>
            <td>${item.e_commerce_site}</td>
            <td>${item.description}</td>
        `;
        tableBody.appendChild(newRow);
    });
}

window.onload = function () {
    addPurchaseValue();
}



// function populateTable(data) {
//     document.getElementById('')
// }


    // axios.get(apiUrl)
    //     .then(response => {
    //         const purchaseData = response.data.results;
    //         console.log(purchaseData);
    //         populateTable(purchaseData);
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     });