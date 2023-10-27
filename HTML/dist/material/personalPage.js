const addRowButton = document.getElementById("add-btn");

const modaltitle = document.getElementById("exampleModalLabel");

const firstName = document.getElementById("inputFirstame");
const lastName = document.getElementById("inputLastname");
const job = document.getElementById("inputJob");
const userTypes = document.getElementById("inputUserType");
const entryDate = document.getElementById("inputDate");
const exitDate = document.getElementById("inputExitDate");
const company = document.getElementById("inputCompany");
const username = document.getElementById("inputUsername");
const password = document.getElementById("inputPassword");

const tableBody = document.querySelector("#personalTable tbody");
const modalButtonBox = document.getElementById("button-box");

const inputExitDate = document.getElementById("input-exit-date");

const modal = new bootstrap.Modal(document.getElementById("permissionModal"));
const permissionBtn = document.getElementById("permission-btn");
permissionBtn.addEventListener("click", () => {
  modal.show();
});
addRowButton.addEventListener("click", () => {
  document.getElementById("job-date").style.display = "block";
  document.getElementById("password-content").style.display = "block";
  clearInput();
  inputExitDate.style.display = "none";
  modalButtonBox.innerHTML += `
    <button type="button" class="btn btn-primary" id="row-add-btn" onclick='createPersonel()'>Ekle</button>
    `;
});

function formatTarih(tarih) {
  const tarihParcalari = tarih.split("T");
  return tarihParcalari[0];
}
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
const closeBtn = document.getElementById("btn-close");
closeBtn.addEventListener("click", () => {
  modalButtonBox.innerHTML = "";
  clearInput();
});

async function createEditButton(userId) {
  editClickFunction();
  document.getElementById("job-date").style.display = "none";
  inputExitDate.style.display = "block";
  modalButtonBox.innerHTML += `
        <button type="button" class="btn btn-primary" id="row-edit-btn" >Düzenle</button>
    `;
  const rowEditBtn = document.getElementById("row-edit-btn");
  rowEditBtn.addEventListener("click", () => {
    if (modalValueControl()) {
      editPersonel(userId);
      modal.hide();
      clearInput();
    }
  });

  modaltitle.innerHTML = "Personel Düzenleme Formu";

  getRowData(userId);
}

