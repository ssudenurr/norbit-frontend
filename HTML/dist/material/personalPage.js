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

const modalHeader = document.getElementById('permissionModalLabel')

const inputExitDate = document.getElementById("input-exit-date");

const saveBtn = document.getElementById('save-btn');
const updateBtn  =document.getElementById('update-btn');
updateBtn.style.display='none';

const modal = new bootstrap.Modal(document.getElementById("permissionModal"));
const permissionBtn = document.getElementById("permission-btn");

/* DÜZENLE BUTONU KALKAR YERİNE EKLE BUTONU GELİR */
addRowButton.addEventListener("click", () => {
  const rowEditBtn = document.getElementById("row-edit-btn");
  if (rowEditBtn) {
    rowEditBtn.remove(); 
  }
  document.getElementById("job-date").style.display = "block";
  document.getElementById("password-content").style.display = "block";
  clearInput();
  inputExitDate.style.display = "none";
  if (!document.getElementById("row-add-btn")) {
    modalButtonBox.innerHTML += `
      <button type="button" class="btn btn-primary" id="row-add-btn" onclick='createPersonel()'>Ekle</button>
    `;
  }
});


/*UZUN FORMATTAKİ TARİHİ GG/AA/YYYY FORMATINA ÇEVİRME*/
function formatTarih(date) {
  if (date) {
    const datePieces = date.split("T");
    if (datePieces.length > 0) {
      return datePieces[0];
    }
  }
  return null; // Eksik tarih için null değeri döndürün
}

/*KISA FORMATTAKİ TARİHİ UZUN FORMATA ÇEVİRME*/
function formatDateToCustomFormat(date) {
  if (!date) {
      return null; // Handle the case where date is empty
  }
  let date2 = new Date(date);
  var yyyy = date2.getFullYear();
  var MM = String(date2.getMonth() + 1).padStart(2, '0');
  var dd = String(date2.getDate()).padStart(2, '0');
  var hh = String(date2.getHours()).padStart(2, '0');
  var mm = String(date2.getMinutes()).padStart(2, '0');
  var ss = String(date2.getSeconds()).padStart(2, '0');

  // Format the date string
  var formattedDate = yyyy + "-" + MM + "-" + dd + "T" + hh + ":" + mm;

  return formattedDate;
}

let userId = null; 
const closeBtn = document.getElementById("btn-close");
closeBtn.addEventListener("click", () => {
  userId = null; 
  modal.hide();
});

/*EKLE BUTONU KALDIRILDI VE DÜZENLE BUTONU OLUŞTURULDU */
async function createEditButton(userId) {
  const rowAddBtn = document.getElementById("row-add-btn");
  if (rowAddBtn) {
    rowAddBtn.remove(); 
  }
  editClickFunction();
  document.getElementById("job-date").style.display = "block";
  inputExitDate.style.display = "block";
  if(!document.getElementById("row-edit-btn")){
  modalButtonBox.innerHTML += `
        <button type="button" class="btn btn-primary" id="row-edit-btn" >Düzenle</button>
    `;
  }
  const rowEditBtn = document.getElementById("row-edit-btn");
  rowEditBtn.addEventListener("click", () => {

    if (!valueControl()) {
      editPersonel(userId);
      modal.hide();
      clearInput();
    }

  });

  getRowData(userId);
}
/* İNPUT ALANLARININ BOŞ OLUP OLMADIĞI KONTROL EDİLDİ*/
function valueControl() {
  const alert = document.getElementById("alertWarning");

  if (
    !firstName.value ||
    !lastName.value ||
    !job.value ||
    !userTypes.value ||
    !entryDate.value ||
    !company.value ||
    !username.value 
  ) {
    alert.style.display = "block";

    setTimeout(() => {
      alert.style.display = "none";
    }, 1400);
  } else {
    alert.style.display = "none";
  }
}

