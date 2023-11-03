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
const orderDateInput = document.getElementById('inputOrderDate');

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
        const purchasingDateData = rowData.created_at;
        const orderDateData = rowData.siparis_verilen_tarih;
        // const descriptionData = rowData.description;

        // const transDate = new Date(purchasingDateData);
        if (rowData.where_in_the_office) {
            whereInTheOfficeInput.value = rowData.where_in_the_office;
        } else {
            whereInTheOfficeInput.value = ''; // Set an empty value
        }
        productNameInput.value = productNameData;
        priceInput.value = priceData;
        countInput.value = countData;
        linkInput.value = linkData;
        purchasingDateInput.value = formatTarih(purchasingDateData);
        orderDateInput.value = formatTarih(orderDateData);
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
    console.log(newPurhasingDate)
    const newOrderDate = document.getElementById('inputOrderDate')

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
            created_at:formatDateToCustomFormat(newPurhasingDate.value),
            siparis_verilen_tarih:formatDateToCustomFormat(newOrderDate.value),
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
            status: 'IP',
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
    const apiUrl = `http://backend.norbit.com.tr/purchase/${requestId}/`;
    const token = localStorage.getItem('token');

    axios({
        method:'patch',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
         data:{
            status: 'TA',
        }

    }).then((response)=>{
        // console.log(response.data)
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
            status: 'BE',
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

let dataList = [];
let currentPage = 1;
let itemsPerPage = 5;

const nextPageBtn = document.getElementById("next-page");
const prevPageBtn = document.getElementById("prev-page");

function displayDataOnPage(){
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = dataList.slice(startIndex,endIndex);

    tableBody.innerHTML = "";
    showPurchase(pageData); 

}
nextPageBtn.addEventListener('click', () => {
    currentPage++;
    getPurchase(currentPage);
});

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        getPurchase(currentPage);
    }
});
async function getPurchase(page = 1){
    const apiUrl = `http://backend.norbit.com.tr/purchase/list/?page=${page}`;
    const token  = localStorage.getItem('token');

    axios ({
        method:'get',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
    }).then((response) =>{
        const responseData = response.data.results;
        const nextPage = response.next;
        showPurchase(responseData);
        responseData.map((item) => {
            dataList.push(item);
        });
        if (nextPage) {
            getPurchase(nextPage);
        }
        // console.log(responseData)

    }).catch((error) =>{
        console.log(error)
    })
}
const showPurchase = async (responseData)  => {
    tableBody.innerHTML = '';
    for( const purchase of responseData){
    // console.log(responseData);
        const newRow = document.createElement('tr') ;
        const responsiblePerson = await getResponsibleId(purchase.responsible_person)  || '-';
        const productName = purchase.product_name || '-';
        const price = purchase.price || '-';
        const count = purchase.count || '-';
        const e_commerce_site = purchase.e_commerce_site || '-';
        const purchasing_date = formatTarih(purchase.created_at);
        const orderDate = purchase.siparis_verilen_tarih ? formatTarih(purchase.siparis_verilen_tarih) : '-';
        const description = purchase.description || '-';
        let statusData = purchase.siparis_verilen_tarih ? "Tamamlandı" : (purchase.status === "ON" ? "Onaylandı" : "-");
        newRow.innerHTML = `
        <td><input class="form-check" type ="checkbox"  id="checkbox" value=""</td>
        <td>${responsiblePerson}</td>
        <td><span class="badge badge bg-success fw-semibold fs-12">${statusData}</span></td>
        <td>${productName}</td>
        <td>${price}</td>
        <td>${count}</td>
        <td>
            <a href="${e_commerce_site}" target="_blank" style="text-decoration: underline!important; max-width: 100px; display: block;">
                ${e_commerce_site.length > 25 ? e_commerce_site.substr(0, 25) + '...' : e_commerce_site}
            </a>
        </td>
        <td>${purchasing_date}</td>
        <td>${orderDate}</td>



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
    };
}


const getResponsibleId = async (id) => {
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
                const firstname = item.first_name;
                const lastname = item.last_name;
                return firstname + ' ' + lastname;
            });

            resolve(ownerData);
        }).catch((error) => {
            reject(error)
        
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

function getResponsiblePerson(purchaseId){
    const apiUrl= "http://backend.norbit.com.tr/ems/list/"
    const token  = localStorage.getItem('token');

    axios({
        method:'get',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
    }).then((response)=>{
        const personNameData = response.data.results;

        const personList = document.getElementById('responsible-person');
        personList.innerHTML = '';

        personNameData.forEach((person) => {
            const option = document.createElement('option');
            option.value= person.id;
            option.text = person.first_name + ' ' + person.last_name;
            if (person.id === purchaseId) {
                option.selected = true; // Seçilen kişiyi seçili olarak işaretle
              }
            personList.appendChild(option)
        });

    }).catch((error) => {
          console.log(error);
        });
};
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value;
    if (searchTerm) {
        searchData(searchTerm);
    } else {
        alert('Arama terimi boş olamaz.');
    }
});

async function searchData(searchTerm){
    const apiUrl = `http://backend.norbit.com.tr/inventory/list/?search=${searchTerm}`;
    const token  = localStorage.getItem('token');

    axios({
        method:'get',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
    }).then(response => {
        const searchData = response.data.results;
        const tableRows = document.querySelectorAll('#purchase-table tbody tr');
        
        tableRows.forEach(row => {
            const rowData = row.textContent.toLowerCase(); 
    
            if (rowData.includes(searchTerm.toLowerCase()) || searchTerm === '') {
                row.style.display = 'table-row'; 
            } else {
                row.style.display = 'none'; 
            }
            if (searchInput.value === '') {
                    row.style.display = 'table-row';
            }
    
    })
        showInventory(searchData); 

    })
    .catch(error => {
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


window.addEventListener('load', (event) => {
    getPurchase();
    });
    