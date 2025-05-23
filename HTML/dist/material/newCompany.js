

const tableBody = document.querySelector("#company-table tbody");
const modal = new bootstrap.Modal(document.getElementById("exampleModal"));
const inputCompanyName = document.getElementById("inputCompanyName");

const addBtn = document.getElementById("add-btn");
const saveBtn = document.getElementById("save-btn");
const buttonBox = document.getElementById("button-box");
const deleteBtn = document.getElementById("delete-btn");
addBtn.addEventListener("click", () => {
  clearInput();
  buttonBox.innerHTML = `
    <button type="button" class="btn btn-info" data-bs-dismiss="modal" id="add-data-btn">Ekle</button>
    `;
  document.getElementById("add-data-btn").addEventListener("click", () => {
    createCompanyName();
  });
  modal.show();
});

function clearInput() {
  inputCompanyName.value = "";
};

/*UZUN FORMATTAKİ TARİHİ KISA FORMATA ÇEVİRİR */
function formatTarih(date) {
  if (date && date !== '-') {
      const datePieces = date.split('T')[0];
      const editedDatePieces = datePieces.split('-')
      return editedDatePieces.reverse().join('-');
  } else {
      return '-';
  }
};

/*KISA FORMATTAKİ TARİHİ UZUN FORMATA ÇEVİRİR */
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
/* TÜM ŞİRKET İSİMLERİNİ ALIR*/
function getCompanyList() {
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
      console.log(companyData);
      showCompanyList(companyData);

    })
    .catch((error) => {
      console.log(error);
    });
}
/*ŞİRKET BİLGİLERİNİ SAYFADA GÖSTERİR */
function showCompanyList(companyData) {
  tableBody.innerHTML = "";

  for (const item of companyData) {
    const newRow = document.createElement("tr");
    const companyName = item.company_name;
    const createdDate = formatTarih(item.created_at);
    const itemId = item.id; // Şimdi itemId'yi doğru şekilde alıyoruz

    newRow.innerHTML = `
            <td style="text-align: center;">${companyName}</td>
            <td style="text-align: center;">${createdDate}</td>
            <td style="text-align: center;">
                <button class="btn btn-success btn-sm mdi mdi-pencil fs-5 edit-btn" style="letter-spacing: 0.2px;" data-user-id="${itemId}" 
                data-bs-toggle="modal" data-bs-target="#exampleModal"></button>
                <button class="btn btn-danger mdi mdi-close btn-sm fs-5 delete-btn" data-user-id="${itemId}"></button>
            </td>
        `;
    tableBody.appendChild(newRow);

    const editBtn = newRow.querySelector(".edit-btn");
    editBtn.addEventListener("click", (event) => {

      clickToEditBtn(itemId);
    });
    const deleteBtn = newRow.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      deleteCompany(itemId);
    });
  }
};

/*EKLE BUTONU KALKTIĞINDA YERİNDE KAYDET BUTONU OLUŞUR */
async function clickToEditBtn(companyId) {
  buttonBox.innerHTML = `
    <button type="button" class="btn btn-info" data-bs-dismiss="modal" id="save-btn">Kaydet</button>
    `;
  document.getElementById("save-btn").addEventListener("click", () => {
    editCompanyData(companyId);
  });
  getRowData(companyId);
};

/*YENİ BİR ŞİRKET BİLGİSİ OLUŞTURUR */
function createCompanyName() {
  const apiUrl = `${baseUrl}company/create/`;
  const token = localStorage.getItem("token");
  axios({
    method: "post",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      company_name: inputCompanyName.value,
    },
  })
    .then(async (response) => {
      tableBody.innerHTML = "";
      getCompanyList();
    })
    .catch((error) => {
      console.log(error);
    });
};

/*İLGİLİ SATIRDAKİ ŞİRKET BİLGİSİNİ MODALA DOLDURUR */
function getRowData(companyId) {
  const apiUrl = `${baseUrl}company/${companyId}/`;
  const token = localStorage.getItem("token");

  axios({
    method: "get",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => {
      const responseData = response.data;
      console.log(responseData);

      const companyData = responseData.company_name;

      inputCompanyName.value = companyData;
    })
    .catch((error) => {
      console.log("error", error);
    });
};

/*İLGİLİ SATIRDAKİ ŞİRKET BİLGİSİNİ DÜZENLER */
function editCompanyData(companyId) {
  const apiUrl = `${baseUrl}company/${companyId}/`;
  const token = localStorage.getItem("token");

  axios({
    method: "patch",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      company_name: inputCompanyName.value,
    },
  })
    .then((response) => {
      const responseData = response.data;
      console.log(responseData);
      window.location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
};

/*İLGİLİ SATIRDAKİ ŞİRKET BİLGİSİNİ SİLER */
function deleteCompany(companyId) {
  const apiUrl = `${baseUrl}company/${companyId}/`;
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
        const dataList = response.data;

        if (response.status === 204) {
          window.location.reload();
        } else {
          console.error("Satır silinemedi.");
        }
        console.log(dataList);
        resolve(dataList);
      })
      .catch((error) => {
        reject("null");
      });
  });
}
window.addEventListener("load", (event) => {
  getCompanyList();
});
