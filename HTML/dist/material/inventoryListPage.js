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
const categoryInput = document.getElementById('inputCategory');
const orderingPersonInput = document.getElementById('inputOrderingPerson');
const modaltitle = document.getElementById('exampleModalLabel');

const addButton = document.getElementById('add-btn');
const rowAdd = document.getElementById('row-add-btn')
const editButton = document.getElementById('edit-btn');
const rowEdit = document.getElementById('editBtn');
const rowDelete = document.getElementById('delete-btn');

const closeBtn = document.getElementById('btn-close');
closeBtn.addEventListener('click', () => {
    const checkBox = document.querySelector('input[type="checkbox"]');
    checkBox.checked = false;
    modal.hide();
    clearInput();
});


function valueControl(){
    const alert = document.getElementById("alertWarning"); 
    if(
        !productNameInput.value ||
        !purchaseDate.value ||
        !whereInTheOfficeInput.value ||
        !priceInput.value ||
        !countInput.value ||
        !categoryInput 

    ){
        alert.style.display = "block";
    
        setTimeout(() => {
          alert.style.display = "none";
        }, 1600);
    
        return;
}
};

addButton.addEventListener('click', () => {
    rowAdd.style.display = "block"
    getCategoryList();
    rowEdit.style.display = 'none';
    modaltitle.innerHTML = '';
        rowAdd.addEventListener('click', () => {
            valueControl();
            createInventory();
        });
    clearInput();
})
/*UZUN FORMATTAKİ TARİHİ KISA FORMATA ÇEVİRİR */
function formatTarih(date) {
    if (date) {
      const datePieces = date.split("T");
      if (datePieces.length > 0) {
        return datePieces[0];
      }
    }
    return null; // Eksik tarih için null değeri döndürün
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

/*YENİ BİR ENVANTER BİLGİSİ EKLENİR */
function createInventory(){
  const apiUrl= `${baseUrl}inventory/create/`;
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
        category:[categoryInput.value],
        project: [],
        ordering_person:[orderingPersonInput.value],
        
      }
  }).then((response) => {
    window.location.reload();

  }).catch((error) => {
      console.log(error)
  })
}
/*İLGİLİ SATIRIN BİLGİLERİNİ MODALA DOLDURUR */
function getRowData(rowId){
  const apiUrl = `${baseUrl}inventory/${rowId}/`
  const token  = localStorage.getItem('token');

  axios({
      method:'get',
      url:apiUrl,
      headers:{ 
          "Authorization": `Token ${token}`
      },
  }).then( async (response)=>{
      const rowData = response.data;
      
      const orderingPersonData = await getOrderingPersonId(rowData.ordering_person);
      const productNameData = rowData.product_name;
      const purchaseDateData = rowData.satin_alinan_tarih;
      console.log(purchaseDateData);
      const whereInTheOfficeInputData = rowData.where_in_the_office;
      const priceData = rowData.price;
      const countData = rowData.count;
      const linkData = rowData.e_commerce_site;
      const descriptionData = rowData.description;
      const categoryData = await getCategoryId(rowData.category);

      orderingPersonInput.value = orderingPersonData;
      categoryInput.value = categoryData;
      purchaseDate.value = formatTarih(purchaseDateData);
      console.log(purchaseDate.value);
      whereInTheOfficeInput.value = whereInTheOfficeInputData;
      productNameInput.value = productNameData;
      priceInput.value = priceData;
      countInput.value = countData;
      linkInput.value = linkData;
      descriptionInput.value = descriptionData; 
      getCategoryList(rowData.category);
      getOrderingPerson(rowData.ordering_person)

  }).catch((error) => {
    console.error(error);
  });
};

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
    showInventory(pageData); 

};

/*BİR SONRAKİ SAYFAYA GEÇMEK İÇİN */
nextPageBtn.addEventListener('click', () => {
    currentPage++;
    getInventory(currentPage);
});

/*BİR ÖNCEKİ SAYFAYA GEÇMEK İÇİN */
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        getInventory(currentPage);
    }
});
/*ENVANTER LİSTESİNİ ALIR */
async function getInventory(itemsPerPage = 1){

    const urlApi = `${baseUrl}inventory/list/?page=${itemsPerPage}`;
    

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
};
/*SEÇİLEN ENVANTER BİLGİSİNİN DEĞERLERİNİ DÜZENLER */
function editInventory(inventoryId){
  const apiUrl = `${baseUrl}inventory/${inventoryId}/`
  const token  = localStorage.getItem('token');

  axios({
      method:'patch',
      url:apiUrl,
      headers:{
          "Authorization": `Token ${token}`
      },
      data:{
          ordering_person:[orderingPersonInput.value],
          product_name:productNameInput.value,
          satin_alinan_tarih:formatDateToCustomFormat(purchaseDate.value),
          where_in_the_office:whereInTheOfficeInput.value,
          price:priceInput.value,
          count:countInput.value,
          e_commerce_site:linkInput.value,
          description:descriptionInput.value,
          category:[categoryInput.value],
      }
  }).then((response)=>{
      // const userData = response.data
      window.location.reload();   

  }).catch((error) => {
      console.error(error)
  });
}   
/*SEÇİLEN ENVANTER DEĞERİNİ SİLER */
function deleteInventory(inventoryId){
  const apiUrl = `${baseUrl}inventory/${inventoryId}/`
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

};

