const addBtn = document.getElementById('add-btn')
const modaltitle = document.getElementById('exampleModalLabel');

const personName = document.getElementById('personName')
const productName = document.getElementById('productName');
const price = document.getElementById('price');
const count = document.getElementById('count')
const link = document.getElementById('link');
const purchasingDate = document.getElementById('purchasingDate')
const description = document.getElementById('description');
const responsiblePerson = document.getElementById('responsible-person');

const tableBody = document.querySelector('#purchaseTable tbody');
const modalButtonBox = document.getElementById('button-box');

const modalContent = document.getElementById('exampleModal');

const cancelBtn = document.getElementById('cancel');

const statusBtn = document.getElementById('situation');
statusBtn.style.display = "none"

statusBtn.addEventListener('click', () => {
    updatePurchaseStatus();
    });
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
            status: 'Onaylandı',
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

const closeBtn = document.getElementById('btn-close');
closeBtn.addEventListener('click', () => {
    modalButtonBox.innerHTML = '';
    clearInput();
})
addBtn.addEventListener('click', () =>{
    clearInput();
    modalButtonBox.innerHTML += `
    <button type="button" class="btn btn-primary" id="row-add-btn" onclick='createPurchase()'>Ekle</button>
    `;
})

async function createPurchase(){
    const apiUrl= "http://backend.norbit.com.tr/purchase-request/list/"
    const token = localStorage.getItem('token');


    axios ({
        method:'post',
        url: apiUrl,
        headers: {
            "Authorization": `Token ${token}`
        },
        data: {
            responsible_person:responsiblePerson.value,
            product_name: productName.value,
            price: price.value,
            count: count.value,
            purchasing_date: formatDateToCustomFormat(purchasingDate.value),
            e_commerce_site: link.value,
            description: description.value,  

        }
    }).then(async (response)=>{
        getResponsiblePerson();
        clearInput();
        window.location.reload();
    }).catch((error) => {
          console.log(error);
        });

}
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
const getPurchaseData = (purchaseId) => {
const apiUrl = `http://backend.norbit.com.tr/purchase-request/${purchaseId}/`;
const token  = localStorage.getItem('token');

axios({
    method:'get',
    url:apiUrl,
    headers:{ 
        "Authorization": `Token ${token}`
    },
})
.then(async (response) => {
    const purchaseData =response.data;

    const responsiblePersonData = await getResponsibleId(purchaseData.responsible_person);

    const productNameData = purchaseData.product_name;
    const priceData = purchaseData.price;
    const countData = purchaseData.count;
    const purchasingDateData = purchaseData.purchasing_date;
    const linkData = purchaseData.e_commerce_site;
    const descriptionData = purchaseData.description;

    // const transDate = new Date (purchasingDateData);

    responsiblePerson.value = responsiblePersonData;    
    productName.value = productNameData;
    price.value = priceData;
    count.value = countData;
    purchasingDate.value = formatTarih(purchasingDateData);
    link.value = linkData;
    description.value = descriptionData;
    getResponsiblePerson(purchaseData.responsible_person);
})
.catch((error) => {
    console.error(error)
});
}
function getModalValues(){
    const data = {

        "responsiblePerson": responsiblePerson.value,
        "productName": productName.value,
        "price": price.value,
        "count": count.value,
        "purchasingDate":purchasingDate.value,
        "link": link.value,
        "description":description.value,
        
    }
    return data;
}
let dataList = [];

const id = 1;

const purchaseList = async (url = null) => {
  let urlApi;
  if (url === null) {
    urlApi = `http://backend.norbit.com.tr/purchase-request/list/?page=${id}`;
  } else {
    urlApi = url;
  }

  const token = localStorage.getItem('token');
  const api = new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: urlApi,
      headers: {
        "Authorization": `Token ${token}`
      },
    })
      .then((response) => {
        const requestData = response.data.results;
        showPurchaseRequest(requestData);
        resolve(requestData);
      })
      .catch((error) => {
        reject(error);
      });
  });

  try {
    const requestData = await api;
    console.log(requestData);
    const results = requestData;
    const nextPage = requestData.next;

    results.forEach((item) => {
      dataList.push(item);
    });

    if (nextPage) {
      purchaseList(nextPage);
    } else {
      console.log(dataList);
    }
  } catch (e) {
    console.log(e);
  }
};

