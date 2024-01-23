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
const orderingPersonInput = document.getElementById('inputOrderingPerson');
const rowEdit = document.getElementById('editBtn');

/*UZUN FORMATTAKİ TARİHİ KISA FORMATA ÇEVİRİR */
function formatTarih(date) {
    if (date) {
      const datePieces = date.split("T");
      if (datePieces.length > 0) {
        return datePieces[0];
      }
    }
    return null; 
  }
/*KISA FORMATTAKİ TARİHİ UZUN FORMATA ÇEVİRİR */
function formatDateToCustomFormat(date) {
    if (!date) {
        return null; // Handle the case where date is empty
    }

    let date2 = new Date(date);
    var yyyy = date2.getFullYear();
    var MM = String(date2.getMonth() + 1).padStart(2, '0');
    var dd = String(date2.getDate()).padStart(2, '0');
    var hh = String(date2.getHours()).padStart(2, '0');
    var mm = String(date2.getMinutes()).padStart(2, '0');
    var ss = String(date2.getSeconds()).padStart(2, '0');

    // Format the date string
    var formattedDate = yyyy + "-" + MM + "-" + dd + "T" + hh + ":" + mm;

    return formattedDate;
}
/*İLGİLİ SATIRIN BİLGİLERİNİ AÇILAN MODALDA GÖSTERİR */
function getRowData(rowId){ 
    const apiUrl = `${baseUrl}purchase/${rowId}/`
    const token  = localStorage.getItem('token');

    axios({
        method:'get',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
    }).then( async (response)=>{
        const rowData = response.data;
        console.log(rowData);
        const orderingPersonData = await getResponsibleId(rowData.ordering_person);
        
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
            whereInTheOfficeInput.value = ''; 
        }
        orderingPersonInput.value = orderingPersonData;

        if (rowData.ordering_person){
            orderingPersonInput.value = rowData.ordering_person;
        }else{
            productNameInput.value = '';
        }
        productNameInput.value = productNameData;
        priceInput.value = priceData;
        countInput.value = countData;
        linkInput.value = linkData;
        purchasingDateInput.value = formatTarih(purchasingDateData);
        orderDateInput.value = formatTarih(orderDateData);
        // getResponsiblePerson(rowData.owner)
        // console.log(purchasingDateInput.value);
        // descriptionInput.value = descriptionData;

    })
};

/*SEÇİLEN PURCHASE DEĞERİNİ DÜZENLER*/
function editPurchase(purchaseId) {
    const apiUrl = `${baseUrl}purchase/${purchaseId}/`;
    const token = localStorage.getItem('token');

    const requestData = {
        where_in_the_office: whereInTheOfficeInput.value,
        product_name: productNameInput.value,
        price: priceInput.value,
        count: countInput.value,
        e_commerce_site: linkInput.value,
        created_at: formatDateToCustomFormat(purchasingDateInput.value),
        siparis_verilen_tarih: formatDateToCustomFormat(orderDateInput.value),
    };

    // ordering_person değeri boşta gidebilir
    if (orderingPersonInput.value.trim() !== '') {
        requestData.ordering_person = [orderingPersonInput.value];
    }

    axios({
        method: 'patch',
        url: apiUrl,
        headers: {
            'Authorization': `Token ${token}`
        },
        data: requestData
    }).then((response) => {
        window.location.reload();
        // Handle the response as needed
    }).catch((error) => {
        console.error(error);
    });
}

/*SEÇİLEN PURCHASE DEĞERİNİ STATÜ DURUMUNU "İPTAL EDİLDİ" YAPAR */
async function cancelRequest(requestId){
    const apiUrl = `${baseUrl}purchase-request/${requestId}/`;
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
};
/* SEÇİLEN PURCHASE DEĞERİNİ STATÜ DURUMUNU "TAMAMLANDI" YAPAR*/
async function updatePurchaseStatus(requestId){
    const apiUrl = `${baseUrl}purchase/${requestId}/`;
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
};

/*SEÇİLEN PURCHASE DEĞERİNİ STATÜ DURUMUNU "BEKLENİYOR" YAPAR */
async function replyRequest(requestId){
    const apiUrl = `${baseUrl}purchase-request/${requestId}/`;
    const token = localStorage.getItem('token');

    axios({
        method:'patch',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
         data:{
            ordering_person: [],
            siparis_verilen_tarih:null,
            status: 'BE',
        }

    }).then((response)=>{
        console.log(response.data)
        if (response.status === 200) {            
            console.log('Status updated successfully:', response.data);

            // window.location.reload();

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
/*SAYFALAR ARASINDA GEZİNMEK İÇİNDİR */
function displayDataOnPage(){
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = dataList.slice(startIndex,endIndex);

    tableBody.innerHTML = "";
    showPurchase(pageData); 

};
/*BİR SONRAKİ SAYFAYA GEÇMEK İÇİN */
nextPageBtn.addEventListener('click', () => {
    currentPage++;
    getPurchase(currentPage);
});
/*BİR ÖNCEKİ SAYFAYA GEÇMEK İÇİN */
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        getPurchase(currentPage);
    }
});

/*PURCHASE DEĞERLERİNİ ALIR */
async function getPurchase(page = 1){
    const apiUrl = `${baseUrl}purchase/list/?page=${page}`;
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
        getOrderingPerson();
        showPurchase(responseData);
        responseData.map((item) => {
            dataList.push(item);
        });
        if (nextPage) {
            getPurchase(nextPage);
        }
        console.log(responseData)

    }).catch((error) =>{
        console.log(error)
    })
}

