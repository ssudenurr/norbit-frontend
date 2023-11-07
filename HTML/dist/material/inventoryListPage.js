const tableBody = document.querySelector('#inventory-table tbody');
const modal = new bootstrap.Modal(document.getElementById('exampleModal'));

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

const productNameInput = document.getElementById('inputProductName');
const purchaseDate = document.getElementById('inputPurchaseDate');
const whereInTheOfficeInput = document.getElementById('input-Where-In-The-Office');
const priceInput = document.getElementById('inputPrice');
const countInput = document.getElementById('inputCount');
const linkInput = document.getElementById('inputLink');
const descriptionInput = document.getElementById('inputDescription');

const modaltitle = document.getElementById('exampleModalLabel');

const addButton = document.getElementById('add-btn');

const editButton = document.getElementById('edit-btn');
const rowEdit = document.getElementById('editBtn');
const rowDelete = document.getElementById('delete-btn');

const closeBtn = document.getElementById('btn-close');
closeBtn.addEventListener('click', () =>{
    clearInput();
})
function valueControl(){
    const alert = document.getElementById("alertWarning"); 
    if(
        !productNameInput.value ||
        !purchaseDate.value ||
        !whereInTheOfficeInput.value ||
        !priceInput.value ||
        !countInput.value ||
        !linkInput.value ||
        !descriptionInput.value

    ){
        alert.style.display = "block";
    
        setTimeout(() => {
          alert.style.display = "none";
        }, 1600);
    
        return;
}
}
addButton.addEventListener('click', () => {

    rowEdit.style.display = 'none';
    modaltitle.innerHTML = '';

    const existingRowAddBtn = document.querySelector('.row-add-btn');
    if (!existingRowAddBtn) {
        const buttonBox = document.getElementById('button-box');
        const addBtn = document.createElement('button');
        addBtn.className = 'btn btn-primary row-add-btn';
        addBtn.textContent = 'Ekle';
        addBtn.addEventListener('click', () => {
            valueControl();
            createInventory();
        });
        buttonBox.appendChild(addBtn);
    }
    clearInput();
})

function formatTarih(tarih) {
    if (tarih && tarih !== '-') {
        const tarihParcalari = tarih.split('T');
        return tarihParcalari[0];
    } else {
        return '-';
    }
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


function createInventory(){
  const apiUrl= "https://backend.norbit.com.tr/inventory/create/"
  const token  = localStorage.getItem('token');

  axios({
      method: 'post',
      url: apiUrl,
      headers:{
          "Authorization": `Token ${token}`
      },
      data:{
        product_name:productNameInput.value,
        satin_alinan_tarih:formatDateToCustomFormat(purchaseDate.value),
        description:descriptionInput.value,
        price:priceInput.value,
        count:countInput.value,
        e_commerce_site:linkInput.value,
        where_in_the_office:whereInTheOfficeInput.value,

      }
  }).then((response) => {
    //   getResponsiblePerson();
    window.location.reload();

  }).catch((error) => {
      console.log(error)
  })
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

      const productNameData = rowData.product_name;
      const purchaseDateData = rowData.satin_alinan_tarih;
      const whereInTheOfficeInputData = rowData.where_in_the_office;
      const priceData = rowData.price;
      const countData = rowData.count;
      const linkData = rowData.e_commerce_site;
      const descriptionData = rowData.description;


      purchaseDate.value = formatTarih(purchaseDateData);
      whereInTheOfficeInput.value = whereInTheOfficeInputData;
      productNameInput.value = productNameData;
      priceInput.value = priceData;
      countInput.value = countData;
      linkInput.value = linkData;
      descriptionInput.value = descriptionData; 

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
    showInventory(pageData); 

}

nextPageBtn.addEventListener('click', () => {
    currentPage++;
    getInventory(currentPage);
});

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        getInventory(currentPage);
    }
});