purchaseList();




const showPurchaseRequest = async (requestData) => {
    // tableBody.innerHTML ='';
    requestData.forEach(async  item => {
        let newRow = document.createElement('tr') ;
        const owner = await getOwnerNameId(item.owner) || '-';
        const responsiblePerson = await getResponsibleId(item.responsible_person) || '-';

        const statusData = item.status === 'İptal Edildi' ? 'badge bg-danger fw-semibold' : 'badge bg-success fw-semibold';        
        
        const productName = item.product_name || '-';
        const price = item.price || '-';
        const count = item.count || '-';
        const e_commerce_site = item.e_commerce_site || '-';
        const purchasing_date = formatTarih(item.purchasing_date) || '-';
        const description = item.description || '-';
        newRow.innerHTML =  `
        <td><input class ="form-check-input" type ="checkbox" id="checkbox" value=""</td>
        <td>${owner}</td>
        <td>${responsiblePerson}</td>
        <td><span class="badge ${statusData} fs-12">${item.status}</span></td>        
        <td>${productName}</td>
        <td>${price}</td>
        <td>${count}</td>
        <td>
        <a href="${e_commerce_site}" target="_blank" style="text-decoration: underline!important; max-width: 100px; display: block;">
            ${e_commerce_site.length > 25 ? e_commerce_site.substr(0, 25) + ' ...' : e_commerce_site}
        </a>
        </td>
        <td>${purchasing_date}</td>  
        <td>${description}</td>
        <td><button id="editBtn" class="btn btn-outline-success mdi mdi-pencil btn-sm fs-5 edit-btn" data-bs-toggle ="modal" data-bs-target="#exampleModal" data-user-id='${item.id}'></button>
        <button class="btn btn-outline-danger mdi mdi-close btn-sm fs-5 delete-btn" data-user-id='${item.id}'></button></td>
        
        `;

        tableBody.appendChild(newRow);
        const deleteBtn = newRow.querySelector('.delete-btn');
        const editBtn = newRow.querySelector('.edit-btn')

        const ownerid = item.owner;
        const loginnedUser = await getUserInfoId();
        const loginnedUserId = loginnedUser.id;
        const loginnedUserType = loginnedUser.user_type;
        
        
        if(loginnedUserId === ownerid || loginnedUserType ==='AdminUser'){

            deleteBtn.addEventListener('click', function () {
                deletePurchase(this, loginnedUserId);   
            });

            editBtn.addEventListener('click', ()=>{
                createEditButton(item.id)
            });

        }else{
            editBtn.removeAttribute('onclick');
            editBtn.classList.add('disabled');

            deleteBtn.removeAttribute('onclick');
            deleteBtn.classList.add('disabled');
        }

        const checkbox = newRow.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', function (e) {
            e.preventDefault();
            const itemId = item.id;
            if (this.checked) {

                console.log("Seçilen satırın ID'si: " + itemId);
            }   
            statusBtn.addEventListener('click', () => {
                updatePurchaseStatus(itemId);
                });
            
            cancelBtn.addEventListener('click', () =>{
                cancelRequest(itemId);
            });
            });

clearInput();
        
            
    });
};  

