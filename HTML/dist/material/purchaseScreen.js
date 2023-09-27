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

const modalContent = document.getElementById('modalContent');

// statusBtn.className('badge bg-success-subtle text-success text-uppercase')   
const statusBtn = document.getElementById('situation');

// statusBtn.addEventListener('click', () => {

// })
const closeBtn = document.getElementById('btn-close');
closeBtn.addEventListener('click', () => {
    modalButtonBox.innerHTML = ''
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
            purchasing_date: purchasingDate.value,
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
function formatDateToCustomFormat(date) {
    var yyyy = date.getFullYear();
    var MM = String(date.getMonth() + 1).padStart(2, '0'); // Ayı 2 basamaklı hale getiriyoruz
    var dd = String(date.getDate()).padStart(2, '0'); // Günü 2 basamaklı hale getiriyoruz
    var hh = String(date.getHours()).padStart(2, '0'); // Saati 2 basamaklı hale getiriyoruz
    var mm = String(date.getMinutes()).padStart(2, '0'); // Dakikayı 2 basamaklı hale getiriyoruz
  
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

        const transDate = new Date (purchasingDateData);

        responsiblePerson.value = responsiblePersonData;    
        productName.value = productNameData;
        price.value = priceData;
        count.value = countData;
        purchasingDate.value = formatDateToCustomFormat(transDate);
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
const purchaseList = () => {    // GETTING CONTACT INFORMATION FROM API
    const apiUrl = "http://backend.norbit.com.tr/purchase-request/list/";
    const token  = localStorage.getItem('token');
       
    axios({                                          
        method: 'get',
        url: apiUrl,
        headers: {
            "Authorization": `Token ${token}`
        }
    })
    .then(response =>{
        const requestData = response.data.results;
        showPurchase(requestData)
    })
    .catch(error => {
        console.error('hata oluştu',error);
    })
};
const showPurchase = async (requestData) => {
    tableBody.innerHTML ='';
    const loginnedUserId = await getUserInfoId();
    requestData.forEach(async  item => {
        const newRow = document.createElement('tr');
        const owner = await getOwnerNameId(item.owner)
        const responsiblePerson = await getResponsibleId(item.responsible_person);

        // console.log(requestData)
        newRow.innerHTML =  `
        <td><input class ="form-check-input" type ="checkbox" id="checkbox" value=""</td>
        <td>${owner}</td>
        <td>${responsiblePerson}</td>
        <td>${item.status}</td>
        <td>${item.product_name}</td>
        <td>${item.price}</td>
        <td>${item.count}</td>
        <td>${item.e_commerce_site}</td>
        <td>${item.purchasing_date}</td>
        <td>${item.description}</td>
        <td><button id="editBtn" class="btn btn-success btn-sm edit-btn" onclick='createEditButton(${item.id})' data-user-id='${item.id}' data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button></td>
        <td><button class="btn btn-danger btn-sm delete-btn" data-user-id='${item.id}'>Delete</button></td>
        `;

        tableBody.appendChild(newRow);
        const deleteBtn = newRow.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function () {
            deletePurchase(this, loginnedUserId);   
        });
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
            purchasing_date: newPurchaseDate.value,
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
function createEditButton(purchaseId){ 
    modalButtonBox.innerHTML += `
      <button type="button" class="btn btn-primary" id="row-edit-btn" onclick='editPurchaseRequest(${purchaseId})'>Düzenle</button>
    `;   

    modaltitle.innerHTML = "istek Düzenleme Formu"
    getPurchaseData(purchaseId)
}

const deletePurchase = async(delete_button) => {

    const ownerId = await getOwnerNameId();
    const loginnedUserId = await getUserInfoId();

    if (loginnedUserId === ownerId) {
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
            const loginnedUserId = response.data.id;
            const loginnedUserType = response.data.user_type;
            
            if (loginnedUserType === "AdminUser"){
                statusBtn.style.display = "block"
            }
            resolve(loginnedUserId);

        }).catch((error) => {
            reject(error);
            });
    });
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

searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    const searchTerm = searchInput.value.trim();    
    if (searchTerm === ''){
        alert('Lütfen bir arama terimi giriniz')
        return; 
    }
    searchResults(searchTerm)
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

function searchResults(searchTerm){
    const tableRows = document.querySelectorAll('#purchaseTable tbody tr');

    tableRows.forEach(row => {
        const rowData = row.textContent.toLowerCase(); // Satır verilerini küçük harfe çevirin.

        if (rowData.includes(searchTerm.toLowerCase())) {
            row.style.display = 'table-row'; // Eğer arama terimi bulunursa satırı gösterin.
        } else {
            row.style.display = 'none'; // Eğer arama terimi bulunmazsa satırı gizleyin.
        }
        if (searchInput.value === '') {
                row.style.display = 'table-row';
        }

})
}
window.addEventListener("load", (event) => {
    getUserInfoId();
    purchaseList();
    getOwnerNameId();
    getResponsiblePerson();


})