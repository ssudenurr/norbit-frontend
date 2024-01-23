
const tableBody = document.querySelector("#category-table tbody");
const modal = new bootstrap.Modal(document.getElementById("exampleModal"));
const inputCategory = document.getElementById("inputCategory");

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
    createCategory();
  });
  modal.show();
});

function clearInput() {
    inputCategory.value = "";
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
};

/*TÜM KATEGORİ BİLGİLERİNİ GETİRİR */
function getCategoryList() {
  // GET COMPANY NAME
  const apiUrl = `${baseUrl}category/`;
  const token = localStorage.getItem("token");

  axios({
    method: "get",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => {
      const categoryeData = response.data.results;
      console.log(categoryeData);
      showCategoryList(categoryeData);

    })
    .catch((error) => {
      console.log(error);
    });
};

/*KATEGORİ BİLGİLERİ SAYFADA GÖSTERİR */
function showCategoryList(categoryeData) {
  tableBody.innerHTML = "";

  for (const item of categoryeData) {
    const newRow = document.createElement("tr");
    const categoryName = item.name;
    const createdDate = formatTarih(item.created_at) || "-";
    const itemId = item.id; 

    newRow.innerHTML = `
            <td style="text-align: center;">${categoryName}</td>
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
      // rowAddBtn.style.display = "none";
      // getRowData(itemId);
      clickToEditBtn(itemId);
    });
    const deleteBtn = newRow.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
        deleteCategoryName(itemId);
    });
  }
};

/*EKLE BUTONU KALKAR VE KAYDET BUTONU YERİNE GELİR */
async function clickToEditBtn(categoryId) {
  buttonBox.innerHTML = `
    <button type="button" class="btn btn-info" data-bs-dismiss="modal" id="save-btn">Kaydet</button>
    `;
  document.getElementById("save-btn").addEventListener("click", () => {
    editCategoryName(categoryId);
  });
  getRowData(categoryId);
}
/*YENİ BİR KETGORİ BİLGİSİ OLUŞTURUR */
function createCategory() {
  const apiUrl = `${baseUrl}category/`;
  const token = localStorage.getItem("token");
  axios({
    method: "post",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      name: inputCategory.value,
    },
  })
    .then(async (response) => {
      tableBody.innerHTML = "";
      getCategoryList();
    })
    .catch((error) => {
      console.log(error);
    });
};

/*İLGİLİ SATIRDAKİ KATEGORİ BİLGİSİNİ MODALA DOLDURUR */
function getRowData(categoryId) {
  const apiUrl = `${baseUrl}category/${categoryId}/`;
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

      const categoryData = responseData.name;

      inputCategory.value = categoryData;
    })
    .catch((error) => {
      console.log("error", error);
    });
};

/*İLGİLİ SATIRDAKİ KATEGORİ BİLGİSİNİ DÜZENLER */
function editCategoryName(categoryId) {
  const apiUrl = `${baseUrl}category/${categoryId}/`;
  const token = localStorage.getItem("token");

  axios({
    method: "patch",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      name: inputCategory.value,
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

/*İLGİLİ SATIRDAKİ KATEGORİ BİLGİSİNİ SİLER */
function deleteCategoryName(categoryId) {
  const apiUrl = `${baseUrl}category/${categoryId}/`;
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
    getCategoryList();
});