const getOwnerNameId = async (id) => {
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

function editPurchaseRequest(purchaseId){
    const apiUrl = `http://backend.norbit.com.tr/purchase-request/${purchaseId}/`; 
    const token  = localStorage.getItem('token');

    const newResponsible = document.getElementById('responsible-person');
    const newProductName = document.getElementById('productName')
    const newPrice = document.getElementById('price');
    const newCount = document.getElementById('count');
    const newPurchaseDate = document.getElementById('purchasingDate');
    const newLink = document.getElementById('link');
    const newDescription = document.getElementById('description');


    axios({
        method:'patch',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
        data:{

            responsible_person: newResponsible.value,
            product_name: newProductName.value,
            price: newPrice.value,
            count: newCount.value,
            purchasing_date: formatDateToCustomFormat(newPurchaseDate.value),
            link: newLink.value,
            description:newDescription.value,
        }
    })
    .then((response)=>{
        const userData = response.data;
        console.log(userData)
        window.location.reload();   
    }).catch((error) => {
        console.error(error)
    });
}
async function createEditButton(purchaseId) { 
    // const loginnedUserId = await getUserInfoId();    
    // const ownerID = await getOwnerNameId();
    // console.log(ownerID,loginnedUserId)
    // if(loginnedUserId === ownerID){
    modalButtonBox.innerHTML += `
      <button type="button" class="btn btn-primary" id="row-edit-btn" onclick='editPurchaseRequest(${purchaseId})'>Düzenle</button>
    `;   

    modaltitle.innerHTML = "İstek Düzenleme Formu";
    getPurchaseData(purchaseId);

}


const deletePurchase = async(delete_button) => {

     Id = delete_button.getAttribute('data-user-id');
    const apiUrl = `http://backend.norbit.com.tr/purchase-request/${Id}/`;
    const token  = localStorage.getItem('token');

    const api = new Promise((resolve, reject) => {
        console.log('hello')
        axios({
            method:'delete',
            url:apiUrl,
            headers:{ 
                "Authorization": `Token ${token}`
            },
        }).then((response)=>{
            const dataList = response.data;

            if (response.status === 204) {

                window.location.reload();
               
            } else {
                console.error('Satır silinemedi.');
            }
            console.log(dataList)
            resolve(dataList)
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

const getUserInfoId = async () => { //GİRİŞ YAPAN KİŞİNİN BİLGİLERİ
    const apiUrl= "http://backend.norbit.com.tr/accounts/user/"
    const token  = localStorage.getItem('token');
    const api = new Promise((resolve, reject) => {
        axios ({
            method:'get',
            url: apiUrl,
            headers: {
                "Authorization": `Token ${token}`
            },
        }).then((response)=>{
            const userInfo = response.data;

            if (userInfo.user_type === "AdminUser"){
                statusBtn.style.display = "inline-block "
            }
            resolve(userInfo);

        }).catch((error) => {
            reject(error);
            });
    });
    
    try{
        const res = await api;
        return res;
    }
    catch (e){
        console.log(e)
    }
}

function clearInput(){

    productName.value = '';
    price.value = '';   
    count.value = '';
    link.value = '';
    purchasingDate.value = '';
    description.value = '';
    responsiblePerson.value ='';
}
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

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
        const tableRows = document.querySelectorAll('#purchaseTable tbody tr');
        
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
        showPurchaseRequest(searchData); 

    })
    .catch(error => {
        console.error('Arama sırasında hata oluştu: ', error);
    });
}
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') {

        const tableRows = document.querySelectorAll('#purchaseTable tbody tr');
        tableRows.forEach(row => {
            row.style.display = 'table-row';
        });
    } else {
        searchData(searchTerm);
    }
});
    // async function searchData(search){


    //     const apiUrl = `http://backend.norbit.com.tr/purchase-request/?search=${search}`;
    //     const token  = localStorage.getItem('token');

    //     axios({
    //         method:'get',
    //         url:apiUrl,
    //         headers:{ 
    //             "Authorization": `Token ${token}`
    //         },
    //     }).then(response => {
    //         const searchData = response.data;
    //         searchResults(searchData, searchTerm);

    //     })
    //     .catch(error => {
    //         console.error('Arama sırasında hata oluştu: ', error);
    //     });
    // }

window.addEventListener("load", (event) => {
    getUserInfoId();
    purchaseList();
    getOwnerNameId();
    getResponsiblePerson();
})