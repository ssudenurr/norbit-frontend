
const problemTitle = document.getElementById('problem-title-input');
const solutionDescription = document.getElementById('solution-description'); 
const solutionFileInput1 = document.getElementById('solution-file-1');
const solutionFileInput2 = document.getElementById('solution-file-2');
const solutionFileInput3 = document.getElementById('solution-file-3');

const modal = new bootstrap.Modal(document.getElementById('exampleModal'));

const createButton = document.getElementById('createButton');
createButton.addEventListener('click',() =>{
    saveButton.style.display='none';
    addButton.style.display = 'block'
    modal.show();
})

const saveButton  = document.getElementById('save-btn');

const addButton = document.getElementById('addBtn')
addButton.addEventListener('click', () => {
    valueControl();
  addToProblemSolve();                                                                                                                                                                                 
})

const closeBtn = document.getElementById('btn-close');
closeBtn.addEventListener('click', () =>{
clearInput();
})
let dataList = [];
let currentPage = 1;
const itemsPerPage = 5 ;

function displayDataOnPage() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const dataToDisplay = dataList.slice(startIndex, endIndex);

    tableBody.innerHTML = '';
    AddContent(dataToDisplay);
}

const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        getData(currentPage);
    }
});

nextPageBtn.addEventListener('click', () => {
    currentPage++;
    getData(currentPage);
});
const getData = async (page = 1) => {   
    const urlApi = `${baseUrl}knowhow/list/?page=${page}`;
    const token  = localStorage.getItem('token');
    const api = new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: urlApi,
            headers: { 
                "Authorization": `Token ${token}`
            },
        })
        .then((response) => {
            const knowHowData = response.data.results;
            AddContent(knowHowData);
            resolve(knowHowData);
        })
        .catch((error) => {
            reject(error);
        });
    });

    try {
        const knowHowData = await api;
        const results = knowHowData;
        const nextPage = knowHowData.next;

        results.forEach((item) => {
            dataList.push(item);
        });
        
        if (nextPage) {
            const nextPageNum = parsePageNumber(nextPage);
            getData(nextPageNum);
        } else {
            console.log(dataList);
        }

    } catch (e) {
        console.log(e);
    }
}
function valueControl() {
    const alert = document.getElementById('alertWarning'); // Define alert here
    if (
        !problemTitle.value ||
        !solutionDescription.value
    ) {
        alert.style.display = 'block';

        setTimeout(() => {
            alert.style.display = 'none';
        }, 1400);

        return false;
    }

    alert.style.display = 'none';
    return true; 

}


