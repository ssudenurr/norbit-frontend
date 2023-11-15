
const projectList = document.getElementById('project-list');
const addBtn = document.getElementById('addBtn');

const projectName = document.getElementById('projectName');
const projectDescription = document.getElementById('projectDescription');
const projectstartDate = document.getElementById('startDate');
const projectEndDate = document.getElementById('endDate');
const projectCustomer = document.getElementById('customer');
const projectCompany = document.getElementById('company');
const employeesOption = document.getElementById('employees')

const createButton = document.getElementById('createButton');

const saveButton = document.getElementById('save-btn');
addBtn.addEventListener('click', ()=>{
        addNewProject();
        // window.location.reload();    

})

function valueControl() {
    const alert = document.getElementById("alertWarning"); // Define 'alert' here
    if (
      !projectName.value ||
      !projectDescription.value ||
      !projectstartDate.value ||
      !projectCustomer.value ||
      !projectCompany.value ||
      !employeesOption.value 
    ) {
      alert.style.display = "block";
  
      setTimeout(() => {
        alert.style.display = "none";
      }, 1600);
  
      return;
    }
    alert.style.display = "none";
  }
  
  function formatTarih(tarih) {
    if (tarih) {
      const tarihParcalari = tarih.split("T");
      return tarihParcalari[0];
    }
    return "-";
  }


let currentPage = 1;
const itemsPerPage = 10 ;

function displayDataOnPage() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const dataToDisplay = dataList.slice(startIndex, endIndex);

    tableBody.innerHTML = '';
    getProjectsDetails(dataToDisplay);
}

const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        getProjectsInfo(currentPage);
    }
});

nextPageBtn.addEventListener('click', () => {
    currentPage++;
    getProjectsInfo(currentPage);
});

function formatDateToCustomFormat(date) {
    let date2 = new Date(date);
    var yyyy = date2.getFullYear();
    var MM = String(date2.getMonth() + 1).padStart(2, "0"); // Ayı 2 basamaklı hale getiriyoruz
    var dd = String(date2.getDate()).padStart(2, "0"); // Günü 2 basamaklı hale getiriyoruz
    var hh = String(date2.getHours()).padStart(2, "0"); // Saati 2 basamaklı hale getiriyoruz
    var mm = String(date2.getMinutes()).padStart(2, "0"); // Dakikayı 2 basamaklı hale getiriyoruz
  
    // Sonuç formatını birleştiriyoruz
    var formattedDate = yyyy + "-" + MM + "-" + dd + "T" + hh + ":" + mm;
  
    return formattedDate;
  }
