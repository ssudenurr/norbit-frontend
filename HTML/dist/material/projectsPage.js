const projectList = document.getElementById('project-list');
const addBtn = document.getElementById('addBtn');

const projectName = document.getElementById('problemName');
const projectDescription = document.getElementById('problemDescription');
const projectstartDate = document.getElementById('startDate');
const projectEndDate = document.getElementById('endDate');
const projectCustomer = document.getElementById('customer');
const projectCompany = document.getElementById('company');

const saveButton = document.getElementById('save-btn');
addBtn.addEventListener('click', ()=>{
    addNewProject();
})

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
function getProjectsInfo(){
    const apiUrl = `http://backend.norbit.com.tr/projects/list/`;
    const token  = localStorage.getItem('token');

    axios ({
        method: 'get',
        url: apiUrl,
        headers: {
            "Authorization": `Token ${token}`
        },
    }).then((response) =>{
        const projectData = response.data.results;
        projectDetails(projectData);
        // console.log(projectData);
    }).catch((error) =>{
        console.log(error);
    })
}
 function getProjectsDetails(pageId){
    const apiUrl = `http://backend.norbit.com.tr/projects/${pageId}/`;
    const token  = localStorage.getItem('token');

    axios ({
        method: 'get',
        url: apiUrl,
        headers: {
            "Authorization": `Token ${token}`
        },
        
    }).then( async (response) =>{
        const projectData = response.data;
        // getCompanyName();
        // console.log(projectData)
        const nameData = projectData.project_name || '-';     
        const descriptionData = projectData.description || '-';
        const startDateData = projectData.project_start_date || '-';
        const endData = projectData.project_end_date || '-';
        const customerData = projectData.customer || '-';
        const companyData = projectData.company || '-';
  
        projectName.value = nameData;
        projectDescription.value = descriptionData;
        projectstartDate.value = formatTarih(startDateData);
        projectEndDate.value = formatTarih(endData);
        projectCustomer.value = customerData;
        projectCompany.value = await getCompanyNameId(companyData);
        // const selected = projectCompany.children[pageId - 1]
        // selected.setAttribute('selected', 'selected')


    }).catch((error) =>{
        console.log(error);
    })
}