/*YENİ BİR PERSONEL OLUŞTURMA FONKSİYONU*/
function createPersonel() {
  valueControl();
  const apiUrl = `${baseUrl}accounts/registration/`;
  const token = localStorage.getItem("token");
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
      job_start_date: formatDateToCustomFormat(entryDate.value),
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

/*İNPUT ALANLARINI TEMİZLEMEK İÇİN */
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

/*PERSONELİ SİLME */
const deleteRow = async (delete_button) => {

  userId = delete_button.getAttribute("data-user-id");
  const apiUrl = `${baseUrl}ems/employee/${userId}/`;
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
        resolve(dataList) 
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

/*SATIRIN İÇİNDEKİ BİLGİLERİNİ MODAL İÇİNE DOLDURMA */
function getRowData(userId) {
  const apiUrl = `${baseUrl}ems/employee/${userId}/`;
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
      const startDate = userData.job_start_date || "";
      const exitData = userData.job_end_date || "";
      const jobData = userData.job_title || "";
      const companyData = userData.company_name || "";
      const typeData = userData.user || "";
      const userNameData = userData.username || "";

      firstName.value = nameData;
      lastName.value = surnameData;
      entryDate.value = formatTarih(startDate);
      console.log(entryDate.value);
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
/*PERSONELİN BİLGİLERİNİ GÜNCELLEMEK İÇİNDİR*/
function editPersonel(userID) {
  const apiUrl = `${baseUrl}ems/employee/${userID}/`;
  const token = localStorage.getItem("token");

  const data = {
    first_name: firstName.value,
    last_name: lastName.value,
    job_title: [job.value],
    user: userTypes.value,
    company_name: [company.value],
    job_start_date: formatDateToCustomFormat(entryDate.value),
    username: username.value,
  };

  if (exitDate) {
    data.job_end_date = formatDateToCustomFormat(exitDate.value);
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
      const userData = response.data;
      console.log(userData);
      window.location.reload(); 
    })
    .catch((error) => {
      console.error(error);
    });
}

let currentPage = 1;
const itemsPerPage = 10;
/*SAYFALAR ARASINDA GEZİNMEK İÇİN */
function displayDataOnPage() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const dataToDisplay = dataList.slice(startIndex, endIndex);

  tableBody.innerHTML = "";
  showPersonal(dataToDisplay);
}

const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
/*BİR ÖNCEKİ SAYFAYA GEÇMEK İÇİN */
prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    personalList(currentPage);
  }
});
/*BİR SONRAKİ SAYFAYA GEÇMEK İÇİN */
nextPageBtn.addEventListener("click", () => {
  currentPage++;
  personalList(currentPage);
});
/*PERSONEL LİSTESİNİ ALIR */
const personalList = (page = 1) => {
  const apiUrl = `${baseUrl}ems/list/?page=${page}`;

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
      showPersonal(personalData);
    })
    .catch((error) => {
      console.error("hata oluştu", error);
    });
};
let currentSortOrder = 'asc';
const table = document.getElementById("personalTable");
/*TABLODAKİ VERİLERİ ASC VE DESC OLARAK SIRALAR */
function sortTable(columnIndex) { 
  const rows = Array.from(table.querySelectorAll("tbody tr"));

  rows.sort((a, b) => {
    const aValue = a.children[columnIndex].textContent.trim();
    const bValue = b.children[columnIndex].textContent.trim();
    const comparison = aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' });  
  
    return currentSortOrder === 'asc' ? comparison : -comparison;
  });

  // Clear the table body
  table.querySelector("tbody").innerHTML = "";


  rows.forEach(row => {
    table.querySelector("tbody").appendChild(row);
  });
  currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
}

const headers = document.querySelectorAll("thead th");
/*TABLODAKİ BAŞLIKLARA TIKLANDIĞI ZAMAN BAŞLIĞIN VE SIRALANAN VERİLERİN RENGİ DEĞİŞİR */
headers.forEach((header, index) => {
  let sort_asc = true;
  header.addEventListener("click", () => {
  const rows = Array.from(table.querySelectorAll("tbody tr"));

    headers.forEach(header => header.classList.remove('active'))
    header.classList.add('active');

    document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
    rows.forEach(row => {
      row.children[index].classList.add('active')
    });

    header.classList.toggle('asc', sort_asc);
    sort_asc = header.classList.contains('asc') ? false : true;
    sortTable(index);
  });
});