function getProjectsInfo(page){
    const apiUrl = `${baseUrl}projects/list/?page=${page}`;
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
async function getProjectsDetails(pageId){
    const apiUrl = `${baseUrl}projects/${pageId}/`;
    const token  = localStorage.getItem('token');

    axios ({
        method: 'get',
        url: apiUrl,
        headers: {
            "Authorization": `Token ${token}`
        },
        
    }).then( async (response) =>{
        const projectData = response.data;
        console.log(projectData)
        const employeesDataId = await getEmployeesId(
            projectData.employees
        )
        const nameData = projectData.project_name || '-';     
        const descriptionData = projectData.description || '-';
        const startDateData = projectData.project_start_date;
        const endData = projectData.project_end_date;
        const customerData = projectData.customer || '-';
        const companyData = projectData.company || '-';

        employees.value = employeesDataId;
        projectName.value = nameData;
        projectDescription.value = descriptionData;
        projectstartDate.value = formatTarih(startDateData);
        projectEndDate.value = formatTarih(endData);
        projectCustomer.value = customerData;
        projectCompany.value = companyData;
        employeesData(projectData.employees);


    }).catch((error) =>{
        console.log(error);
    })
}

async function projectDetails(projectData) {
    projectList.innerHTML = ''; // Projeleri temizle

    for ( const project of projectData) {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('card', 'mb-3');
        const company = await getCompanyNameId(project.company) || '-';
        const employeesIds = project.employess;
        const employeesValue = await getEmployeesData(employeesIds);
        const users = employeesValue.map(user => `${user.first_name} ${user.last_name}`);
        if(project.status === "FNS"){
            project.status = "TAMAMLANDI"
        }else{
            project.status = "DEVAM EDİYOR"
        }
        projectDiv.innerHTML = `
        <div class="card-body">
            <div class="text-muted">
                <div class ="row">

                    <div class="col-lg-5 col-sm-4">
                        <p class="mb-2 fw-bold fs-14 text-dark">PROJE ADI:</p>
                        <p class="mb-3 ">${project.project_name || '-'}</p>
                    </div>

                    <div class="col-lg-7 col-sm-10">
                        <p class="mb-2 fw-bold fs-14 text-dark">PROJEDE YER ALANLAR:</p>
                        <p class="mb-3 ">${users.join(', ') || '-'}</p>
                    </div>

                </div>

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
                            <button id="editBtn" class="btn btn-outline-success fs-14 btn-m fw-semibold edit-btn" style="letter-spacing: 0.3px; "onclick='createSaveButton(${project.id})' data-bs-toggle="modal" data-bs-target="#exampleModal">Düzenle</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    

        projectList.appendChild(projectDiv);
    };
}

async function createSaveButton(pageId) {
    document.querySelector('.modal-title').innerHTML = '';

    saveButton.style.display = 'block';
    addBtn.style.display = 'none';

    await getProjectsDetails(pageId);
    
    // Get the selected employees' IDs and pass them to employeesData
    // const selectedEmployeeIds = Array.from(employeesOption.selectedOptions).map(option => option.value);
    employeesData();

    saveButton.addEventListener('click', async () => {
        await editToProject(pageId);
        // modal.hide();
        // window.location.reload();
    });
}


const editToProject = async (itemId) => {
    const pageApi = `${baseUrl}projects/${itemId}/`;
    const token = localStorage.getItem('token');
    const newEmployees = Array.from(document.getElementById('employees').selectedOptions).map(option => option.value);

    const data = {
        project_name: projectName.value,
        description: projectDescription.value,
        project_start_date: formatDateToCustomFormat(projectstartDate.value),
        customer: projectCustomer.value,
        company: projectCompany.value,
        employees: newEmployees,
    };

    if (projectEndDate.value) {
        data.project_end_date = formatDateToCustomFormat(projectEndDate.value);
    }

    axios({
        method: 'patch',
        url: pageApi,
        headers: {
            "Authorization": `Token ${token}`
        },
        data: data,
    }).then((response) => {
        const projectData = response.data;
        console.log(projectData);
        window.location.reload();
    }).catch((error) => {
        console.error(error);
    });
};


const getCompanyNameId  = async (id) => {    // GET COMPANY NAME ID
    const apiUrl= `${baseUrl}company/${id}/`
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

function getCompanyName() {
    const apiUrl = `${baseUrl}company/list/`;
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
// async function employeesData(selectedEmployeeIds) {
//     let allPersonNameData = [];
//     let pageNumber = 1;

//     const token = localStorage.getItem("token");
  

  
//     while (true) {
//         const apiUrl = `http://backend.norbit.com.tr/ems/list/?page=${pageNumber}`;
//       const response = await axios({
//         method: "get",
//         url: apiUrl,
//         headers: {
//           Authorization: `Token ${token}`,
//         },
//       });
  
//       const pageData = response.data.results;
//       allPersonNameData = allPersonNameData.concat(pageData);
  
//       if (!response.data.next) {
//         break; // Son sayfa kontrolü
//       }
  
//       pageNumber++;
//     }
  
//     employeesOption.innerHTML = "";
  
//     allPersonNameData.forEach((person) => {
//       const option = document.createElement("option");
//       option.value = person.id;
//       option.text = person.username;
//       if (selectedEmployeeIds && selectedEmployeeIds.includes(person.id)) {
//         option.selected = true;
//       }
//       employeesOption.appendChild(option);
//     });
//   }
  

async function employeesData(selectedEmployeeIds, allPersonNameData = [], pageNumber = 1) {
    const apiUrl = `${baseUrl}ems/list/?page=${pageNumber}`;
    const token = localStorage.getItem("token");
  
    try {
      const response = await axios({
        method: "get",
        url: apiUrl,
        headers: {
          Authorization: `Token ${token}`,
        },
      });
  
      const pageData = response.data.results;
      allPersonNameData = allPersonNameData.concat(pageData);
  
      employeesOption.innerHTML = "";
  
      allPersonNameData.forEach((person) => {
        const option = document.createElement("option");
        option.value = person.id;
        option.text = person.username;
        if (selectedEmployeeIds && selectedEmployeeIds.includes(person.id)) {
          option.selected = true;
        }
        employeesOption.appendChild(option);
      });
  
      const nextPage = response.data.next;
      if (nextPage) {
        await employeesData(selectedEmployeeIds, allPersonNameData, pageNumber + 1);
      }
    } catch (error) {
      console.log('Hata oluştu:', error);
    }
  }

  
  
const getEmployeesId = async (id) => {

const apiUrl = `${baseUrl}ems/employee/${id}`;
const token = localStorage.getItem("token");

const api = new Promise((resolve, reject) => {
    axios({
    method: "get",
    url: apiUrl,
    headers: {
        Authorization: `Token ${token}`,
    },
    })
    .then((response) => {
        const responseData = response.data;
        // console.log(responseData)
        resolve(responseData);

        if (responseData.length > 0) {
            return responseData[0].username;
        } else {
            return "ID bulunamadı";
        }

    })
    .catch((error) => {
        reject(error);
    });
});

try {
    const response = await api;
    return response;
} catch (e) {
    return e;
}
};
async function getEmployeesData(employeeIds) {
    const employeeData = [];

    for (const id of employeeIds) {
        const employeeName = await getEmployeesId(id);
        employeeData.push(employeeName);
        // console.log(employeeName);
    }

    return employeeData;
}

const addNewProject = async () =>{
    const apiUrl = `${baseUrl}projects/create/`; 
    const token  = localStorage.getItem('token');
    valueControl()

    const projectName = document.getElementById('projectName').value;
    const projectDescription = document.getElementById('projectDescription').value;
    const projectstartDate = document.getElementById('startDate').value;
    const projectEndDate = document.getElementById('endDate').value;
    // const formattedEndDate = projectEndDate ? formatDateToCustomFormat(projectEndDate) : '';
    const projectCustomer = document.getElementById('customer').value;
    const projectCompany = document.getElementById('company').value;

    const selectedEmployees = Array.from(document.getElementById('employees').selectedOptions).map(option => option.value);
    const data = {
        project_name: projectName,
        description: projectDescription,
        project_start_date: formatDateToCustomFormat(projectstartDate),
        customer: projectCustomer,
        company: projectCompany,
        employess: selectedEmployees,
    };

    if (projectEndDate) {
        data.project_end_date = formatDateToCustomFormat(projectEndDate);
    }
    axios({        
        method:'post',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
        data:data,
    }).then(async (response)=>{
        employeesData();

        window.location.reload();
    }).catch((error) => {
          console.log(error);
        });
}



window.onload = function () {
    getProjectsInfo(1);
    getCompanyName();
    employeesData();
}


