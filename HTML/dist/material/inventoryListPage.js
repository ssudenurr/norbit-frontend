const tableBody = document.querySelector('#inventory-table tbody');
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

const editButton = document.getElementById('edit-btn');
const rowEdit = document.getElementById('editBtn');
const rowDelete = document.getElementById('delete-btn');

let dataList = [];

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
const writeContent = async ()=>{
    setTimeout(() => {

        for (let i=0; i < dataList.length; i++){
        showInventory(dataList[i]);
    }
    }, 100)

}

function getRowData(rowId){
    const apiUrl = `http://backend.norbit.com.tr/inventory/${rowId}/`
    const token  = localStorage.getItem('token');

    axios({
        method:'get',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
    }).then( async (response)=>{
        const rowData = response.data;
        console.log(rowData)
        
        const whereInTheOfficeInputData = rowData.where_in_the_office;
        const productNameData = rowData.product_name;
        const priceData = rowData.price;
        const countData = rowData.count;
        const linkData = rowData.e_commerce_site;
        const purchasingDateData = rowData.purchasing_date;
        const descriptionData = rowData.description;
        console.log(purchasingDateData)
        // const transDate = new Date(purchasingDateData)

        whereInTheOfficeInput.value = whereInTheOfficeInputData;
        productNameInput.value = productNameData;
        priceInput.value = priceData;
        countInput.value = countData;
        linkInput.value = linkData;
        purchasingDateInput.value = formatTarih(purchasingDateData);
        descriptionInput.value = descriptionData; 

    })
}
async function getInventory(url=null){
    let urlApi;
    if (url === null) {
        urlApi = `http://backend.norbit.com.tr/inventory/list/`; 
    }
    else {
        urlApi = url; 
    }

    const token = localStorage.getItem('token');
    const api = new Promise((resolve, reject) => {
    axios ({
        method:'get',
        url:urlApi,
        headers:{
            "Authorization": `Token ${token}`
        },
    }).then((response) => {
        const responseData = response.data;

        showInventory(responseData);
        resolve(responseData)
    }).catch((error) =>{
        reject(error)
        console.log(error)
    })
});
    try{
        const response = await api;
        const results = response.results;
        console.log(results);
        const nextPage = response.next;

        results.map((item) => {
            dataList.push(item);
        });

        // eger next page varsa diğer sayfanın verilerini de al
        
        if (nextPage){
            getInventory(nextPage);
        }
        else {
            return dataList;
        }

    }
    catch (e){
        console.log(e)
    }
}
function editInventory(inventoryId){
    const apiUrl = `http://backend.norbit.com.tr/inventory/${inventoryId}/`
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
            description:newDescription.value,
        }
    }).then((response)=>{
        // const userData = response.data
        window.location.reload();   

    }).catch((error) => {
        console.error(error)
    });
}   

function deleteInventory(inventoryId){
    const apiUrl = `http://backend.norbit.com.tr/inventory/${inventoryId}/`
    const token  = localStorage.getItem('token');
    
    axios({
        method:'delete',
        url:apiUrl,
        headers:{
            "Authorization": `Token ${token}`
        },
    }).then((response)=>{

        window.location.reload();   

    }).catch((error) => {
        console.error(error)
    });

}
const showInventory =  async (item) => {
    // tableBody.innerHTML = '';
        const newRow = document.createElement('tr');

        const product_name = item.product_name || '-';
        const where_in_the_office = item.where_in_the_office || '-';
        const price = item.price || '-';
        const count = item.count || '-';
        const e_commerce_site = item.e_commerce_site || '-';
        const purchasing_date = formatTarih(item.purchasing_date) || '-';
        const description = item.description || '-';

        newRow.innerHTML = `
        <td><input class="form-check" type ="checkbox"  id="checkbox" value=""</td>
        <td>${product_name}</td>
        <td>${where_in_the_office}</td>
        <td>${price}</td>
        <td>${count}</td>
        <td><a href="${e_commerce_site}" target="_blank" style="text-decoration:underline!important">${e_commerce_site}</a></td>  
        <td>${purchasing_date}</td>
        <td>${description}</td>
        `
        tableBody.appendChild(newRow);

        const checkBox = newRow.querySelector('input[type="checkbox"]');
        checkBox.addEventListener('change', (e) => {
            e.preventDefault();
            const inventoryId = item.id;
            if(this.checked){
                console.log("Seçilen satırın ID'si: " + inventoryId);
            }   
            editButton.addEventListener('click', () =>{
                getRowData(inventoryId);
                modal.show();
                checkBox.checked = false;
            });
            rowEdit.addEventListener('click', () =>{
                editInventory(inventoryId);
            });
            rowDelete.addEventListener('click', () =>{
                deleteInventory(inventoryId);
                checkBox.checked = false;
            })
        });

}
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();   
    searchData(searchTerm);
  });
async function searchData(searchTerm){
    const apiUrl = `http://backend.norbit.com.tr/ems/list/?search=${searchTerm}`;
    const token  = localStorage.getItem('token');

    axios({
        method:'get',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
    }).then(response => {
        const searchData = response.data.results;
        const tableRows = document.querySelectorAll('#inventory-table tbody tr');
        
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

        const tableRows = document.querySelectorAll('#inventory-table tbody tr');
        tableRows.forEach(row => {
            row.style.display = 'table-row';
        });
    } else {
        searchData(searchTerm);
    }
});


window.addEventListener('load', () =>{
    getInventory();
    writeContent();
})