async function projectDetails(projectData) {
    projectList.innerHTML = ''; // Projeleri temizle

    projectData.forEach(async project  => {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('card', 'mb-3');
        const company = await getCompanyNameId(project.company) || '-';

        if(project.status === "FNS"){
            project.status = "TAMAMLANDI"
        }else{
            project.status = "DEVAM EDİYOR"
        }
        projectDiv.innerHTML = `
        <div class="card-body">
            <div class="text-muted">
                    <p class="mb-2 fw-bold fs-14 text-dark">PROJE ADI:</p>
                    <p class="mb-3 text-uppercase">${project.project_name || '-'}</p>
                

                <p class="mb-2 fw-bold fs-14 text-dark">AÇIKLAMA :</p>
                <p>${project.description || '-'}</p>

                <div class="pt-3 border-top border-top-dashed mt-4">
                    <div class="row">
    
                        <div class="col-lg-2 col-sm-4">
                            <div>
                                <p class="mb-2 fw-bold fs-14 text-dark" text-dark>BAŞLANGIÇ TARİHİ :</p>
                                <p class="fs-15 mb-0">${formatTarih(project.project_start_date) || '-'}</p>
                            </div>
                        </div>
    
                        <div class="col-lg-2 col-sm-4">
                            <div>
                                <p class="mb-2 fw-bold fs-14 text-dark">BİTİŞ TARİHİ :</p>
                                <p class="fs-15 mb-0">${project.project_end_date ? formatTarih(project.project_end_date) : '-'}</p>
                            </div>
                        </div>
    
                        <div class="col-lg-2 col-sm-4">
                            <div>
                                <p class="mb-2 fw-bold fs-14 text-dark">MÜŞTERİ :</p>
                                <p class="fs-15 mb-0">${project.customer || '-'}</p>
                            </div>
                        </div>
    
                        <div class="col-lg-2 col-sm-4">
                            <div>
                                <p class="mb-2 fw-bold fs-14 text-dark ">DURUM :</p>
                                <div class="badge bg-warning fs-12">${project.status || '-'}</div>
                            </div>
                        </div>
    
                        <div class="col-lg-2 col-sm-4">
                            <div>
                                <p class="mb-2 fw-bold fs-14 text-dark">ŞİRKET :</p>
                                <p class="fs-15 mb-0">${company || '-'}</p>
                            </div>
                        </div>
                        <div class="mt-auto d-flex justify-content-end align-items-end">
                        <div>
                            <button id="editBtn" class="btn btn-success btn-m fw-semibold edit-btn" style="letter-spacing: 0.3px; "onclick='createSaveButton(${project.id})' data-bs-toggle="modal" data-bs-target="#exampleModal">Düzenle</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    

        projectList.appendChild(projectDiv);
    });
}

async function createSaveButton(pageId) {
    document.querySelector('.modal-title').innerHTML = '';
    
    saveButton.style.display = 'block';
    addBtn.style.display = 'none';  
    
    getProjectsDetails(pageId);
    saveButton.addEventListener('click', async () => {
        await editToProject(pageId);
        // modal.hide();
        window.location.reload();
    });
    
}
const editToProject = async (itemId) =>{
    const pageApi = `https://backend.norbit.com.tr/projects/${itemId}/`;
    const token = localStorage.getItem('token');

    const newProjectName = document.getElementById(`problemName`).value;
    const newProjectDescription =document.getElementById('problemDescription').value;
    const newProjectstartDate = document.getElementById('startDate').value ;
    const newProjectEndDate = document.getElementById('endDate').value;
    const newProjectCustomer = document.getElementById('customer').value;
    const newProjectCompany= document.getElementById('company').value;

    const data = {
        project_name:newProjectName,
        description:newProjectDescription,
        project_start_date: formatDateToCustomFormat(newProjectstartDate),
        project_end_date: formatDateToCustomFormat(newProjectEndDate),
        customer: newProjectCustomer,
        company:newProjectCompany,
    };
    
    axios({
        method: 'patch',
        url: pageApi,
        headers: {
            "Authorization": `Token ${token}`
        },
        data: data,
    }) .then((response) => {
        const projectData = response.data;
        console.log(projectData)
        // window.location.reload();
    })
    .catch((error) => {
        console.error(error);
    });
}

const getCompanyNameId  = async (id) => {    // GET COMPANY NAME ID
    const apiUrl= `http://backend.norbit.com.tr/company/${id}/`
    const token  = localStorage.getItem('token');

    const api = new Promise((resolve, reject) => {
        axios({
            method:'get',
            url:apiUrl,
            headers:{ 
                "Authorization": `Token ${token}`
            },
        }).then((response)=>{
            const companyList = response.data.company_name;
            // console.log(companyList)
            resolve(companyList)
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
};
// getCompanyNameId fonksiyonunu ayrıca çağırmayın
function getCompanyName() {
    const apiUrl = "http://backend.norbit.com.tr/company/list/";
    const token = localStorage.getItem('token');

    axios({
        method: 'get',
        url: apiUrl,
        headers: {
            "Authorization": `Token ${token}`
        },
    }).then((response) => {
        const companyData = response.data.results;

        const companyList = document.getElementById('company');
        companyList.innerHTML = '';

        companyData.forEach((company) => {
            const option = document.createElement('option');
            option.value = company.id;
            option.text = company.company_name;
            companyList.appendChild(option);
        });

    }).catch((error) => {
        console.log(error);
    });
}

window.onload = function () {
    getProjectsInfo();
    getCompanyName();
}

// const addNewProject = async (projectDetails) =>{
//     const apiUrl = `http://backend.norbit.com.tr/projects/list/`; 
//     const token  = localStorage.getItem('token');

//     const projectName = document.getElementById('problemName').value;
//     const projectDescription = document.getElementById('problemDescription').value;
//     const projectstartDate = document.getElementById('startDate').value;
//     const projectEndDate = document.getElementById('endDate').value;
//     const projectCustomer = document.getElementById('customer').value;
//     const projectCompany = document.getElementById('company').value;

//     axios({        
//         method:'post',
//         url:apiUrl,
//         headers:{ 
//             "Authorization": `Token ${token}`
//         },
//         data:{
//             project_name:projectName,
//             description:projectDescription,
//             project_start_date: formatDateToCustomFormat(projectstartDate),
//             project_end_date:formatDateToCustomFormat(projectEndDate),
//             customer: projectCustomer,
//             company:projectCompany,
//         }
//     }).then(async (response)=>{

//         clearInput();
//         window.location.reload();
//     }).catch((error) => {
//           console.log(error);
//         });
// }
