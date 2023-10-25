
const siteName = document.getElementById('inputSiteName');
const siteLink = document.getElementById('inputSiteLink');
const mailAdress = document.getElementById('inputMail');
const accountPassword = document.getElementById('inputPassword');

const tableBody = document.querySelector('#account-info-table tbody');
const modal = new bootstrap.Modal(document.getElementById('exampleModal'));

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

const editBtn = document.getElementById('edit-btn');
const deleteBtn = document.getElementById('delete-btn');

const saveBtn = document.getElementById('save-btn');
saveBtn.style.display = 'none'
const addBtn = document.getElementById('add-btn');
addBtn.addEventListener('click', () =>{
    saveBtn.style.display = 'none';

    if(valueControl){    
        addNewInfo();
    }
    modal.hide();
    window.location.reload();
})
const closeBtn = document.getElementById('btn-close');
closeBtn.addEventListener('click', () =>{
    clearInput();
    saveBtn.style.display = 'none';
    addBtn.style.display = 'block';
})
function clearInput(){
    siteName.value = "";
    siteLink.value = "";
    mailAdress.value = "";
    accountPassword.value = "";
}
function valueControl () {
    const alert = document.getElementById("alertWarning"); 
    if (
    !siteName.value ||
    !siteLink.value ||
    !mailAdress.value ||
    !accountPassword.value
    ) {
        alert.style.display = "block";
    
        setTimeout(() => {
          alert.style.display = "none";
        }, 1600);
    
        return;
}
}
let dataList = [];
let currentPage = 1;
let itemsPerPage = 5;

const nextPageBtn = document.getElementById("next-page");
const prevPageBtn = document.getElementById("prev-page");
const pageNumber = document.getElementById('page-number');

function displayDataOnPage(){
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = dataList.slice(startIndex,endIndex);

    tableBody.innerHTML = "";
    showAccountInfo(pageData); 

}

nextPageBtn.addEventListener('click', () => {
    currentPage++;
    getAccountInfo(currentPage);
});

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        getAccountInfo(currentPage);
    }
});
async function getAccountInfo(itemsPerPage = 1) {
    const urlApi = `https://backend.norbit.com.tr/accountinfo/list/?page=${itemsPerPage}`;
    const token = localStorage.getItem('token');

        axios({
            method: 'get',
            url: urlApi,
            headers: {
                "Authorization": `Token ${token}`
            },
        }).then((response) => {
            const responseData = response.data.results;
            // const nextPage = response.next;

            showAccountInfo(responseData);

            responseData.map((item) => {
                dataList.push(item);
            });
            // if (nextPage) {
            //     // getAccountInfo(nextPage);
            // }
            // displayDataOnPage()
        }).catch((error) => {
            console.log(error);
        });
}
const showAccountInfo =  async (responseData) => {
    tableBody.innerHTML = '';
    responseData.forEach(item => {
        // console.log(responseData)
        const newRow = document.createElement('tr');
        const siteName = item.website_name || '-';
        const siteLink = item.website_link || '-';
        const siteMail= item.e_mail || '-';
        const sitePassword = item.password || '-';

    newRow.innerHTML = `
    <td><input class="form-check" type="checkbox" id="checkbox" value=""></td>    
    <td>${siteName}</td>
    <td>
        <a href="${siteLink}" target="_blank" style="text-decoration: underline!important; max-width: 220px; display: block;">
        ${siteLink.length > 45 ? siteLink.substr(0, 45) + " ..." : siteLink}
    </a>
</td>
    <td>${siteMail}</td>
    <td>${sitePassword}</td>

    `
    tableBody.appendChild(newRow);
    const checkBox = newRow.querySelector('input[type="checkbox"]');
    checkBox.addEventListener('change', (e) => {
        e.preventDefault();
        const infoId = item.id;

            if(this.checked){
                console.log("Seçilen satırın ID'si: " + infoId);
            }
            editBtn.addEventListener('click', () =>{
                getRowData(infoId);
                modal.show();
                addBtn.style.display = 'none';
                saveBtn.style.display = 'block'

                checkBox.checked = false;
            })
            saveBtn.addEventListener('click', () =>{
                valueControl();
                editAccountInfo(infoId);
            })
            deleteBtn.addEventListener('click', () =>{
                deleteAccountInfo(infoId)
            })
    
    }
    );
});
}

const addNewInfo = async () =>{
    const apiUrl = `https://backend.norbit.com.tr/accountinfo/list/`; 
    const token  = localStorage.getItem('token');

    valueControl();
    axios({        
        method:'post',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
        data:{
            website_name:siteName.value,
            website_link:siteLink.value,
            e_mail:mailAdress.value,
            password:accountPassword.value
        }    
    }).then(async (response)=>{
        // window.location.reload();
    }).catch((error) => {
          console.log(error);
        });

}


function getRowData(rowId){
    const apiUrl = `http://backend.norbit.com.tr/accountinfo/${rowId}/`
    const token  = localStorage.getItem('token');
  
    axios({
        method:'get',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
    }).then( async (response)=>{
        const rowData = response.data;
  
        const siteNameData = rowData.website_name;
        const siteLinkData = rowData.website_link;
        const siteMail = rowData.e_mail;
        const sitePassword = rowData.password;
  
  
        siteName.value = siteNameData;
        siteLink.value = siteLinkData;
        mailAdress.value = siteMail;
        accountPassword.value = sitePassword;
    })
  }

  function editAccountInfo(id) {
    const apiUrl = `http://backend.norbit.com.tr/accountinfo/${id}/`;
    const token = localStorage.getItem('token');

    axios({
        method: 'patch',
        url: apiUrl,
        headers: {
            "Authorization": `Token ${token}`
        },
        data: {
            website_name: siteName.value,
            website_link: siteLink.value,
            e_mail: mailAdress.value,
            password: accountPassword.value
        }
    }).then((response) => {
        const responseData = response;
        console.log(responseData);
        window.location.reload();
    }).catch((error) => {
        console.log('Hata oluştu:', error);
    });
}


function deleteAccountInfo(id) {
    const apiUrl = `http://backend.norbit.com.tr/accountinfo/${id}/`
    const token  = localStorage.getItem('token');

    axios({
        method:'delete',
        url:apiUrl,
        headers:{
            "Authorization" : `Token ${token}`, 
        }
    }).then((response) =>{
        console.log(response, 'Değer Başarıyla Silindi')
        window.location.reload();
    }).catch((error) =>{
        console.log('error',error)
    })
}
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();   
    searchData(searchTerm);
  });
async function searchData(searchTerm){
    const apiUrl = `https://backend.norbit.com.tr/accountinfo/list/?search=${searchTerm}`;
    const token  = localStorage.getItem('token');

    axios({
        method:'get',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
    }).then(response => {
        const searchData = response.data.results;
        const tableRows = document.querySelectorAll('#account-info-table tbody tr');
        
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
window.addEventListener('load', (event) => {
    getAccountInfo(1);
    });
    