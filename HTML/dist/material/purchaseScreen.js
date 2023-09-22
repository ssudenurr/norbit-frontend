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
function createPurchase(){
    const apiUrl= "http://backend.norbit.com.tr/purchase-request/list/"
    const token = localStorage.getItem('token');

    const transDate = new Date(purchasingDate);

    const year = transDate.getFullYear();
    const month = transDate.getMonth();
    const day = transDate.getDay();
    const fullDate = `${year}-${month < 10 ? `0${month}` : month }-${day < 10 ?  `0${day}` : day}`;
    axios ({
        method:'post',
        url: apiUrl,
        headers: {
            "Authorization": `Token ${token}`
        },
        data: {
            // owner: personName.value,
            product_name: productName.value,
            price: price.value,
            count: count.value,
            e_commerce_site: link.value,
            purchasing_date: fullDate,
            description: description.value,  
            responsible_person:responsiblePerson.value,
        }
    }).then((response)=>{
        console.log(response.data)
        clearInput();
        window.location.reload();
    }).catch((error) => {
          console.log(error);
        });

}
const getPurchaseData =(purchaseId) => {
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

        const transDate = new Date(purchasingDateData);

        const year = transDate.getFullYear();
        const month = transDate.getMonth();
        const day = transDate.getDay();
        const fullDate = `${year}-${month < 10 ? `0${month}` : month }-${day < 10 ?  `0${day}` : day}`;

        responsiblePerson.value = responsiblePersonData;

        productName.value = productNameData;
        price.value = priceData;
        count.value = countData;
        purchasingDate.value = fullDate;
        link.value = linkData;
        description.value = descriptionData;

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
    tableBody.innerHTML = '';
    requestData.forEach(async  item => {
        const newRow = document.createElement('tr');
        const owner = await getOwnerNameId(item.owner)
        const responsiblePerson = await getResponsibleId(item.responsible_person);
        
        console.log(responsiblePerson)
        newRow.innerHTML =  `
        <td><input class = "form-check-input" type = "checkbox" value=""</td>
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
            deletePurchase(this);
        });
    });
};  

const getOwnerNameId = async (id) => {
    const apiUrl= `http://backend.norbit.com.tr/ems/employee/${id}/`
    const token  = localStorage.getItem('token');

    const api = new Promise((resolve, reject) => {
        axios({
            method:'get',
            url:apiUrl,
            headers:{ 
                "Authorization": `Token ${token}`
            },
        }).then((response)=>{
            const firstname = response.data.first_name
            const lastname = response.data.last_name;
            const ownerData = firstname + ' ' + lastname;
            resolve(ownerData)
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
    const apiUrl= `http://backend.norbit.com.tr/ems/employee/${id}/`
    const token  = localStorage.getItem('token');

    const api = new Promise((resolve, reject) => {
        axios({
            method:'get',
            url:apiUrl,
            headers:{ 
                "Authorization": `Token ${token}`
            },
        }).then((response)=>{
            const firstname = response.data.first_name
            const lastname = response.data.last_name;
            const ownerData = firstname + ' ' + lastname;
            resolve(ownerData)
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

function getOwnerName(){
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
        console.log(personNameData)
        personNameData.forEach((person) => {
            const nameContent = document.getElementById('personName');
            nameContent.value= person.id;
            nameContent.text = person.first_name;

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
            purchasing_date: new Date (newPurchaseDate.value),
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
            console.log(response.data)
            if (response.status === 204) {

                window.location.reload();
               
            } else {
                console.error('Satır silinemedi.');
            }
            //resolve(dataList)
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
function clearInput(){

    productName.value = '';
    price.value = '';   
    count.value = '';
    link.value = '';
    purchasingDate.value = '';
    description.value = '';
    responsiblePerson.value ='';
}
window.addEventListener("load", (event) => {
    purchaseList();
    getOwnerNameId();
    getOwnerName();
})