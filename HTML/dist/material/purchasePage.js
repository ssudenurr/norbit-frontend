const tableBody = document.querySelector('#purchase-table tbody');
const statusBtn = document.getElementById('situation');
const cancelBtn = document.getElementById('cancel');
const replyBtn = document.getElementById('reply');
const editBtn = document.getElementById('edit-btn');

const modal = new bootstrap.Modal(document.getElementById('exampleModal'));

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

const whereInTheOfficeInput = document.getElementById('input-Where-In-The-Office');
const productNameInput = document.getElementById('inputProductName');
const priceInput = document.getElementById('inputPrice');
const countInput = document.getElementById('inputCount');
const linkInput = document.getElementById('inputLink');
const purchasingDateInput = document.getElementById('inputPurchasingDate');
const descriptionInput = document.getElementById('inputDescription');

const rowEdit = document.getElementById('editBtn');

function formatTarih(tarih) {
    const tarihParcalari = tarih.split('T');
    return tarihParcalari[0];
}
function formatDateToCustomFormat(date) {
    let date2 = new Date(date)
    var yyyy = date2.getFullYear();
    var MM = String(date2.getMonth() + 1).padStart(2, '0'); // Ayı 2 basamaklı hale getiriyoruz
    var dd = String(date2.getDate()).padStart(2, '0'); // Günü 2 basamaklı hale getiriyoruz
    var hh = String(date2.getHours()).padStart(2, '0'); // Saati 2 basamaklı hale getiriyoruz
    var mm = String(date2.getMinutes()).padStart(2, '0'); // Dakikayı 2 basamaklı hale getiriyoruz
  
    // Sonuç formatını birleştiriyoruz
    var formattedDate = yyyy + '-' + MM + '-' + dd + 'T' + hh + ':' + mm;
  
    return formattedDate;
}
function getRowData(rowId){
    const apiUrl = `http://backend.norbit.com.tr/purchase/${rowId}/`
    const token  = localStorage.getItem('token');

    axios({
        method:'get',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
    }).then( async (response)=>{
        const rowData = response.data;

        
        const whereInTheOfficeInputData = rowData.where_in_the_office;
        const productNameData = rowData.product_name;
        const priceData = rowData.price;
        const countData = rowData.count;
        const linkData = rowData.e_commerce_site;
        const purchasingDateData = rowData.purchasing_date;
        // const descriptionData = rowData.description;

        // const transDate = new Date(purchasingDateData);

        whereInTheOfficeInput.value = whereInTheOfficeInputData;
        productNameInput.value = productNameData;
        priceInput.value = priceData;
        countInput.value = countData;
        linkInput.value = linkData;
        purchasingDateInput.value = formatTarih(purchasingDateData);
        // console.log(purchasingDateInput.value);
        ;
        // descriptionInput.value = descriptionData;

    })
}

function editPurchase(purchaseId){
    const apiUrl = `http://backend.norbit.com.tr/purchase/${purchaseId}/`
    const token  = localStorage.getItem('token');

    const newWhereInTheOffice = document.getElementById('input-Where-In-The-Office');
    const newProductName = document.getElementById('inputProductName');
    const newPrice = document.getElementById('inputPrice');
    const newCount = document.getElementById('inputCount');
    const newLink = document.getElementById('inputLink');
    const newPurhasingDate = document.getElementById('inputPurchasingDate');
    const newDescription = document.getElementById('inputDescription')

    axios({
        method:'patch',
        url:apiUrl,
        headers:{
            "Authorization": `Token ${token}`
        },
        data:{
            where_in_the_office:newWhereInTheOffice.value,
            product_name:newProductName.value,
            price:newPrice.value,
            count:newCount.value,
            e_commerce_site:newLink.value,
            purchasing_date:formatDateToCustomFormat(newPurhasingDate.value),
            // description:newDescription.value,
        }
    }).then((response)=>{
        // const userData = response.data
        window.location.reload();   

    }).catch((error) => {
        console.error(error)
    });
}
async function cancelRequest(requestId){
    const apiUrl = `http://backend.norbit.com.tr/purchase-request/${requestId}/`;
    const token = localStorage.getItem('token');

    axios({
        method:'patch',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
            data:{
            status: 'İptal Edildi',
        }

    }).then((response)=>{
        console.log(response.data)
        if (response.status === 200) {
            console.log('Status updated successfully:', response.data);
            window.location.reload();

        } else {
            console.error('Status update failed:', response);
        }

    }).catch((error) => {

        console.error('An error occurred while updating the status:', error);

    })
}
async function updatePurchaseStatus(requestId){
    const apiUrl = `http://backend.norbit.com.tr/purchase-request/${requestId}/`;
    const token = localStorage.getItem('token');

    axios({
        method:'patch',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
         data:{
            status: 'Tamamlandı',
        }

    }).then((response)=>{
        console.log(response.data)
        if (response.status === 200) {
            console.log('Status updated successfully:', response.data);
            window.location.reload();

        } else {
            console.error('Status update failed:', response);
        }

    }).catch((error) => {

        console.error('An error occurred while updating the status:', error);

    })
}
async function replyRequest(requestId){
    const apiUrl = `http://backend.norbit.com.tr/purchase-request/${requestId}/`;
    const token = localStorage.getItem('token');

    axios({
        method:'patch',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
         data:{
            status: 'Bekleniyor',
        }

    }).then((response)=>{
        console.log(response.data)
        if (response.status === 200) {
            console.log('Status updated successfully:', response.data);
            window.location.reload();

        } else {
            console.error('Status update failed:', response);
        }

    }).catch((error) => {

        console.error('An error occurred while updating the status:', error);

    })
}