async function getInventory(itemsPerPage = 1){

    const urlApi = `http://backend.norbit.com.tr/inventory/list/?page=${itemsPerPage}`;
    

  const token = localStorage.getItem('token');
  axios ({
      method:'get',
      url:urlApi,
      headers:{
          "Authorization": `Token ${token}`
      },
  }).then((response) => {
      const responseData = response.data.results;
      const nextPage = response.next;
      showInventory(responseData);

      responseData.map((item) => {
        dataList.push(item);
    });

    if (nextPage) {
        getInventory(nextPage);
    }
  }).catch((error) =>{

      console.log(error)
  })
}
function editInventory(inventoryId){
  const apiUrl = `http://backend.norbit.com.tr/inventory/${inventoryId}/`
  const token  = localStorage.getItem('token');

  const newProductName = document.getElementById('inputProductName');
  const newPurchaseDate = document.getElementById('inputPurchaseDate');
  const newWhereInTheOffice = document.getElementById('input-Where-In-The-Office');
  const newPrice = document.getElementById('inputPrice');
  const newCount = document.getElementById('inputCount');
  const newLink = document.getElementById('inputLink');
  // const newPurhasingDate = document.getElementById('inputPurchasingDate');
  const newDescription = document.getElementById('inputDescription')

  axios({
      method:'patch',
      url:apiUrl,
      headers:{
          "Authorization": `Token ${token}`
      },
      data:{
          product_name:newProductName.value,
          satin_alinan_tarih:formatDateToCustomFormat(newPurchaseDate.value),
          where_in_the_office:newWhereInTheOffice.value,
          price:newPrice.value,
          count:newCount.value,
          e_commerce_site:newLink.value,
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

const showInventory =  async (responseData) => {
    tableBody.innerHTML = '';
    for (const item of responseData) {
        const newRow = document.createElement('tr');
        const purchasing_date = item.satin_alinan_tarih ? formatTarih(item.satin_alinan_tarih) : '-';
        const product_name = item.product_name || '-';
        const where_in_the_office = item.where_in_the_office || '-';
        console.log(responseData);
        const price = item.price || '-';
        const count = item.count || '-';
        const e_commerce_site = item.e_commerce_site || '-';
        const description = item.description || '-';
    


        newRow.innerHTML = `
        <td><input class="form-check" type ="checkbox"  id="checkbox" value=""</td>
        <td>${product_name}</td>
        <td>${purchasing_date}</td>
        <td>${where_in_the_office}</td>
        <td>${price}</td>
        <td>${count}</td>
        <td>${description}</td>
        <td>
        <div style="max-width: 160px;">
            <a href="${e_commerce_site}" target="_blank" style="text-decoration: underline!important; display: block;">
                ${e_commerce_site.length > 23 ? e_commerce_site.substr(0, 23) + '...' : e_commerce_site}
            </a>
        </div>
    </td>
    

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
                // document.querySelector('.row-add-btn').style.display = "none";
                rowEdit.style.display = "block"
                getRowData(inventoryId);
                modal.show();
                checkBox.checked = false;
                // document.getElementById('extraData').style.display= 'none';

            });
            rowEdit.addEventListener('click', () =>{
                valueControl();
                editInventory(inventoryId);
            });
            rowDelete.addEventListener('click', () =>{
                deleteInventory(inventoryId);
                checkBox.checked = false;
            })
        });
    };
}
// function getResponsiblePerson(purchaseId){
//     const apiUrl= "http://backend.norbit.com.tr/ems/list/"
//     const token  = localStorage.getItem('token');

//     axios({
//         method:'get',
//         url:apiUrl,
//         headers:{ 
//             "Authorization": `Token ${token}`
//         },
//     }).then((response)=>{
//         const personNameData = response.data.results;

//         const personList = document.getElementById('responsible-person');
//         personList.innerHTML = '';

//         personNameData.forEach((person) => {
//             const option = document.createElement('option');
//             option.value= person.id;
//             option.text = person.first_name + ' ' + person.last_name;
//             if (person.id === purchaseId) {
//                 option.selected = true; // Seçilen kişiyi seçili olarak işaretle
//               }
//             personList.appendChild(option)
//         });

//     }).catch((error) => {
//           console.log(error);
//         });
// };
// const getResponsibleId = async (id) => {
//   const apiUrl= `http://backend.norbit.com.tr/ems/list/?id=${id}`
//   const token  = localStorage.getItem('token');

//   const api = new Promise((resolve, reject) => {
//       axios({
//           method:'get',
//           url:apiUrl,
//           headers:{ 
//               "Authorization": `Token ${token}`
//           },
//       }).then((response)=>{
//           const responseData = response.data.results

//           const ownerData = responseData.map((item) => {
//               const firstname = item.first_name;
//               const lastname = item.last_name;
//               return firstname + ' ' + lastname;
//           });

//           resolve(ownerData);
//       }).catch((error) => {
//           reject(error)
      
//       });
//   });

//   try {
//       const response = await api;
//       return response;
//   }
//   catch (e) {
//       return e
//   }
// } 

searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();
    searchData(searchTerm);
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

function clearInput() {
    productNameInput.value = '';
    purchaseDate.value = '';
    whereInTheOfficeInput.value = '';
    priceInput.value = '';
    countInput.value = '';
    linkInput.value = '';
    descriptionInput.value = '';
  }
window.addEventListener('load', () =>{
    getInventory(1);
    // writeContent();
})