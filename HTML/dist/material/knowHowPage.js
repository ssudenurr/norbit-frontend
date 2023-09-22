
const addButton = document.getElementById('addBtn')
addButton.addEventListener('click', () => {
  addToProblemSolve();                                                                                                                                                                                 
})


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
            const data =response.data;
            console.log(data)
            resolve(data)
            
    
        }).catch((error) => {
            reject(error)
        });
    });

    try{
        const response = await api;
        const results = response.results;
        const nextPage = response.next;

        results.map((item) => {
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

const addToProblemSolve = () => {
    const apiUrl = `http://backend.norbit.com.tr/knowhow/list/`; 
    const token  = localStorage.getItem('token');
    
    const problemTitle = document.getElementById('problem-title-input');
    const solutionDescription = document.getElementById('solution-description') 
    const solutionFile = document.getElementById('solution-file');
  
    axios({
        method:'post',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
        data: {
            'problem': problemTitle.value,
            'upldoad': solutionFile.value,
            'solve_text': solutionDescription.value,
        }
    })
    .then((response)=>{

        window.location.reload()


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

    deleteButtons.forEach( async (deleteButton) => {
        const loginnedUserId = await getUserInfoId()
        deleteButton.addEventListener('click', (event) => {
            const pageId = event.currentTarget.getAttribute('data-accordion-id');
            const userId = event.currentTarget.getAttribute('data-user-id');
            console.log(userId, loginnedUserId)

            if(loginnedUserId==userId){
                deleteProblem(pageId);
            }else {
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
            const loginId = response.data.id;
            resolve(loginId);

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
    const apiUrl= `http://backend.norbit.com.tr/ems/employee/${id}/`
    const token  = localStorage.getItem('token');
    const api = new Promise((resolve, reject) => {
    axios ({
        method:'get',
        url: apiUrl,
        headers: {
            "Authorization": `Token ${token}`
        },
    }).then((response)=>{
        resolve(response.data)
        // console.log(ownerData)
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
const AddContent = async (item) => {
    const accordionBox = document.getElementById('accordionExample');
    const userId = await getUserInfoId();
    const owner = await getOwner(item.owner)
    // const ownerUser = await getAddedByUserId(item.owner);
    console.log()
    const boxData = `
    <div class="accordion-item">
        <h2 class="accordion-header" id="accordionHeader">
            <button class="accordion-button" id="problemContent" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-${item.id}" aria-expanded="true" aria-controls="accordion-${item.id}">
                ${item.problem}
            </button>
        </h2>
        <div id="accordion-${item.id}" class="accordion-collapse collapse" aria-labelledby="accordionHeader">
            <div class="accordion-body">
                <div class="mb-3">
                    <label class="form-label" for="problem-title-input">Problemin Konusu</label>
                    <p type="text" id="problem-title-input">${item.problem}</p>
                </div>

                <div class="mb-3">
                    <label class="form-label" for="project-thumbnail-img">Doküman</label>
                    <p id="solution-file" type="file">${item.upload}</p>
                </div>

                <div class="mb-3">
                    <label class="form-label">Açıklama</label>
                    <p type="text" id="solution-description">${item.solve_text}</p>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Ekleyen Kişi</label>
                    <p type="text" id="owner">${owner.first_name} ${owner.last_name}</p>
                </div>

                <div class="text-end mb-4">
                    <button type="submit" class="btn btn-danger w-sm delete-btn" data-accordion-id='${item.id}' data-user-id=${item.owner} id="delete-btn">Delete</button>
                </div>
            </div>
        </div>
    </div>
    `;

    accordionBox.innerHTML += boxData;
    deleteClickFunction(owner);
}


// async function getOwnerId(ownerId){
//     const apiUrl= `http://backend.norbit.com.tr/knowhow/detail/`
//     const token  = localStorage.getItem('token');
//     const api = new Promise((resolve, reject) => {
//     axios({
//         method:'get',
//         url:apiUrl,
//         headers:{ 
//             "Authorization": `Token ${token}`
//         },
//     }).then((response)=>{
//         const ownerData = response.data.results;
        
//         ownerData.forEach((item) => {
//             const owner = item.owner;
//             console.log(owner);
//         });
//         resolve(ownerData)
//         console.log(ownerData)
//     }).catch((error) => {
//         reject("null")
//           console.log(error);
//         });
//     });
//     try {
//         const response = await api;
//         return response;
//     }
//     catch (e) {
//         return e
//     }
// }
// getOwnerId()



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
// const editClickFunction = () =>{
//     const editButtons = document.querySelectorAll('.edit-btn');
//     editButtons.forEach((editButton) => {
//         editButton.addEventListener('click',(event) => {
//             const problem = document.getElementById('problem-title-input')
//             problem.classList.add('form-control');
//             // const itemId = event.currentTarget.getAttribute('data-user-id');

//             editToProblem(itemId);
//         })
//     })

// }
// editClickFunction();
// const editToProblem = async (itemId) =>{
//     const pageApi= `https://backend.norbit.com.tr/knowhow/detail/${itemId}/`;
//     const token  = localStorage.getItem('token');

//     const newProblemContent = document.getElementById('problem-title-input');
//     const newDocumention = document.getElementById('solution-file');
//     const newDescription = document.getElementById('solution-description');

//     const editData = new Promise ((resolve,reject) =>{

//     axios({
//         method:'patch',
//         url:pageApi,
//         headers:{ 
//             "Authorization": `Token ${token}`
//         },
//         data:{
//             'problem': newProblemContent.value,
//             'upload': newDocumention.value,
//             'solve_text': newDescription.value,
//         },
//     })    
//     console.log()
//     .then((response) => {
//         console.log(response.data);
//         resolve(response);
//     })
//     .catch((error) => {
//         reject(error,'ncjhasvgjl');
//     });
    
// })
// try {
//     const response = await editData;
//     return response;
// }
// catch (e) {
//     return e
// }
// }


// function getAddedByUser(){
//     const apiUrl= "http://backend.norbit.com.tr/ems/list/"
//     const token  = localStorage.getItem('token');

//     axios({
//         method:'get',
//         url:apiUrl,
//         headers:{ 
//             "Authorization": `Token ${token}`
//         },
//     }).then((response)=>{
//         const user = response.data.results;

//         console.log(user)
//         // const fullName = document.getElementById('inputCompany')


//         user.forEach(async (ownerUser) => {
//             const firstName = getAddedByUserId(ownerUser.owner);
//             const userName = document.getElementById("owner");
//             userName.textContent = firstName;

//         });

//     }).catch((error) => {
//           console.log(error);
//         });
// }

// const getAddedByUserId = async (id) =>{
//     const apiUrl= `http://backend.norbit.com.tr/ems/employee/${id}/`
//     const token  = localStorage.getItem('token');

//     const api = new Promise((resolve, reject) => {
//         axios({
//             method:'get',
//             url:apiUrl,
//             headers:{ 
//                 "Authorization": `Token ${token}`
//             },
//         }).then((response)=>{
//             const firstName = response.data.first_name;
//             // const lastName = response.data.last_name;
//             // const fullName = `${firstName} ${lastName}`;
//             console.log(firstName)
//             resolve(firstName)
//         }).catch((error) => {
//             reject("null")
//         });
//     });

//     try {
//         const response = await api;
//         return response;
//     }
//     catch (e) {
//         return e
//     }
// }

window.addEventListener("load", (event)  =>  {
    writeContent();
    getOwner();
  
    // getAddedByUser();

});

{/* <div class="accordion-item">
<h2 class="accordion-header" id="accordionHeader">
    <button class="accordion-button" id="problemContent" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-${item.id}" aria-expanded="true" aria-controls="accordion-${item.id}">
        ${item.problem}
    </button>
</h2>
<div id="accordion-${item.id}" class="accordion-collapse collapse" aria-labelledby="accordionHeader">
    <div class="accordion-body">
        <div class="mb-3">
            <label class="form-label" for="problem-title-input">Problemin Konusu</label>
            <textarea type="text" class="form-control" id="problem-title-input">${item.problem}</textarea>
        </div>

        <div class="mb-3">
            <label class="form-label" for="project-thumbnail-img">Doküman</label>
            <input class="form-control" id="solution-file" type="file">
        </div>

        <div class="mb-3">
            <label class="form-label">Açıklama</label>
            <textarea type="text" class="form-control" style="height: 200px;" id="solution-description">${item.solve_text}</textarea>
        </div>

        <div class="text-end mb-4">
            <button type="submit" class="btn btn-danger w-sm delete-btn" data-user-id='${item.id}' id="delete-btn">Delete</button>
            <button type="submit" class="btn btn-secondary w-sm edit-btn" data-user-id='${item.id}'>Edit</button>
        </div>
    </div>
</div>
</div> */}