function getPurchase(){
    const apiUrl = `http://backend.norbit.com.tr/purchase/list/`;
    const token  = localStorage.getItem('token');

    axios ({
        method:'get',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
    }).then((response) =>{
        const responseData = response.data.results;
        // console.log(responseData)
        showPurchase(responseData)
    }).catch((error) =>{
        console.log(error)
    })
}
const showPurchase = async (responseData)  => {
    tableBody.innerHTML = '';
    responseData.forEach( async purchase => {
    console.log(responseData);
        const newRow = document.createElement('tr') ;
        const owner = await getOwnerName(purchase.owner)  || '-';
        const productName = purchase.product_name || '-';
        const price = purchase.price || '-';
        const count = purchase.count || '-';
        const e_commerce_site = purchase.e_commerce_site || '-';
        const purchasing_date = formatTarih(purchase.purchasing_date) || '-';
        const description = purchase.description || '-';

        newRow.innerHTML = `
        <td><input class="form-check" type ="checkbox"  id="checkbox" value=""</td>
        <td>${owner}</td>
        <td><span class="badge badge bg-success fw-semibold fs-12">${purchase.status}</span></td>
        <td>${productName}</td>
        <td>${price}</td>
        <td>${count}</td>
        <td>
        <a href="${e_commerce_site}" target="_blank" style="text-decoration: underline!important; max-width: 100px; display: block;">
            ${e_commerce_site.length > 25 ? e_commerce_site.substr(0, 25) + '...' : e_commerce_site}
        </a>
        </td>
    
        <td>${purchasing_date}</td>



        `;
        tableBody.appendChild(newRow);

        const checkBox = newRow.querySelector('input[type="checkbox"]');
        checkBox.addEventListener('change', (e) => {
            e.preventDefault();
            const purchaseId = purchase.id;
            if(this.checked){
                console.log("Seçilen satırın ID'si: " + purchaseId);
            }   
            statusBtn.addEventListener('click', () => {
                updatePurchaseStatus(purchaseId);
                });
            
            cancelBtn.addEventListener('click', () =>{
                cancelRequest(purchaseId);
            });

            replyBtn.addEventListener('click', () =>{
                replyRequest(purchaseId);
            });
            editBtn.addEventListener('click', () => {
                getRowData(purchaseId);
                modal.show();
                // editPurchase();


            });
            rowEdit.addEventListener('click', () =>{
                editPurchase(purchaseId);
            })
        })
    });
}


const getOwnerName = async (id) => {

    const apiUrl= `http://backend.norbit.com.tr/ems/list/?id=${id}`
    const token  = localStorage.getItem('token');
    const api = new Promise((resolve, reject) => {
    axios({
        method:'get',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
    }).then((response)=>{
        const responseData = response.data.results


        const ownerData = responseData.map((item) => {
            const ownerID = item.id;
            const firstname = item.first_name;
            const lastname = item.last_name;
            return firstname + ' ' + lastname
            console.log(firstname)
        });

        resolve(ownerData);
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
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value;
    if (searchTerm) {
        searchData(searchTerm);
    } else {
        alert('Arama terimi boş olamaz.');
    }
});

async function searchData(search) {
    const apiUrl = `http://backend.norbit.com.tr/purchase/list/?search=${search}`;
    const token = localStorage.getItem('token');

    axios({
        method: 'get',
        url: apiUrl,
        headers: {
            "Authorization": `Token ${token}`
        },
    }).then(response => {
        const searchData = response.data.results;
        if (searchData.length === 0) {
            alert('Arama sonucunda hiçbir veri bulunamadı.');
        } else {
            showPurchase(searchData);
        }
    }).catch(error => {
        console.error('Arama sırasında hata oluştu: ', error);
    });
}
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') {

        const tableRows = document.querySelectorAll('#personalTable tbody tr');
        tableRows.forEach(row => {
            row.style.display = 'table-row';
        });
    } else {
        searchData(searchTerm);
    }
});

// const eskiTarih = '2023-10-03T14:30';
// const yeniTarih = formatTarih(eskiTarih);
// console.log(yeniTarih); // "2023-10-03"
window.addEventListener('load', (event) => {
    getPurchase();
    });
    