/*GELEN VERİLERİ TABLOYA YERLEŞTİRİR  */
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
    const user = item.user  === "AU" ? "Admin User" : "Normal User";
    const job_start_date =item.job_start_date ? formatTarih(item.job_start_date) : "-";
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
    const checkBox = newRow.querySelector(".form-check");
    const firstname = item.first_name
    checkBox.addEventListener("change", async ()  => {
      if (checkBox.checked)  {
        userId = item.id;
        //console.log(userId);
        getPermissionId(userId);          

        clearInputPermission();
        permissionBtn.addEventListener("click",  () => {
          modalHeader.innerHTML = `
          <h4 class="text-capitalize">${firstname} Personelinin Yetkilerini Düzenle</h4>
          ` ;
          modal.show();
          checkBox.checked = false;
        });

        updateBtn.style.display = 'block';
      }
      
      updateBtn.addEventListener("click", () => {
        if (userId !== null) {
          addUserPermissions(userId);
        }
      });
    });
    const editBtn = newRow.querySelector(".edit-btn");
    const deleteBtn = newRow.querySelector(".delete-btn");
    const editCol = document.getElementById("editCol");
    const colId = document.getElementById("colId");
    if (loginnedUserType === "AdminUser") {
      addRowButton.style.display = "block";
      permissionBtn.style.display = "block"

    }
    if (loginnedUserType === "NormalUser") {
      editBtn.style.display = "none";
      deleteBtn.style.display = "none";
      editCol.style.display = "none";
      checkBox.style.display = "none";
      permissionBtn.style.display = "none"
      // colId.innerHTML = ""; 

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

let pageSize = 20;
let allPermissions = [];
const excludedValues = [121, 122, 123, 124, 113, 114, 115, 116, 141, 144, 143, 142,  1, 2, 3, 4, 9, 10, 11, 12,69,70,71,72,
61,62,63,64,49,50,51,52,101,102,103,41,42,43,44,45,46,47,48,85,86,87,88,13,14,15,16,17,18,19,20,29,30,31,32,33,34,35,36,37,38,39,40];

/*İZİNLERİN LİSTESİNİ ALMA FONKSİYONU */
function getPermission(page = 1) {
  const apiUrl = `${baseUrl}permission/?page=${page}`;
  const token = localStorage.getItem("token");

  return axios({
    method: "get",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
  }).then((response) => {
    const responseData = response.data.results;
    // console.log(responseData);

    allPermissions = allPermissions.concat(responseData);
    if (response.data.next !== null) {
      const nextPage = page + 1;
      return getPermission(nextPage, allPermissions);
    } else {
      return allPermissions;
    }
  });
};

/*İZİN İSİMLERİ TÜRKÇEYE ÇEVRİLDİ */
const permissionMapping = {
  "Can add account info": "Hesap bilgisi ekleyebilir",
  "Can change account info": "Hesap bilgisini değiştirebilir",
  "Can delete account info": "Hesap bilgisini silebilir",
  "Can view account info": "Hesap bilgisini görebilir",
  "Can add projects": "Proje ekleyebilir",
  "Can change projects": "Projeleri değiştirebilir",
  "Can delete projects": "Projeleri silebilir",
  "Can view projects": "Projeleri görebilir",
  "Can add inventory": "Envanter ekleyebilir",
  "Can change inventory": "Envanteri değiştirebilir",
  "Can delete inventory": "Envanteri silebilir",
  "Can view inventory": "Envanteri görebilir",
  "Can add know how": "Bilgi ekleyebilir",
  "Can change know how": "Bilgiyi değiştirebilir",
  "Can delete know how": "Bilgiyi silebilir",
  "Can view know how": "Bilgiyi görebilir",
  "Can add company": "Şirket ekleyebilir",
  "Can change company": "Şirketi değiştirebilir",
  "Can delete company": "Şirketi silebilir",
  "Can view company": "Şirketi görebilir",
  "Can add job title": "İş unvanı ekleyebilir",
  "Can change job title": "İş unvanını değiştirebilir",
  "Can delete job title": "İş unvanını silebilir",
  "Can view job title": "İş unvanını görebilir",
  "Can add category": "Kategori ekleyebilir",
  "Can change category": "Kategoriyi değiştirebilir",
  "Can delete category": "Kategoriyi silebilir",
  "Can view category": "Kategoriyi görebilir",
  "Can add purchase request": "Satın alma talebi ekleyebilir",
  "Can change purchase request": "Satın alma talebini değiştirebilir",
  "Can delete purchase request": "Satın alma talebini silebilir",
  "Can view purchase request": "Satın alma talebini görebilir",
  "Can add email address": "E-posta adresi ekleyebilir",
  "Can change email address": "E-posta adresini değiştirebilir",
  "Can delete email address": "E-posta adresini silebilir",
  "Can view email address": "E-posta adresini görebilir",
  "Can add email confirmation": "E-posta onayı ekleyebilir",
  "Can change email confirmation": "E-posta onayını değiştirebilir",
  "Can delete email confirmation": "E-posta onayını silebilir",
  "Can view email confirmation": "E-posta onayını görebilir",
  "Can add permission": "İzin ekleyebilir",
  "Can change permission": "İzini değiştirebilir",
  "Can delete permission": "İzini silebilir",
  "Can view permission": "İzini görebilir",
  "Can add drive": "Sürücü ekleyebilir",
  "Can change drive": "Sürücüyü değiştirebilir",
  "Can delete drive": "Sürücüyü silebilir",
  "Can view drive": "Sürücüyü görebilir",
  "Can add drive file": "Sürücü dosyası ekleyebilir",
  "Can change drive file": "Sürücü dosyasını değiştirebilir",
  "Can delete drive file": "Sürücü dosyasını silebilir",
  "Can view drive file": "Sürücü dosyasını görebilir",
};

let itemName = []; 
/*İZİN DEĞERLERİ MODALDA GÖSTERİLDİ */
function createPermissionData(responseData) {
  const permissionList = document.getElementById("permission_list");
  itemName = []; // Her çağrıda boşaltın.
  responseData.forEach((item) => {
    if (!excludedValues.includes(item.id)) {
      const nospaceName = item.name.trim();
      const translatedName = permissionMapping[nospaceName] || nospaceName; //gelen değerdeki boşlukları kaldırmak için

      if (!itemName.includes(translatedName)) {
        const permissionItem = document.createElement("div");
        permissionItem.className = "form-check";
        permissionItem.innerHTML = `
          <input class="form-check-input modal-checkbox" type="checkbox" id="permission${item.id}" value="${item.id}" name="${item.name}">
          <label class="form-check-label" for="permission${item.id}">
              ${translatedName}
          </label>
        `;

        permissionList.appendChild(permissionItem);
        itemName.push(translatedName);
      }
    }
  });
};

getPermission()
  .then((allPermissions) => {
    createPermissionData(allPermissions);
    const groupedPermissions = groupByName(allPermissions);
  })
  .catch((error) => {
    console.log("error", error);
  });


/*İZİNLERİN DEĞERLERİNİN GRUPLANMIŞ DİZİSİ */
let groupedPermissions = [];

let groupedNames = [];
/*İZİNLERİ İSME GÖRE GRUPLAR */
function groupByName(responseData) {

  responseData.forEach((item) => {
    let permissionName = item.name;
    permissionName = permissionName.trim(); 

    if (!groupedPermissions[permissionName]) { // aynı isimdeki izinleri gruplar
      groupedPermissions[permissionName] = {
        id: [],
        name: permissionName
      };
    }
    groupedPermissions[permissionName].id.push(item.id);
  });
  const groupedPermissionsArray = Object.values(groupedPermissions);
  groupedPermissions = groupedPermissionsArray;

  const names = groupedPermissionsArray.map(group => group.name);

groupedNames = names;
  // console.log(groupedPermissions);
  return groupedPermissionsArray;
}
/*İZİN İSİMLERİNİ TEKER TEKER ALMA FONKSİYONU */
async function getPermissionId(id) {
  const apiUrl = `${baseUrl}permission/${id}/`;
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
      localStorage.setItem("responseData", JSON.stringify(responseData));

      for (let i = 0; i < responseData.length; i++) {
        responseData[i].id = parseInt(responseData[i].id, 10);
      }
      const integerData = responseData;
      console.log(integerData);
      
      integerData.forEach((data) => {
        const permissionId = data;
      });
      
      allPermissions.forEach((permission) => {
        const id = permission.id;
      }); 

      allPermissions.forEach((permission) => {
        integerData.forEach((permissionId) => {
          const id = permission.id;
          if (permissionId === id) {
            const checkbox = document.getElementById(`permission${id}`);
            if (checkbox) {
              checkbox.checked = integerData.some((permissionId) => permissionId === id);
            }
          } else {
            // console.log(`ID ${id} usersPermission dizisinde bulunmuyor.`);
          }
        });
      });
    })
    .catch((error) => {
      console.log("error", error);
    });
}
/*KULLANICININ SEÇTİĞİ İZİNLERİ ALIR, DİZİYE EKLER VE BUNLARI GÜNCELLER*/
function addUserPermissions(id) {
  const apiUrl = `${baseUrl}permission/${id}/`;
  const token = localStorage.getItem("token");

  const selectedPermissions = document.querySelectorAll('input[type="checkbox"]:checked');
  let values = [];
  let idValues = [];

  selectedPermissions.forEach(checkbox => {
    const value = parseInt(checkbox.value, 10);
    const nameValue = checkbox.getAttribute("name");

    groupedPermissions.forEach(group => {
      if (group.name === nameValue) {
        idValues = idValues.concat(group.id);
      }
    });

    if (!isNaN(value)) {
      values.push(value);
    }
  });
  values = values.concat(idValues);
  console.log(values);

  axios({
    method: 'patch',
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      user_permissions: values,
    }
  }).then((response) => {
    localStorage.setItem("userPermissions", values);
    console.log("İzinler başarıyla güncellendi.");
  }).catch((error) => {
    console.log("Hata:", error);
  });
}
/*SATIRLARDAKİ EDİT BUTONUNU TEK TEK ALIR */
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