function valueControl() {
  if (
    !firstName.value ||
    !lastName.value ||
    !job.value ||
    !userTypes.value ||
    !entryDate.value ||
    !exitDate.value ||
    !company.value ||
    !username.value ||
    !password.value
  ) {
    const alert = document.getElementById("alertWarning");
    alert.style.display = "block";

    setTimeout(() => {
      alert.style.display = "none";
    }, 1400);

    return;
  }
  alert.style.display = "none";
}
function createPersonel() {
  // CREATE NEW PERSONAL
  valueControl();

  const apiUrl = "http://backend.norbit.com.tr/accounts/registration/";
  const token = localStorage.getItem("token");

  const transDate = new Date(entryDate.value);
  axios({
    method: "post",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      first_name: firstName.value,
      last_name: lastName.value,
      job_title: job.value,
      user_type: userTypes.value,
      job_start_date: formatDateToCustomFormat(transDate),
      company_name: company.value,
      username: username.value,
      password1: password.value,
      password2: password.value,
    },
  })
    .then((response) => {
      getJobTitle();
      getCompanyName();
      clearInput();
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
}

function getModalValues() {
  // GET MODAL INPUT VALUES
  const data = {
    firstName: firstName.value,
    lastName: lastName.value,
    job: job.value,
    userType: userTypes.value,
    entryDate: entryDate.value,
    exitDate: exitDate.value,
    company: company.value,
    username: username.value,
    // "password": password.value
  };
  return data;
}

function clearInput() {
  // CLEAR VALUE
  firstName.value = "";
  lastName.value = "";
  job.value = "";
  userTypes.value = "";
  entryDate.value = "";
  company.value = "";
  username.value = "";
  // password.value = '';
}

const deleteRow = async (delete_button) => {
  // DELETE TO PERSONAL

  userId = delete_button.getAttribute("data-user-id");
  const apiUrl = `http://backend.norbit.com.tr/ems/employee/${userId}/`;
  const token = localStorage.getItem("token");

  const api = new Promise((resolve, reject) => {
    axios({
      method: "delete",
      url: apiUrl,
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        if (response.status === 204) {
          window.location.reload();
        } else {
          console.error("Satır silinemedi.");
        }
        //resolve(dataList)
      })
      .catch((error) => {
        reject("null");
      });
  });

  try {
    const response = await api;
    return response;
  } catch (e) {
    return e;
  }
};

function getRowData(userId) {
  // GET CURRENT ROW USER'S DATA
  const apiUrl = `http://backend.norbit.com.tr/ems/employee/${userId}/`;
  const token = localStorage.getItem("token");
  axios({
    method: "get",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then(async (response) => {
      const userData = response.data;

      const nameData = userData.first_name || "";
      const surnameData = userData.last_name || "";
      const exitData = userData.job_end_date || "";
      const jobData = userData.job_title || "";
      const companyData = userData.company_name || "";
      const typeData = userData.user || "";
      const userNameData = userData.username || "";

      firstName.value = nameData;
      lastName.value = surnameData;
      exitDate.value = formatTarih(exitData);
      job.value = jobData;
      company.value = companyData;
      userTypes.value = typeData;
      username.value = userNameData;
    })
    .catch((error) => {
      console.error(error);
    });
}
function modalValueControl() {
  const alert = document.getElementById("alertWarning");

  if (
    !newFirstName.value ||
    !newLastName.value ||
    !newjob.value ||
    !newCompany.value ||
    !newUserType.value ||
    !newUserName.value
  ) {
    alert.style.display = "block";
    setTimeout(() => {
      alert.style.display = "none";
    }, 1600);
    return false; // Return false to indicate that validation failed.
  }

  alert.style.display = "none";
  return true; // Return true to indicate that validation passed.
}

const newFirstName = document.getElementById("inputFirstame");
const newLastName = document.getElementById("inputLastname");
const newjob = document.getElementById("inputJob");
const newCompany = document.getElementById("inputCompany");
const newUserType = document.getElementById("inputUserType");
const newUserName = document.getElementById("inputUsername");

const newExitDate = document.getElementById("inputExitDate");
const exitDateValue = newExitDate.value.trim();

function editPersonel(userID) {
  const apiUrl = `http://backend.norbit.com.tr/ems/employee/${userID}/`;
  const token = localStorage.getItem("token");

  const data = {
    first_name: newFirstName.value,
    last_name: newLastName.value,
    job_title: newjob.value,
    user: newUserType.value,
    company_name: newCompany.value,
    username: newUserName.value,
  };

  if (exitDateValue) {
    data.job_end_date = formatDateToCustomFormat(exitDateValue);
  }

  axios({
    method: "patch",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: data,
  })
    .then((response) => {
      // const userData = response.data
      window.location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
}
let currentPage = 1;
const itemsPerPage = 10;

function displayDataOnPage() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const dataToDisplay = dataList.slice(startIndex, endIndex);

  tableBody.innerHTML = "";
  showPersonal(dataToDisplay);
}

const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    personalList(currentPage);
  }
});

nextPageBtn.addEventListener("click", () => {
  currentPage++;
  personalList(currentPage);
});

const personalList = (page = 1) => {
  // GETTING CONTACT INFORMATION FROM API
  const apiUrl = `https://backend.norbit.com.tr/ems/list/?page=${page}`;

  const token = localStorage.getItem("token");

  axios({
    method: "get",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => {
      const personalData = response.data.results;
      // console.log(personalData);
      // console.log(response.data.next);
      // personalData.sort((a, b) => b.id - a.id);
      showPersonal(personalData);
    })
    .catch((error) => {
      console.error("hata oluştu", error);
    });
};

const showPersonal = async (personalData) => {
  tableBody.innerHTML = "";
  const loginnedUser = await getUserInfoId();
  const loginnedUserType = loginnedUser.user_type;

  for (const item of personalData) {
    const newRow = document.createElement("tr");
    const job = (await getJobTitleId(item.job_title)) || "-";
    const company = (await getCompanyNameId(item.company_name)) || "-";
    const first_name = item.first_name || "-";
    const last_name = item.last_name || "-";
    const user = item.user || "-";
    const job_start_date = formatTarih(item.job_start_date) || "-";
    const job_end_date = item.job_end_date
      ? formatTarih(item.job_end_date)
      : "-";
    const username = item.username || "-";

    newRow.innerHTML = `
        <td><input class="form-check" type="checkbox" id="checkbox" value=""></td>

        <td>${first_name}</td>
        <td>${last_name}</td>
        <td>${job}</td>
        <td>${user}</td>
        <td>${job_start_date}</td>
        <td>${job_end_date}</td>
        <td>${company}</td>
        <td>${username}</td>
        <td>
            <button id="editBtn" class="btn btn-success btn-sm mdi mdi-pencil fs-5 edit-btn" style="letter-spacing: 0.2px;" onclick='createEditButton(${item.id})' data-user-id='${item.id}' data-bs-toggle="modal" data-bs-target="#exampleModal"></button>
            <button class="btn btn-danger mdi mdi-close btn-sm fs-5 delete-btn" data-user-id='${item.id}'></button>
        </td>
    `;

    tableBody.appendChild(newRow);
    // const checkboxes = document.querySelectorAll('input[name="checkbox-group"]');
    const checkBox = newRow.querySelector(".form-check");
    const userId = item.id;
    checkBox.addEventListener("change", () => {
      if (checkBox.checked) {
        getPermissionId(userId);
        console.log(userId);
      }
    });
    const editBtn = newRow.querySelector(".edit-btn");
    const deleteBtn = newRow.querySelector(".delete-btn");
    const editCol = document.getElementById("editCol");
    const colId = document.getElementById("colId");
    if (loginnedUserType === "AdminUser") {
      addRowButton.style.display = "";
    }
    if (loginnedUserType === "NormalUser") {
      editBtn.style.display = "none";
      deleteBtn.style.display = "none";
      editCol.style.display = "none";
      checkBox.style.display = "none";
      colId.innerHTML = "";
    }

    deleteBtn.addEventListener("click", function () {
      deleteRow(this);
    });
    const userTypes = await getUserInfoId();
    const editButton = document.querySelectorAll(".edit-btn");
    if (userTypes === "NormalUser") {
      editButton.style.display = "none";
    }
  };
};
const editClickFunction = async () => {
  const editButtons = document.querySelectorAll("edit-btn");
  const passwordContent = document.getElementById("password-content");
  passwordContent.style.display = "none";

  editButtons.forEach(async (editBtn) => {
    const loginnedUserId = await getUserInfoId();
    editBtn.addEventListener("click", (event) => {
      const userId = event.currentTarget.getAttribute("data-user-id");

      if (loginnedUserId == userId) {
        editPersonel(userId);
      } else {
        console.log("You are not authorized to delete this item.");
      }
    });
  });
};

function getJobTitle() {
  // GET JOB TİTLE
  const apiUrl = "http://backend.norbit.com.tr/jobs/list/";
  const token = localStorage.getItem("token");

  axios({
    method: "get",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => {
      const jobList = response.data.results;

      const jobTitleList = document.getElementById("inputJob");

      jobTitleList.innerHTML = "";

      jobList.forEach((job) => {
        const option = document.createElement("option");
        option.value = job.id;
        option.text = job.job_title;
        jobTitleList.appendChild(option);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

const getJobTitleId = async (job_id) => {

  const apiUrl = `https://backend.norbit.com.tr/jobs/${job_id}/`;
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
        const jobList = response.data;
        // console.log(jobList)
        const jobId = jobList.id;
        const jobName = jobList.job_title;
        resolve(jobName);
      })
      .catch((error) => {
        reject("null");
      });
  });

  try {
    const response = await api;
    return response;
  } catch (e) {
    return e;
  }
};

function getCompanyName() {
  // GET COMPANY NAME
  const apiUrl = "http://backend.norbit.com.tr/company/list/";
  const token = localStorage.getItem("token");

  axios({
    method: "get",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => {
      const companyData = response.data.results;

      const companyList = document.getElementById("inputCompany");
      companyList.innerHTML = "";

      companyData.forEach((company) => {
        const option = document.createElement("option");
        option.value = company.id;
        option.text = company.company_name;
        companyList.appendChild(option);
      });
    })
    .catch((error) => {
      console.log(error);
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

const getUserInfoId = async () => {
  //GİRİŞ YAPAN KİŞİNİN BİLGİLERİ
  const apiUrl = "http://backend.norbit.com.tr/accounts/user/";
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
        const userInfo = response.data;

        resolve(userInfo);
      })
      .catch((error) => {
        reject(error);
      });
  });

  try {
    const res = await api;
    return res;
  } catch (e) {
    console.log(loginId);
  }
};

let pageSize = 20;
let allPermissions = [];
function getPermission(page = 1) {
  const apiUrl = `https://backend.norbit.com.tr/permission/?page=${page}`;
  const token = localStorage.getItem("token");

  return axios({
    method: "get",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
  }).then((response) => {
    const responseData = response.data.results;

    allPermissions = allPermissions.concat(responseData);

    // console.log(allPermissions);

    if (response.data.next !== null) {
      const nextPage = page + 1;
      // console.log(nextPage)
      return getPermission(nextPage, allPermissions);
    } else {
      return allPermissions;
    }
  });
}
function createPermissionData(responseData) {
  const permissionList = document.getElementById("permission_list");
  responseData.forEach((item) => {
    const permissionItem = document.createElement("div");
    permissionItem.className = "form-check";
    //   console.log(item)
    permissionItem.innerHTML = `
          <input class="form-check-input" type="checkbox" id="permission${item.id}" value="${item.id}">
          <label class="form-check-label" for="permission${item.id}">
              ${item.name}
          </label>
          `;

    permissionList.appendChild(permissionItem);
  });
}

getPermission()
  .then((allPermissions) => {
    createPermissionData(allPermissions);
  })
  .catch((error) => {
    console.log("error", error);
  });

  let usersPermission = [];

  function getPermissionId(id) {
    const apiUrl = `https://backend.norbit.com.tr/permission/${id}/`;
    const token = localStorage.getItem("token");
  
    axios({
      method: "get",
      url: apiUrl,
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        const responseData = response.data.user_permissions;

        allPermissions.forEach((permission) => {
          const integerData = responseData.map(item => parseInt(item.user_permissions));
          console.log(typeof integerData);

          const id = permission.id;
          console.log(id)
          const isIdInUsersPermission = integerData.some((integerData) => integerData.id === id);
        
          if (isIdInUsersPermission) {
            console.log(`ID ${id} usersPermission dizisinde bulunuyor.`);
          } else {
            console.log(`ID ${id} usersPermission dizisinde bulunmuyor.`);
          }
        }); 

  
        console.log(usersPermission);
        // getPermissionFilter(perId, "", "");
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
  
function getPermissionFilter(id, permissionName, codename) {
  const apiUrl = `https://backend.norbit.com.tr/permission/?id=${id}&name=${permissionName}&codename=${codename}`;
  const token = localStorage.getItem("token");

  axios({
    method: "get",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => {
      const responseData = response.data.results;

      responseData.forEach((item) => {
        // console.log(item.name);
      });
    })
    .catch((error) => {
      console.log("error", error);
    });
}

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim();
  searchData(searchTerm);
});
async function searchData(searchTerm) {
  const apiUrl = `http://backend.norbit.com.tr/ems/list/?search=${searchTerm}`;
  const token = localStorage.getItem("token");

  axios({
    method: "get",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => {
      const searchData = response.data.results;
      const tableRows = document.querySelectorAll("#personalTable tbody tr");

      tableRows.forEach((row) => {
        const rowData = row.textContent.toLowerCase();

        if (rowData.includes(searchTerm.toLowerCase()) || searchTerm === "") {
          row.style.display = "table-row";
        } else {
          row.style.display = "none";
        }
        if (searchInput.value === "") {
          row.style.display = "table-row";
        }
      });
      showPersonal(searchData);
    })
    .catch((error) => {
      console.error("Arama sırasında hata oluştu: ", error);
    });
}
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm === "") {
    const tableRows = document.querySelectorAll("#personalTable tbody tr");
    tableRows.forEach((row) => {
      row.style.display = "table-row";
    });
  } else {
    searchData(searchTerm);
  }
});

window.addEventListener("load", async (event) => {
  // personalList();
  getJobTitle();
  // getJobTitleId();
  getCompanyName();
  // getCompanyNameId();
  personalList(1);
  // getPermission(1);
});
