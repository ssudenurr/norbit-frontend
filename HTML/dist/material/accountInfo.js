
const siteName = document.getElementById("inputSiteName");
const siteLink = document.getElementById("inputSiteLink");
const mailAdress = document.getElementById("inputMail");
const accountPassword = document.getElementById("inputPassword");

const tableBody = document.querySelector("#account-info-table tbody");
const modal = new bootstrap.Modal(document.getElementById("exampleModal"));

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

const editBtn = document.getElementById("edit-btn");
const deleteBtn = document.getElementById("delete-btn");

const saveBtn = document.getElementById("save-btn");
saveBtn.style.display = "none";
const addBtn = document.getElementById("add-btn");
addBtn.addEventListener("click", () => {
  addNewInfo();
  clearInput();
  modal.hide();
});
const closeBtn = document.getElementById("btn-close");
closeBtn.addEventListener("click", () => {
  clearInput();
  saveBtn.style.display = "none";
  addBtn.style.display = "block";
});
function clearInput() {
  siteName.value = "";
  siteLink.value = "";
  mailAdress.value = "";
  accountPassword.value = "";
}
function valueControl() {
  const alert = document.getElementById("alertWarning");
  if (
    !siteName.value ||
    !siteLink.value ||
    !mailAdress.value ||
    !accountPassword.value
  ) {
    alert.style.display = "block";

    setTimeout(() => {
      alert.style.display = "none";
    }, 1600);

    return;
  }
}
let dataList = [];
let currentPage = 1;
let itemsPerPage = 5;

const nextPageBtn = document.getElementById("next-page");
const prevPageBtn = document.getElementById("prev-page");
const pageNumber = document.getElementById("page-number");

/*SAYFALAR ARASINDA GEZİNMEK İÇİNDİR */
function displayDataOnPage() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = dataList.slice(startIndex, endIndex);

  tableBody.innerHTML = "";
  showAccountInfo(pageData);
}
/*BİR SONRAKİ SAYFAYA GEÇMEK İÇİN */
nextPageBtn.addEventListener("click", () => {
  currentPage++;
  getAccountInfo(currentPage);
});
/*BİR ÖNCEKİ SAYFAYA GEÇMEK İÇİN */
prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    getAccountInfo(currentPage);
  }
});

/*HESAP BİLGİLERİNİ GETİRİR */
async function getAccountInfo(itemsPerPage = 1) {
  const urlApi = `${baseUrl}accountinfo/list/?page=${itemsPerPage}`;
  const token = localStorage.getItem("token");

  axios({
    method: "get",
    url: urlApi,
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => {
      const responseData = response.data.results;

      showAccountInfo(responseData);

      responseData.map((item) => {
        dataList.push(item);
      });

    })
    .catch((error) => {
      console.log(error);
    });
};

/*HESAP BİLGİLERİNİ SAYFADA GÖSTERİR */
const showAccountInfo = async (responseData) => {
  tableBody.innerHTML = "";
  for (const item of responseData) {
    // console.log(responseData)
    const newRow = document.createElement("tr");
    const siteName = item.website_name || "-";
    const siteLink = item.website_link || "-";
    const siteMail = item.e_mail || "-";
    const sitePassword = item.password || "-";
    //BELİRLİ BİR KARAKTERDEN SONRASINI GÖSTERMEZ
    newRow.innerHTML = `
    <td><input class="form-check" type="checkbox" id="checkbox" value=""></td>    
    <td>${siteName}</td>
    <td>
        <a href="${siteLink}" target="_blank" style="text-decoration: underline!important; max-width: 220px; display: block;">
        ${siteLink.length > 45 ? siteLink.substr(0, 45) + " ..." : siteLink} 
    </a>
</td>
    <td>${siteMail}</td>
    <td>${sitePassword}</td>

    `;
    tableBody.appendChild(newRow);
    const checkBox = newRow.querySelector('input[type="checkbox"]');
    checkBox.addEventListener("change", (e) => {
      e.preventDefault();
      const infoId = item.id;

      if (this.checked) {
        console.log("Seçilen satırın ID'si: " + infoId);
      }
      editBtn.addEventListener("click", () => {
        getRowData(infoId);
        modal.show();
        addBtn.style.display = "none";
        saveBtn.style.display = "block";

        checkBox.checked = false;
      });
      saveBtn.addEventListener("click", () => {
        valueControl();
        editAccountInfo(infoId);
        clearInput();
      });
      deleteBtn.addEventListener("click", () => {
        deleteAccountInfo(infoId);
      });
    });
  }
};

let currentSortOrder = 'asc';
const table = document.getElementById("account-info-table");
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
/*YENİ BİR HESAP BİLGİSİ EKLER */
const addNewInfo = async () => {
  const apiUrl = `${baseUrl}accountinfo/create/`;
  const token = localStorage.getItem("token");

  valueControl();
  axios({
    method: "post",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      website_name: siteName.value,
      website_link: siteLink.value,
      e_mail: mailAdress.value,
      password: accountPassword.value,
    },
  })
    .then(async (response) => {
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
};
/*İLGİLİ SATIRDAKİ BİLGİLERİ MODALIN İÇİNE DOLDURUR */
function getRowData(rowId) {
  const apiUrl = `${baseUrl}accountinfo/${rowId}/`;
  const token = localStorage.getItem("token");

  axios({
    method: "get",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
  }).then(async (response) => {
    const rowData = response.data;

    const siteNameData = rowData.website_name;
    const siteLinkData = rowData.website_link;
    const siteMail = rowData.e_mail;
    const sitePassword = rowData.password;

    siteName.value = siteNameData;
    siteLink.value = siteLinkData;
    mailAdress.value = siteMail;
    accountPassword.value = sitePassword;
  });
};
/*SEÇİLEN SATIRDAKİ BİLGİLERİ GÜNCELLER */
function editAccountInfo(id) {
  const apiUrl = `${baseUrl}accountinfo/${id}/`;
  const token = localStorage.getItem("token");

  axios({
    method: "patch",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      website_name: siteName.value,
      website_link: siteLink.value,
      e_mail: mailAdress.value,
      password: accountPassword.value,
    },
  })
    .then((response) => {
      const responseData = response;
      console.log(responseData);
      window.location.reload();
    })
    .catch((error) => {
      console.log("Hata oluştu:", error);
    });
}

/*SEÇİLEN SATIRDAKİ BİLGİLERİ SİLER */
function deleteAccountInfo(id) {
  const apiUrl = `${baseUrl}accountinfo/${id}/`;
  const token = localStorage.getItem("token");

  axios({
    method: "delete",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => {
      console.log(response, "Değer Başarıyla Silindi");
      window.location.reload();
    })
    .catch((error) => {
      console.log("error", error);
    });
};


searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim();
  searchData(searchTerm);
});

/*TABLODAKİ VERİLER ARASINDA ARAMA YAPMA */
async function searchData(searchTerm) {
  const apiUrl = `${baseUrl}accountinfo/list/?search=${searchTerm}`;
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
      const tableRows = document.querySelectorAll(
        "#account-info-table tbody tr"
      );

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
      showInventory(searchData);
    })
    .catch((error) => {
      console.error("Arama sırasında hata oluştu: ", error);
    });
}
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm === "") {
    const tableRows = document.querySelectorAll("#inventory-table tbody tr");
    tableRows.forEach((row) => {
      row.style.display = "table-row";
    });
  } else {
    searchData(searchTerm);
  }
});

window.addEventListener("load", (event) => {
  getAccountInfo(1);
});
