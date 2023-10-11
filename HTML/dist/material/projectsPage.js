const projectList = document.getElementById('project-list');

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
        console.log(projectData);
    }).catch((error) =>{
        console.log(error);
    })
}

function formatTarih(tarih) {
    const tarihParcalari = tarih.split('T');
    return tarihParcalari[0];
}

async function projectDetails(projectData) {
    projectList.innerHTML = ''; // Projeleri temizle

    projectData.forEach(async project  => {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('card', 'mb-3');

        projectDiv.innerHTML = `
        <div class="card-body">
            <div class="text-muted">
                <h6 class="mb-3 fw-semibold text-uppercase">${project.project_name || '-'}</h6>
                <p>${project.description || '-'}</p>
                <div class="pt-3 border-top border-top-dashed mt-4">
                    <div class="row">
    
                        <div class="col-lg-2 col-sm-4">
                            <div>
                                <p class="mb-2 text-uppercase fw-medium">Start Date :</p>
                                <h5 class="fs-15 mb-0">${formatTarih(project.project_start_date) || '-'}</h5>
                            </div>
                        </div>
    
                        <div class="col-lg-2 col-sm-4">
                            <div>
                                <p class="mb-2 text-uppercase fw-medium">End Date :</p>
                                <h5 class="fs-15 mb-0">${project.project_end_date ? formatTarih(project.project_end_date) : '-'}</h5>
                            </div>
                        </div>
    
                        <div class="col-lg-2 col-sm-4">
                            <div>
                                <p class="mb-2 text-uppercase fw-medium">Customer :</p>
                                <h5 class="fs-15 mb-0">${project.customer || '-'}</h5>
                            </div>
                        </div>
    
                        <div class="col-lg-2 col-sm-4">
                            <div>
                                <p class="mb-2 text-uppercase fw-medium">Status :</p>
                                <div class="badge bg-warning fs-12">${project.status || '-'}</div>
                            </div>
                        </div>
    
                        <div class="col-lg-2 col-sm-4">
                            <div>
                                <p class="mb-2 text-uppercase fw-medium">Company :</p>
                                <h5 class="fs-15 mb-0">${await getCompanyNameId(project.company) || '-'}</h5>
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
            console.log(companyList)
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

window.onload = function (){
    getProjectsInfo();
}
