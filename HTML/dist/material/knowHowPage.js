
const addButton = document.getElementById('addBtn')
addButton.addEventListener('click', () => {
    
  addToProblemSolve();                                                                                                                                                                                 
})
const problemTitle = document.getElementById('problem-title-input');
const solutionDescription = document.getElementById('solution-description'); 
const solutionFileInput = document.getElementById('solution-file');

const saveButton  = document.getElementById('save-btn');

let dataList = [];

const getData = async (url=null) => {   
    let urlApi;
    if (url === null) {
        urlApi = `http://backend.norbit.com.tr/knowhow/list/`; 
    }
    else {
        urlApi = url; 
    }

    const token  = localStorage.getItem('token');
    const api = new Promise((resolve, reject) => {
        axios({
            method:'get',
            url: urlApi,
            headers:{ 
                "Authorization": `Token ${token}`
            },
        })
        .then((response)=>{
            const knowHowData =response.data.results;
            AddContent(knowHowData)
            resolve(knowHowData)
            
    
        }).catch((error) => {
            reject(error)
        });
    });

    try{
        const response = await api;
        const results = response.data;
        const nextPage = response.next;

        results.forEach((item) => {
            dataList.push(item);
        });

        // eger next page varsa diğer sayfanın verilerini de al
        
        if (nextPage){
            getData(nextPage);
        }
        else {
            return dataList;
        }

    }
    catch (e){
        console.log(e)
    }
   
}
const AddContent = async (knowHowData) => {
    
    const knowHowList= document.getElementById('knowHow-list');
    knowHowList.innerHTML = '';
    const userId = await getUserInfoId();


    // console.log(knowHowData.owner);

    knowHowData.forEach(async item  => {
        const itemId = item.id;
        const knowHowDiv = document.createElement('div');
        knowHowDiv.classList.add('card', 'mb-3');
        const owner = await getOwner(item.owner) || '-';
        knowHowDiv.innerHTML = `
        <div class="card-body">
            <div class="text-muted">
                <div class="pt-3 border-top border-top-dashed mt-4 ">
                    <div class="row">
                        <div class="col-lg-4 col-sm-6">
                            <div>
                                <h6 class="form-label mb-3 fw-semibold text-uppercase ">Problem Adı</h6>
                                <p class="mb-3 fw-semibold text-uppercase custom-p">${item.problem || '-'}</p>
                            </div>
                        </div>
                        <div class="col-lg-4 col-sm-6">
                            <div>
                                <h6 class="form-label mb-3 fw-semibold text-uppercase">Problem Açıklaması</h6>
                                <p>${item.solve_text || '-'}</p>
                            </div>
                        </div>
                        <div class="col-lg-4 col-sm-6">
                            <div>
                            <h6 class="form-label mb-3 fw-semibold text-uppercase ">Ekleyen Kişi</h6>
                            <p class="mb-3 fw-semibold text-uppercase custom-p">${owner || '-'}</p>
                            </div>
                        </div>
                        <div class="">
                            <div>
                                <h6 class="form-label mb-3 fw-semibold text-uppercase" id="uploaded-file-container-${item.id}">Doküman</h6>
                                <li><a href="${item.upload}" type="file" class="form-label" id="problem-file-input-${item.id}">${item.upload}</a></li>    
                            </div>
                        </div>
                        <div class="mt-auto d-flex justify-content-end align-items-end">
                            <div>
                                <button id="editBtn" class="btn btn-success btn-m edit-btn" onclick='createEditButton(${item.id})' data-user-id='${userId}' data-bs-toggle="modal" data-bs-target="#exampleModal">Düzenle</button>
                                <button class="btn btn-danger btn-mm delete-btn" onclick='deleteClickFunction(${item.id})' data-user-id='${item.id}'>Sil</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    deleteClickFunction(owner);
    knowHowList.appendChild(knowHowDiv);

    
});

    // editClickFunction(item.id);
}
const addToProblemSolve = () => {
    const apiUrl = `http://backend.norbit.com.tr/knowhow/list/`; 
    const token  = localStorage.getItem('token');
    
    const problemTitle = document.getElementById('problem-title-input').value;
    const solutionDescription = document.getElementById('solution-description').value; 
    const solutionFileInput = document.getElementById('solution-file');

    console.log(problemTitle);

    const solutionFile = solutionFileInput.files[0];
    const formData = new FormData();
    
    formData.append('problem', problemTitle);
    formData.append('solve_text', solutionDescription);

    if (solutionFile) {
        formData.append('upload', solutionFile);
    } else {
        formData.append('upload', '');
    }
  
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

const writeContent = async ()=>{
    const accordionBox = document.getElementById('accordionExample');
    const datas = await getData();

    setTimeout(() => {

        for (let i=0; i < dataList.length; i++){
        AddContent(dataList[i]);
    }
    }, 100)

}

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
    const apiUrl= `http://backend.norbit.com.tr/ems/list/?id=${id}`
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
    const apiPageUrl = `https://backend.norbit.com.tr/knowhow/detail/${pageId}/`;
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
    console.log(itemId);
    const pageApi = `https://backend.norbit.com.tr/knowhow/detail/${itemId}/`;
    const token = localStorage.getItem('token');
  
    const newProblemContent = document.getElementById(`problem-title-input`).value;
    const newDocumention =document.getElementById(`solution-file`);
    const fileInput = newDocumention.files[0];
    const newDescription = document.getElementById(`solution-description`).value;

    const formData = new FormData();
    formData.append('problem', newProblemContent);
    formData.append('solve_text', newDescription);
    if (fileInput) {
        formData.append('upload', fileInput);
    } else {
        formData.append('upload', '');
    }
    try {
      const response = await axios.patch(pageApi, formData, {
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

  
      console.log(response.data);
  
      return response;
    } catch (error) {
      console.error('EditToProblem Error:', error);
      return error;
    }
  }

async function createEditButton(pageId) {
document.querySelector('.modal-title').innerHTML = '';

saveButton.style.display = 'block';
addButton.style.display = 'none';

getRowData(pageId);
saveButton.addEventListener('click', async () => {
    await editToProblem(pageId);
    // modal.hide();
    window.location.reload();
});

}


function getRowData(pageId) {
    const apiUrl = `http://backend.norbit.com.tr/knowhow/detail/${pageId}/`;
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
        const descriptionData = problemData.solve_text || '-';
        const uploadData = problemData.upload || '-';

        const uploadList = document.getElementById('upload-data');
        uploadList.innerHTML = `
        <div>
            <li>
                <a href="${uploadData}" class="uploaded-link font-weight-bold fs-5">${uploadData}</a>
                <input class="form-control" id="solution-file" type="file">
            </li>
        </div>
    
        `;
        problemTitle.value = problemNameData;
        solutionDescription.value = descriptionData;

        // saveButton.addEventListener('click', () =>{
        //     editToProblem(pageId);
        //     window.location.reload();
        // })
    }).catch((error) => {
        console.error(error);
    });
}
window.addEventListener("load", (event)  =>  {
    writeContent();
    // getOwner();
  

})