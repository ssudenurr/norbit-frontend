const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const skillsInput = document.getElementById('skillsİnput');
const aboutInput = document.getElementById('aboutİnput');
const portfolioInput = document.getElementById('portfolioİnput');

const usernameValue = document.getElementById('userNameValue');
const firstnameValue = document.getElementById('firstNameValue');
const lastnameValue = document.getElementById('lastNameValue');
const lastLoginValue = document.getElementById('lastLoginValue');
const emailValue = document.getElementById('emailValue');
const companyNameValue = document.getElementById('companyNameValue');
const userTypeValue = document.getElementById('userTypeValue');
const jobTitle = document.getElementById('job-title');
const aboutValue = document.getElementById('aboutValue');

const newFirstName = document.getElementById("editFirstName");
const newLastName = document.getElementById("editLastName");
const newAbout = document.getElementById("editAbout");

const modal = new bootstrap.Modal(document.getElementById('updateModal'));
const saveBtn = document.getElementById("save-btn")
const updateButton = document.getElementById('updateBtn');
updateButton.addEventListener('click', function () {
    // Get values before hiding
    const edittedFirstName = firstnameValue.textContent;
    const edittedLastName = lastnameValue.textContent;
    const edittedAbout = aboutValue.textContent;

    // Hide elements
    firstnameValue.style.display = "none";
    lastnameValue.style.display = "none";
    aboutValue.style.display = "none";

    // Show input fields
    newFirstName.style.display = "block";
    newLastName.style.display = "block";
    newAbout.style.display = "block";

    // Set values to input fields
    newFirstName.value = edittedFirstName;
    newLastName.value = edittedLastName;
    newAbout.value = edittedAbout;

    // modal.show
    updateButton.style.display = "none";
    saveBtn.style.display = "block";
});
saveBtn.addEventListener('click', () => {
    updateUserInfo();
})
/*Giriş Yapan Kullanıcının Bilgileri Alındı ve sayfada gösterildi*/
async function getLoginnedUserInfo() {
    const apiUrl = `${baseUrl}accounts/user/`;
    const token = localStorage.getItem('token');

    try {
        const response = await axios({
            method: 'get',
            url: apiUrl,
            headers: {
                "Authorization": `Token ${token}`
            },
        });

        const userData = response.data;
        const loginnedUserId = userData.id;
        console.log(loginnedUserId);
        const company = await getCompanyNameId(userData.company_name);
        const job = await getJobTitleId(userData.job_title);

        usernameValue.textContent = userData.username;
        firstnameValue.textContent = userData.first_name;
        lastnameValue.textContent = userData.last_name;
        lastLoginValue.textContent = formatTarih(userData.last_login);
        emailValue.textContent = userData.email;
        companyNameValue.textContent = company;
        userTypeValue.textContent = userData.user_type;
        jobTitle.textContent = job;
        aboutValue.textContent = userData.about;

        return loginnedUserId;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
/*Uzun formattaki tarihi GG/AA/YYYY formatına çevirme*/
function formatTarih(date) {
    if (date) {
      const datePieces = date.split("T");
      if (datePieces.length > 0) {
        return datePieces[0];
      }
    }
    return null; // Eksik tarih için null değeri döndürün
  }
/*Kişinin çalışmış olduğu şirket bilgileri alındı*/
const getCompanyNameId = async (id) => {
    const apiUrl = `${baseUrl}company/${id}/`
    const token = localStorage.getItem('token');

    const api = new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: apiUrl,
            headers: {
                "Authorization": `Token ${token}`
            },
        }).then((response) => {
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

/*Kişinin iş tanımı bilgileri alındı*/
const getJobTitleId = async (job_id) => {    // GET JOB TİTLE ID
    const apiUrl = `${baseUrl}jobs/${job_id}/`
    const token = localStorage.getItem('token');

    const api = new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: apiUrl,
            headers: {
                "Authorization": `Token ${token}`
            },
        }).then((response) => {
            const jobList = response.data.job_title;
            resolve(jobList)
        }).catch((error) => {
            reject("-")
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
/* Kişinin bilgilerini güncellemek için */
function updateUserInfo() {
    const apiUrl = `${baseUrl}accounts/user/`;
    const token = localStorage.getItem('token');

    const data = {
        first_name: newFirstName.value,
        last_name: newLastName.value,
        about: newAbout.value,
    }

    axios({
        method: 'patch',
        url: apiUrl,
        headers: {
            "Authorization": `Token ${token}`
        },
        data: data,
    }).then((response) => {
        const userData = response.data;
        window.location.reload();
    }).catch((error) => {
        console.log(error);
    });
}
const projectName = document.getElementById("project-name");
const projectStatus = document.getElementById("project-status");
const projectEmployee = document.getElementById("project-employees");
const projectDescription = document.getElementById("project-description");

/*PROJE LİSTESİNİ ALIR */
async function getProjectInfo() {
    const apiUrl = `${baseUrl}projects/list/`
    const token = localStorage.getItem('token');

    try {

        axios({
            method: 'get',
            url: apiUrl,
            headers: {
                "Authorization": `Token ${token}`
            },
        }).then((response) => {
            const responseData = response.data.results

            showProjectCard(responseData)
        })
    } catch (error) {
        console.log("error", error);
    }
}
/*PROJE BİLGİLERİNİ GÖSTERMEK İÇİN KART OLUŞTURUR  */
async function showProjectCard(responseData) {
    const projectCard = document.getElementById('project-card');

    const loggedInUserId = await getLoginnedUserInfo();
    console.log(loggedInUserId);

    responseData.forEach(async project => {
        const projectEmployees = project.employess;
        const projectStatus = (project.status === "FNS") ? "Tamamlandı": "Devam Ediyor";
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('card', 'mb-3');

        if (projectEmployees.includes(loggedInUserId)) {
            const employeeData = await getEmployeesData(projectEmployees);

            // Set the content to the innerHTML property
            projectDiv.innerHTML = `
            <div class="card profile-project-card profile-project-danger mb-0"  >
                <div class="card-body p-4">
                    <div class="d-flex">
                        <div class="flex-grow-1 text-muted overflow-hidden">
                            <h5 class="fs-14 text-truncate mb-1"> Proje Adı</h5>
                            <div id="project-name">${project.project_name}</div>
                        </div>
                        <div class="flex-grow-1 text-muted overflow-hidden">
                            <h5 class="fs-14 text-truncate mb-1"> Açıklama</h5>
                            <div id="project-description">${project.description}</div>
                        </div>
                        <div class="flex-shrink-0 ms-2">
                            <div class="badge bg-success-subtle text-success fs-5" id="project-status">${projectStatus}</div>
                        </div>
                    </div>
                    <div class="d-flex mt-4">
                        <div class="flex-grow-1">
                            <div class="d-flex align-items-center gap-2">
                                <div>
                                    <h5 class="fs-14 mb-0"> Projede yer Alanlar :</h5>
                                    <div id="project-employees">${employeeData.join(', ')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

            // Append the projectDiv element to the projectCard container
            projectCard.appendChild(projectDiv);
        }
    });
}

/* TÜM EMPLOYEE DEĞERLERİ TOPLAR DİZİYE ATAR, ID DEĞERLERİNİN TEK TEK GÖNDERİLMESİNİ SAĞLAR*/
async function getEmployeesData(employeeIds) {
    const employeeData = [];

    for (const id of employeeIds) {
        const employeeName = await getEmployeesId(id);
        employeeData.push(employeeName);
        console.log(employeeName);
    }

    return employeeData;
}

/* PROJEDE YER ALAN KİŞİLERİN ID DEĞERLERİNİ GÖNDERİP İSİM SOYİSİM DEĞERLERİNİ ALIR */
const getEmployeesId = async (id) => {
    const apiUrl = `${baseUrl}ems/employee/${id}`;
    const token = localStorage.getItem("token");
    try {
        const api = await
            axios({
                method: "get",
                url: apiUrl,
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
        const responseData = api.data;
        return responseData.first_name + " " + responseData.last_name;


    } catch (error) {
        console.error("Error fetching employee data:", error);
        throw error;
    }
}

window.onload = function () {
    getLoginnedUserInfo();
    getProjectInfo();
};