/*TABLODAKİ VERİLERİ ASC VE DESC OLARAK SIRALAR */
let currentSortOrder = 'asc';
const table = document.getElementById("inventory-table");
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


const headers = document.querySelectorAll("thead th");
/*TABLODAKİ BAŞLIKLARA TIKLANDIĞI ZAMAN BAŞLIĞIN VE SIRALANAN VERİLERİN RENGİ DEĞİŞİR */
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

/*EKLENEN ENVANTER BİLGİLERİNİ TABLODA GÖSTERİR */
const showInventory =  async (responseData) => {
    tableBody.innerHTML = '';
    for (const item of responseData) {
        const newRow = document.createElement('tr');
        const purchasing_date = item.satin_alinan_tarih ? formatTarih(item.satin_alinan_tarih) : '-';
        const product_name = item.product_name || '-';
        const where_in_the_office = item.where_in_the_office || '-';
        const price = item.price || '-';
        const count = item.count || '-';
        const e_commerce_site = item.e_commerce_site || '-';
        const description = item.description || '-';
        const orderingPerson = (item.ordering_person && item.ordering_person.length > 0) ? await getOrderingPersonId(item.ordering_person) : '-';
        // console.log(item.category[0]);
        // const categoryName = await getCategoryId(item.category[0]) ;
        const categoryName = await getCategoryId(item.category[0]) || '-'
        newRow.innerHTML = `
        <td><input class="form-check" type ="checkbox"  id="checkbox" </td>
        <td>${product_name}</td>
        <td>${orderingPerson}</td>
        <td>${purchasing_date}</td>
        <td>${categoryName}</td>
        <td>${price}</td>
        <td>${count}</td>
        <td>${where_in_the_office}</td>
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

            editButton.addEventListener('click', () =>{
                rowAdd.style.display = "none";
                rowEdit.style.display = "block";
                getRowData(inventoryId);
                modal.show();
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
};

/*KATEGORİ LİSTESİNİ GÖSTERİR */
function getCategoryList() {
    // GET COMPANY NAME
    const apiUrl = `${baseUrl}category/`;
    const token = localStorage.getItem("token");
  
    axios({
      method: "get",
      url: apiUrl,
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        const categoryeData = response.data.results;
        categoryInput.innerHTML =  "";
        
        categoryeData.forEach((item) =>{
        const option = document.createElement("option");
            option.value = item.id;
            option.text = item.name;
            categoryInput.appendChild(option); 
        })
  
      })
      .catch((error) => {
        console.log(error);
      });
  }

/* KATEGORİ İSİMLERİNİ TEK TEK ALIR */
async function getCategoryId(id) {
const apiUrl = `${baseUrl}category/${id}`;
const token = localStorage.getItem("token");

try {
    const response = await axios({
        method: "get",
        url: apiUrl,
        headers: {
            Authorization: `Token ${token}`,
        },
    });

    const responseData = response.data;
    const categoryName = responseData.name;
    return categoryName;
} catch (error) {
    console.log(error);
    return null; // Return a default value or handle the error as needed
}
};

/*SİPARİŞ VEREN KİŞİ BİLGİLERİ İÇİN PERSONEL LİSTESİNİ ALIR */
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

/*SİPARİŞ VEREN KİŞİNİN İSİM SOYİSİM BİLGİSİNİ ALIR*/
const getOrderingPersonId = async (id) => {
    const apiUrl= `${baseUrl}ems/list/?id=${id}`
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
            const personData = responseData.map((item) => {
                const firstname = item.first_name;
                const lastname = item.last_name;
                return firstname + ' ' + lastname;
            });

            resolve(personData);
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
searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();
    searchData(searchTerm);
  });
  
/*TABLODAKİ VERİLER ARASINDA ARAMA YAPMA */
async function searchData(searchTerm){
    const apiUrl = `${baseUrl}inventory/list/?search=${searchTerm}`;
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

    
    })

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
    getOrderingPerson();

    // getResponsiblePerson();
    getInventory(1);
    // writeContent();
})