let currentSortOrder = 'asc';
const table = document.getElementById("purchase-table");
/*TABLODAKİ VERİLERİ ASC VE DESC OLARAK SIRALAR */
function sortTable(columnIndex) { 
  const rows = Array.from(table.querySelectorAll("tbody tr"));

  rows.sort((a, b) => {
    const aValue = a.children[columnIndex].textContent.trim();
    const bValue = b.children[columnIndex].textContent.trim();
    const comparison = aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' });  
  
    return currentSortOrder === 'asc' ? comparison : -comparison;
  });

  // Clear the table body
  table.querySelector("tbody").innerHTML = "";


  rows.forEach(row => {
    table.querySelector("tbody").appendChild(row);
  });
  currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
}

/*TABLODAKİ BAŞLIKLARA TIKLANDIĞI ZAMAN BAŞLIĞIN VE SIRALANAN VERİLERİN RENGİ DEĞİŞİR */
const headers = document.querySelectorAll("thead th");
headers.forEach((header, index) => {
  let sort_asc = true;
  header.addEventListener("click", () => {
  const rows = Array.from(table.querySelectorAll("tbody tr"));

    headers.forEach(header => header.classList.remove('active'))
    header.classList.add('active');

    document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
    rows.forEach(row => {
      row.children[index].classList.add('active')
    });

    header.classList.toggle('asc', sort_asc);
    sort_asc = header.classList.contains('asc') ? false : true;
    sortTable(index);
  });
});

/*PURCHASE DEĞERLERİNİ TABLODA GÖSTERİR */
const showPurchase = async (responseData)  => {
    tableBody.innerHTML = '';
    for( const purchase of responseData){
    // console.log(responseData);
    const newRow = document.createElement('tr');
    const responsiblePerson = await getResponsibleId(purchase.responsible_person) || '-';
    const productName = purchase.product_name || '-';
    const orderingPersonName = (purchase.ordering_person && purchase.ordering_person.length > 0) ? await getResponsibleId(purchase.ordering_person) : '-';
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
        <td>${orderingPersonName}</td>
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
                checkBox.checked = false;
                // getOrderingPerson();
                // editPurchase();


            });
            rowEdit.addEventListener('click', () =>{
                editPurchase(purchaseId);
            })
        })
    };
};

/*İSTEKTEN SORUMLU KİŞİNİN İSİM BİLGİLERİNİ ALMAK İÇİNDİR*/
const getResponsibleId = async (id) => {
    const apiUrl= `${baseUrl}ems/list/?id=${id}`
    const token  = localStorage.getItem('token');

    try {
        const response = await axios({
            method: 'get',
            url: apiUrl,
            headers: {
                'Authorization': `Token ${token}`
            },
        });

        const responseData = response.data.results;

        const personData = responseData.map((item) => {
            const firstname = item.first_name;
            const lastname = item.last_name;
            return firstname + ' ' + lastname;
        });

        return personData;
    } catch (error) {
        console.error(error);
        return  ;
    }
};

/*SİPARİŞ VEREN KİŞİNİN İSMİNİ ALMAK İÇİN PERSONEL LİSTESİ ALINDI */
let personList = [];
async function getOrderingPerson(purchaseId, page = 1) {
    const apiUrl = `${baseUrl}ems/list/?page=${page}`;
    const token = localStorage.getItem("token");
  
    try {
      const response = await axios({
        method: "get",
        url: apiUrl,
        headers: {
          Authorization: `Token ${token}`,
        },
      });
  
      const personNameData = response.data.results;
      console.log(response.data);
  
      const personListElement = document.getElementById("inputOrderingPerson");
  
      personNameData.forEach((person) => {
        const option = document.createElement("option");
        option.value = person.id;
        option.text = person.first_name + " " + person.last_name;
        if (person.id === purchaseId) {
          option.selected = true; // Seçilen kişiyi seçili olarak işaretle
        }
        personListElement.appendChild(option);
        personList.push(person);
      });
  
      // Check if there are more pages
      const nextPage = response.data.next;
      if (nextPage !== null) {
        const nextPage = page + 1;
        return await getOrderingPerson(personList, nextPage);
      } else {
        return personList;
      }
    } catch (error) {
      console.error(error);
    }
};

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value;
        searchData(searchTerm);
});
/*TABLODAKİ VERİLER ARASINDA ARAMA YAPMA */
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

/*GİRİŞ YAPAN KULLANICININ BİLGİLERİNİ ALIR */
async function getUserInfoId (){
    try {
      const apiUrl = `${baseUrl}accounts/user/`;
      const token = localStorage.getItem("token");
  
      const response = await axios({
        method: "get",
        url: apiUrl,
        headers: {
          Authorization: `Token ${token}`,
        },
      });
  
      const userInfo = response.data;
      const buttonsContainer = document.getElementById("buttons-container");
      if (userInfo.user_type === "AdminUser") {
        buttonsContainer.style.display = "block"
      }
  
      return userInfo;
    } catch (error) {
      console.error(error);
      throw error; // Re-throw the error to propagate it to the caller if needed
    }
  };
  
window.addEventListener('load', (event) => {
    getUserInfoId();
    getPurchase();
    });
    