/*İŞ TANIM LİSTESİ ALINDI */
function getJobTitle() {
  const apiUrl = `${baseUrl}jobs/list/`;
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
/* İŞ TANIMININ DEĞERİ TEK TEK ALINDI */
const getJobTitleId = async (job_id) => {

  const apiUrl = `${baseUrl}jobs/${job_id}/`;
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
/*ŞİRKET İSİMLERİNİN LİSTESİ ALINDI */
function getCompanyName() {
  const apiUrl = `${baseUrl}company/list/`;
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
/*ŞİRKET İSMİNİN DEĞERLERİ TEK TEK ALINDI */
const getCompanyNameId  = async (id) => { 
  const apiUrl= `${baseUrl}company/${id}/`;
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

/*GİRİŞ YAPAN KİŞİNİN BİLGİLERİ*/
const getUserInfoId = async () => {

  const apiUrl = `${baseUrl}accounts/user/`;
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

/*İZİN DEĞERLERİNİ FİLTRELEME */
function getPermissionFilter(id, permissionName, codename) {
  const apiUrl = `${baseUrl}permission/?id=${id}&name=${permissionName}&codename=${codename}`;
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

/*TABLODAKİ VERİLER ARASINDA ARAMA YAPMA */
async function searchData(searchTerm) {
  const apiUrl = `${baseUrl}ems/list/?search=${searchTerm}`;
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

      });
    })
    .catch((error) => {
      console.error("Arama sırasında hata oluştu: ", error);
    });
}
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm === '') {

      const tableRows = document.querySelectorAll('#personalTable tbody tr');
      tableRows.forEach(row => {
          row.style.display = 'table-row';
      });
  } else {
      searchData(searchTerm);
  }
});

/*SEÇİLİ OLAN PERMİSSİON DEĞERLEİNİ KALDIRIR */
const modalElement = document.getElementById("permissionModal");
function clearInputPermission() {
  modalElement.addEventListener('hidden.bs.modal', function (event) {
    const checkboxes = document.querySelectorAll('input.modal-checkbox[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
  });
  
}


window.addEventListener("load", async (event) => {
  getJobTitle();
  getCompanyName();
  personalList(1);

});