const AddContent = async (knowHowData) => {
    
    const knowHowList = document.getElementById('knowHow-list');
    knowHowList.innerHTML = '';
    const userId = await getUserInfoId();

    for (const item of knowHowData ) {
        const itemId = item.id;
        const knowHowDiv = document.createElement('div');
        knowHowDiv.classList.add('card', 'mb-3');
        const owner = await getOwner(item.owner) || '-';
        
        let documentLinks = '';

        for (let i = 1; i <= 3; i++) {
            const uploadField = `file_${i}`;
            const documentLink = item[uploadField];

            if (documentLink) {
                const fileName = documentLink.split('/').pop();
                documentLinks += `<li><a class="font-weight-bold fs-7" href="${documentLink}" style="text-decoration-underline !important" target="_blank" download>${fileName}</a></li>`;
            } else {
                documentLinks += '<li>-</li>';
            }
        }

        knowHowDiv.innerHTML = `
        <div class="card-body">
            <div class="text-muted">
                <div class="pt-3 border-top border-top-dashed mt-4 ">
                    <div class="row">
                        <div class="col-lg-4 col-sm-6">
                            <div>
                                <h6 class="form-label mb-3 fw-bold ">PROBLEM ADI</h6>
                                <p class="mb-3 fw-semibold custom-p">${item.problem || '-'}</p>
                            </div>
                        </div>
                        <div class="col-lg-4 col-sm-6">
                            <div>
                                <h6 class="form-label mb-3 fw-bold">PROBLEM AÇIKLAMASI</h6>
                                <p>${item.solve_text || '-'}</p>
                            </div>
                        </div>
                        <div class="col-lg-4 col-sm-6">
                            <div>
                                <h6 class="form-label mb-3 fw-bold  ">EKLEYEN KİŞİ</h6>
                                <p class="mb-3 fw-semibold custom-p">${owner || '-'}</p>
                            </div>
                        </div>
                        <div class="">
                            <div>
                                <div>
                                    <h6 class="form-label mb-3 fw-bold" id="uploaded-file-container-${item.id}">DOKÜMAN</h6>
                                    <ul>${documentLinks}</ul>
                                </div>
                            </div>
                        </div>
                        <div class="mt-auto d-flex justify-content-end align-items-end">
                            <div>
                                <button id="editBtn" class="btn btn-outline-success btn-m fw-semibold edit-btn" style="letter-spacing: 0.5px;" onclick='createEditButton(${item.id})' data-user-id='${userId}' data-bs-toggle="modal" data-bs-target="#exampleModal">Düzenle</button>
                                <button class="btn btn-outline-danger btn-mm fw-semibold delete-btn" style="letter-spacing: 0.5px;" onclick='deleteClickFunction(${item.id})' data-user-id='${item.id}'>Sil</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        deleteClickFunction(owner);
        knowHowList.appendChild(knowHowDiv);
    };
};

const addToProblemSolve = () => {
    const apiUrl = `${baseUrl}knowhow/create/`; 
    const token  = localStorage.getItem('token');
    
    const problemTitle = document.getElementById('problem-title-input').value;
    const solutionDescription = document.getElementById('solution-description').value; 
    // const solutionFileInput = document.getElementById('solution-file');

    // console.log(problemTitle);

    const solutionFile1 = solutionFileInput1.files[0];
    const solutionFile2 = solutionFileInput2.files[0];
    const solutionFile3 = solutionFileInput3.files[0];

    const formData = new FormData();
    
    formData.append('problem', problemTitle);
    formData.append('solve_text', solutionDescription);

    if (solutionFile1) {
        formData.append('file_1', solutionFile1);
    }

    if (solutionFile2) {
        formData.append('file_2', solutionFile2);
    }

    if (solutionFile3) {
        formData.append('file_3', solutionFile3);
    }
    // else {
    //     formData.append('file', '');
    // }
  
    axios.post(apiUrl, formData, {
        headers:{ 
            "Authorization": `Token ${token}`,
            "Content-Type": "multipart/form-data"
        } 
    })
    .then((response)=>{

        window.location.reload()
        // console.log(response.data);

    }).catch((error) => {
        console.log(error)
    })
   
}

// const writeContent = async ()=>{
//     const accordionBox = document.getElementById('accordionExample');
//  await getData();

//     setTimeout(() => {

//         for (let i=0; i < dataList.length; i++){
//         AddContent(dataList[i]);
//     }
//     }, 100)

// }

const deleteClickFunction = async () => {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    const userInfo = await getUserInfoId();
    const loginnedUserId = userInfo.id;
    const userType = userInfo.user_type;

    deleteButtons.forEach( async (deleteButton) => {
        deleteButton.addEventListener('click', (event) => {
            const pageId = event.currentTarget.getAttribute('data-user-id'); // Use 'data-user-id' here
            const userId = event.currentTarget.getAttribute('data-user-id');
            console.log(userId, loginnedUserId)
        
            if (loginnedUserId == userId || userType === 'AdminUser') {
                deleteProblem(pageId);
            } else {
                console.log('You are not authorized to delete this item.');
            }
        });

    });
}
const getUserInfoId = async () => { //GİRİŞ YAPAN KİŞİNİN BİLGİLERİ
    const apiUrl= `${baseUrl}accounts/user/`
    const token  = localStorage.getItem('token');
    const api = new Promise((resolve, reject) => {
        axios ({
            method:'get',
            url: apiUrl,
            headers: {
                "Authorization": `Token ${token}`
            },
        }).then((response)=>{
            const loginInfo = response.data;

            resolve(loginInfo);

            // console.log(fullName)
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
const getOwner = async (id) => {
    const apiUrl= `${baseUrl}ems/list/?id=${id}`
    const token  = localStorage.getItem('token');
    const api = new Promise((resolve, reject) => {
    axios ({
        method:'get',
        url: apiUrl,
        headers: {
            "Authorization": `Token ${token}`
        },
    }).then((response)=>{
        const responseData = response.data.results;

        const ownerData = responseData.map((item) => {
            const firstname = item.first_name;
            const lastname = item.last_name;
            return firstname + ' ' + lastname
            
        });

        // console.log(ownerData)
        resolve(ownerData);

    }).catch((error) => {
        reject("null")
        console.log(error);

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

const deleteProblem = async(pageId) =>{
    const apiPageUrl = `${baseUrl}knowhow/detail/${pageId}/`;
    const token  = localStorage.getItem('token');  

    const removeData = new Promise ((resolve,reject) =>{

        axios ({
            method:'delete',
            url:apiPageUrl,
            headers:{ 
                "Authorization": `Token ${token}`
            },
        }).then((response) =>{
            if (response.status === 204) {

                window.location.reload();
               
            } else {
                console.error('Satır silinemedi.');
            }
            resolve();
        }).catch((error) =>{
            reject(error,'error');
        })
    });
    try {
        const response = await removeData;
        return response;
    }
    catch (e) {
        return e
    }
}

const editToProblem = async (itemId) => {
    // console.log(itemId);
    const pageApi = `${baseUrl}knowhow/detail/${itemId}/`;
    const token = localStorage.getItem('token');

    const newProblemContent = document.getElementById('problem-title-input').value;
    const newDescription = document.getElementById('solution-description').value;

    const newDocumention1 = document.getElementById('solution-file-1');
    const newDocumention2 = document.getElementById('solution-file-2');
    const newDocumention3 = document.getElementById('solution-file-3');

    // console.log(newDocumention1.files);

    const formData = new FormData();
    formData.append('problem', newProblemContent);
    formData.append('solve_text', newDescription);

    if (newDocumention1.files[0]) {
        formData.append('file_1', newDocumention1.files[0]);
    }

    if (newDocumention2.files[0]) {
        formData.append('file_2', newDocumention2.files[0]);
    }

    if (newDocumention3.files[0]) {
        formData.append('file_3', newDocumention3.files[0]);
    }

    try {
        const response = await axios.patch(pageApi, formData, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) =>{

        })

        // console.log(response.data);
        window.location.reload();
        return response;
    } catch (error) {
        console.error('EditToProblem Error:', error);
        return error;
    }
}
function createEditButton(pageId) {
    document.querySelector('.modal-title').innerHTML = '';
    saveButton.style.display = 'block';
    addButton.style.display = 'none';

    // Get the row data
    getRowData(pageId);

    saveButton.addEventListener('click', async () => {

        const fileIds = ['file_1', 'file_2', 'file_3'];
        fileIds.forEach(fileId => {
            const uploadedLink = document.getElementById(`uploaded-link-${fileId.charAt(fileId.length - 1)}`);
            if (uploadedLink.textContent === '-') {
                deleteFile(pageId, fileId);
            }
        });
        if(valueControl()){
        // window.location.reload();
        await editToProblem(pageId);
        clearInput();
        }

    });
}


function getRowData(pageId) {
    const apiUrl = `${baseUrl}knowhow/detail/${pageId}/`;
    const token = localStorage.getItem('token');

    axios({
        method: 'get',
        url: apiUrl,
        headers: {
            "Authorization": `Token ${token}`
        },
    }).then(async (response) => {
        const problemData = response.data;

        const problemNameData = problemData.problem || '-';
        const descriptionData = problemData.solve_text || '';

        problemTitle.value = problemNameData;
        solutionDescription.value = descriptionData;
        
        const uploadList = document.getElementById('upload-data');
        const uploadData1 = problemData.file_1 || '';
        const uploadData2 = problemData.file_2 || '';
        const uploadData3 = problemData.file_3 || '';

        const fileName1 = uploadData1 ? uploadData1.split('/').pop() : '-';
        const fileName2 = uploadData2 ? uploadData2.split('/').pop() : '-';
        const fileName3 = uploadData3 ? uploadData3.split('/').pop() : '-';
        
        function showFileName(inputId, listId, uploadedLinkId, fileId) {
            const solutionFileInput = document.getElementById(inputId);
            const list = document.getElementById(listId);
            const uploadedLink = document.getElementById(uploadedLinkId); // Yüklenen dosyanın linki
        
            solutionFileInput.addEventListener('change', (event) => {
                const selectedFile = event.target.files[0];
                const fileName = selectedFile ? selectedFile.name : '';
        
                if (fileName) {
                    const listItem = document.createElement('li');
                    listItem.textContent = fileName;
                    list.appendChild(listItem);
        
                    // Yüklenen dosyanın linkini güncelle
                    uploadedLink.textContent = fileName;
                }
            });

        }
        uploadList.innerHTML = `
        <div>
            <input type="file" id="solution-file-1" hidden/>
            <label for="solution-file-1" class="btn btn-warning btn-sm fs-14">Dosya Seç</label>
            <li>
                <a id="uploaded-link-1" href="${uploadData1}" class="uploaded-link-1 font-weight-bold fs-7">${fileName1}</a>
                <a class="mdi mdi-close delete-button" data-file-id="file_1" style="float: right;" ></a><br>       
            </li>
        </div>

        <div>
            <input type="file" id="solution-file-2" hidden/>
            <label for="solution-file-2" class="btn btn-warning btn-sm fs-14">Dosya Seç</label>
            <li>
                <a id="uploaded-link-2" href="${uploadData2}" class="uploaded-link-2 font-weight-bold fs-7">${fileName2}</a>
                <a class="mdi mdi-close delete-button" data-file-id="file_2" style="float: right;" ></a><br>       
            </li>
        </div>

        <div> 
            <input type="file" id="solution-file-3" hidden/>
            <label for="solution-file-3" class="btn btn-warning btn-sm fs-14">Dosya Seç</label>
            <li>
                <a id="uploaded-link-3" href="${uploadData3}" class="uploaded-link-3 font-weight-bold fs-7">${fileName3}</a>
                <a class="mdi mdi-close delete-button" data-file-id="file_3" style="float: right;" ></a><br>
            </li>    
        </div>
    
        `;

        // Dosya adlarını görüntüleme fonksiyonlarını çağır
        showFileName('solution-file-1', 'solution-file-1', 'uploaded-link-1');
        showFileName('solution-file-2', 'solution-file-2', 'uploaded-link-2');
        showFileName('solution-file-3', 'solution-file-3', 'uploaded-link-3');

        const deleteButtons = document.querySelectorAll('.delete-button');

        deleteButtons.forEach(deleteButton => {
            deleteButton.addEventListener('click', () => {
                const fileId = deleteButton.getAttribute('data-file-id');
                const listItem = deleteButton.closest('li');
                const uploadedLink = listItem.querySelector(`#uploaded-link-${fileId.charAt(fileId.length - 1)}`);
        
                uploadedLink.textContent = '-';
            });
        });
        
        problemTitle.value = problemNameData;
        solutionDescription.value = descriptionData;
    }).catch((error) => {
        console.error(error);
    });
}

const deleteFile = async (pageId, fileId) => {
    const apiPageUrl = `${baseUrl}knowhow/detail/${pageId}/`;
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append(fileId, "");

    axios({
        method: 'patch',
        url: apiPageUrl,
        headers: {
            "Authorization": `Token ${token}`,
            'Content-Type': 'multipart/form-data',
        },
        data: formData
    }).then((response) => {
        if (response.status === 200) {
            // File deleted successfully
        } else {
            console.error('File could not be deleted.');
        }
    }).catch((error) => {
        console.error(error);
    });
}
function clearInput() {
    problemTitle.value = '';
    solutionDescription.value = '';
    document.querySelectorAll('.uploaded-link-1').forEach(link => {
        link.textContent = '-';
    });
    document.querySelectorAll('.uploaded-link-2').forEach(link => {
        link.textContent = '-';
    });
    document.querySelectorAll('.uploaded-link-3').forEach(link => {
        link.textContent = '-';
    });
}

window.addEventListener("load", (event)  =>  {
  getData(1);

})