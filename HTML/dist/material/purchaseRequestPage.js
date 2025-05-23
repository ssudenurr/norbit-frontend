const addBtn = document.getElementById("add-btn");
const modaltitle = document.getElementById("exampleModalLabel");

const personName = document.getElementById("personName");
const productName = document.getElementById("productName");
const price = document.getElementById("price");
const count = document.getElementById("count");
const link = document.getElementById("link");
const deadline = document.getElementById("deadline");
const description = document.getElementById("description");
const responsiblePerson = document.getElementById("responsible-person");
const statusData = document.getElementById("statusData");
const categoryData = document.getElementById("categoryData");
const orderinDateData = document.getElementById("orderingDate")

const tableBody = document.querySelector("#purchaseTable tbody");
const modalButtonBox = document.getElementById("button-box");

const modal = new bootstrap.Modal(document.getElementById("exampleModal"));

const cancelBtn = document.getElementById("cancel");

const statusBtn = document.getElementById("situation");

let dataList = [];
let currentPage = 1;
const page = 10;

function displayDataOnPage() {
  const startIndex = (currentPage - 1) * page;
  const endIndex = startIndex + page;
  const dataToDisplay = dataList.slice(startIndex, endIndex);

  tableBody.innerHTML = "";
  showPurchaseRequest(dataToDisplay);
}

const nextPageBtn = document.getElementById("next-page");
const prevPageBtn = document.getElementById("prev-page");
/*BİR ÖNCEKİ SAYFAYA GEÇMEK İÇİN */
prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    purchaseList(currentPage);
  }
});
/*BİR SONRAKİ SAYFAYA GEÇMEK İÇİN */
nextPageBtn.addEventListener("click", () => {
  currentPage++;
  purchaseList(currentPage);
});

/*YAPILMIŞ OLAN İSTEĞİ İPTAL ETMEK İÇİN*/
async function cancelRequest(requestId) {
  const apiUrl = `${baseUrl}purchase-request/${requestId}/`;
  const token = localStorage.getItem("token");

  axios({
    method: "patch",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      status: "IP",
    },
  })
    .then((response) => {
      console.log(response.data);
      if (response.status === 200) {
        console.log("Status updated successfully:", response.data);
        window.location.reload();
      } else {
        console.error("Status update failed:", response);
      }
    })
    .catch((error) => {
      console.error("An error occurred while updating the status:", error);
    });
}

/*İSTEĞİN STATÜ DEĞERİNİ DEĞİŞTİRİR */
async function updatePurchaseStatus(requestId) {
  const apiUrl = `${baseUrl}purchase-request/${requestId}/`;
  const token = localStorage.getItem("token");

  axios({
    method: "patch",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      status: "ON",
    },
  })
    .then((response) => {
      console.log(response.data);
      if (response.status === 200) {
        console.log("Status updated successfully:", response.data);
        window.location.reload();
      } else {
        console.error("Status update failed:", response);
      }
    })
    .catch((error) => {
      console.error("An error occurred while updating the status:", error);
    });
}

const closeBtn = document.getElementById("btn-close");
closeBtn.addEventListener("click", () => {
  modalButtonBox.innerHTML = "";
  clearInput();
});

addBtn.addEventListener("click", () => {
  clearInput();
  modalButtonBox.innerHTML += `
    <button type="button" class="btn btn-primary" id="row-add-btn" onclick='createPurchase()'>Ekle</button>
    `;
  document.querySelector("#row-add-btn").addEventListener("click", () => {

      // modal.hide();
    //   if (modalValueControl()) {
    // }
  });
});

/*İNPUT ALANLARININ BOŞ OLUP OLMADIĞINI KONTROL EDER */
function valueControl() {
  const alert = document.getElementById("alertWarning"); 
  if (
    !responsiblePerson.value ||
    !productName.value ||
    !price.value ||
    !count.value ||
    !link.value ||
    !description.value
  ) {
    alert.style.display = "block";

    setTimeout(() => {
      alert.style.display = "none";
    }, 1600);

    return;
  }
  alert.style.display = "none";
};

/*YENİ BİR İSTEK OLUŞTURUR */
async function createPurchase() {
  const apiUrl = `${baseUrl}purchase-request/list/`;
  const token = localStorage.getItem("token");
  valueControl();
  const data = {
    responsible_person: responsiblePerson.value,
    product_name: productName.value,
    price: price.value,
    count: count.value,
    deadline: formatDateToCustomFormat(deadline.value),
    e_commerce_site: link.value,
    description: description.value,
    category: [categoryData.value]
  };
  if(statusData.value || orderinDateData.value){
    data.status = statusData.value;
    data.satin_alinan_tarih = formatDateToCustomFormat(orderinDateData.value);
  }
  axios({
    method: "post",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: data,
  })
    .then(async (response) => {
      // getResponsiblePerson();
      // clearInput();
      // tableBody.innerHTML = "";
      console.log(response);
      // window.location.reload();
      purchaseList();
    })
    .catch((error) => {
      console.log(error);
    });
}

/*UZUN FORMATTAKİ TARİHİ KISA FORMATA ÇEVİRİR */
function formatTarih(date) {
  if (date) {
    const datePieces = date.split("T");
    if (datePieces.length > 0) {
      return datePieces[0];
    }
  }
  return null; 
}

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
/*İLGİLİ SATIRIN BİLGİLERİNİ MODAL İÇİNE DOLDURUR */
const getPurchaseData = (purchaseId) => {
  const apiUrl = `${baseUrl}purchase-request/${purchaseId}/`;
  const token = localStorage.getItem("token");

  axios({
    method: "get",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then(async (response) => {
      const purchaseData = response.data;

      const responsiblePersonData = await getResponsibleId(
        purchaseData.responsible_person
      );

      const productNameData = purchaseData.product_name;
      const priceData = purchaseData.price;
      const countData = purchaseData.count;
      const deadlineData = purchaseData.deadline;
      const linkData = purchaseData.e_commerce_site;
      const descriptionData = purchaseData.description;

      responsiblePerson.value = responsiblePersonData;
      productName.value = productNameData;
      price.value = priceData;
      count.value = countData;
      deadline.value = formatTarih(deadlineData);
      link.value = linkData;
      description.value = descriptionData;
      getResponsiblePerson(purchaseData.responsible_person);
    })
    .catch((error) => {
      console.error(error);
    });
};

let currentSortOrder = 'asc';
const table = document.getElementById("purchaseTable");

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
/* İSTEK LİSTESİNİ ALIR */
const purchaseList = async (page = 1) => {
  const apiUrl = `${baseUrl}purchase-request/list/?page=${page}`;
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
        const requestData = response.data.results;
        resolve(requestData);

        tableBody.innerHTML = "";
        showPurchaseRequest(requestData);
      })
      .catch((error) => {
        reject(error);
        console.log(error);
      });
  });
  try {
    const requestData = await api;
    const results = requestData;

    const nextPage = requestData.next;

    results.forEach((item) => {
      dataList.push(item);
    });

    if (nextPage) {
      const nextPageNum = parsePageNumber(nextPage);
      getData(nextPageNum);
    } else {
      console.log(dataList);
    }
  } catch (e) {
    // console.log(error,"error");
  }
};
/*YAPILAN İSTEKLERİ TABLOYA EKLER VE GÖSTERİR */
const showPurchaseRequest = async (requestData) => {
  tableBody.innerHTML = "";
  for (const item of requestData) {
    let newRow = document.createElement("tr");
    const owner = (await getOwnerNameId(item.owner)) || "-";
    const responsiblePerson =
      (await getResponsibleId(item.responsible_person)) || "-";

    const statusData =
      item.status === "IP"
        ? "badge bg-danger fw-semibold"
        : "badge bg-success fw-semibold";

    const productName = item.product_name || "-";
    const price = item.price || "-";
    const count = item.count || "-";
    const e_commerce_site = item.e_commerce_site || "-";
    const purchasing_date = formatTarih(item.created_at) || "-";
    const deadline = formatTarih(item.deadline) || "-";
    const description = item.description || "-";
    const category = (await getCategoryId(item.category)) || "-";
    
    let statusText = item.status === "BE" ? "Bekleniyor" : "İptal Edildi";
    newRow.innerHTML = `
        <td><input class ="form-check-input" type ="checkbox" id="checkbox" value=""</td>
        <td>${owner}</td>
        <td>${responsiblePerson}</td>
        <td><span class="badge ${statusData} fs-12">${
      statusText || "-"
    }</span></td>        
        <td>${productName}</td>
        <td>${category}</td>
        <td>${price}</td>
        <td>${count}</td>
        <td>
        <a href="${e_commerce_site}" target="_blank" style="text-decoration: underline!important; max-width: 100px; display: block;">
            ${
              e_commerce_site.length > 25
                ? e_commerce_site.substr(0, 25) + " ..."
                : e_commerce_site
            }
        </a>
        </td>
        <td>${purchasing_date}</td>  
        <td>${deadline}</td>  
        <td>${description}</td>
        <td><button id="editBtn" class="btn btn-outline-success mdi mdi-pencil btn-sm fs-5 edit-btn" data-bs-toggle ="modal" data-bs-target="#exampleModal" data-user-id='${
          item.id
        }'></button>
        <button class="btn btn-outline-danger mdi mdi-close btn-sm fs-5 delete-btn" data-user-id='${
          item.id
        }'></button></td>
        
        `;

    tableBody.appendChild(newRow);
    const deleteBtn = newRow.querySelector(".delete-btn");
    const editBtn = newRow.querySelector(".edit-btn");

    const ownerid = item.owner;
    const loginnedUser = await getUserInfoId();
    const loginnedUserId = loginnedUser.id;
    const loginnedUserType = loginnedUser.user_type;

    if (loginnedUserId === ownerid || loginnedUserType === "AdminUser") {
      deleteBtn.addEventListener("click", function () {
        deletePurchase(this, loginnedUserId);
      });
      editBtn.addEventListener("click", () => {
        createEditButton(item.id);
      });
    } else {
      editBtn.removeAttribute("onclick");
      editBtn.classList.add("disabled");

      deleteBtn.removeAttribute("onclick");
      deleteBtn.classList.add("disabled");
    }

    const checkbox = newRow.querySelector('input[type="checkbox"]');
    checkbox.addEventListener("change", function (e) {
      e.preventDefault();
      const itemId = item.id;
      if (this.checked) {
        console.log("Seçilen satırın ID'si: " + itemId);
      }
      statusBtn.addEventListener("click", () => {
        updatePurchaseStatus(itemId);
      });

      cancelBtn.addEventListener("click", () => {
        cancelRequest(itemId);
      });
    });

    clearInput();
  }
};
/*İSTEĞİ YAPAN KİŞİNİN İD DEĞERİNİ GÖNDEREREK AYRINTILI
 BİLGİSİNİ ALMAK İÇİN KULLANILIR */
const getOwnerNameId = async (id) => {
  const apiUrl = `${baseUrl}ems/list/?id=${id}`;
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
        const responseData = response.data.results;

        const ownerData = responseData.map((item) => {
          const ownerID = item.id;
          const firstname = item.first_name;
          const lastname = item.last_name;
          return firstname + " " + lastname;
        });

        resolve(ownerData);
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
/*İSTEKTEN SORUMLU KİŞİNİN AYRINTILI BİLGİSİNİ 
ALMAK İÇİN KULLANILIR*/
const getResponsibleId = async (id) => {
  const apiUrl = `${baseUrl}ems/list/?id=${id}`;
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
        const responseData = response.data.results;

        const ownerData = responseData.map((item) => {
          const firstname = item.first_name;
          const lastname = item.last_name;
          return firstname + " " + lastname;
        });

        resolve(ownerData);
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
/*İSTEĞE KATEGORİ BİLGİSİ EKLENMEK İSTEDİĞİN KATEGORİ İSİMLERİNİ GETİRİR */
const getCategoryId = async (id) => {
  const apiUrl = `${baseUrl}category/${id}`;
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
        const responseData = response.data.name;


        resolve(responseData);
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
let personList = [];
/* SORUMLU KİŞİ SEÇMEK OLUŞTURMAK İÇİN PERSONEL LİSTESİ ALINDI*/
async function getResponsiblePerson(purchaseId, page = 1) {
  const apiUrl = `${baseUrl}ems/list/?page=${page}`;
  const token = localStorage.getItem("token");

  try {
    const response = await axios({
      method: "get",
      url: apiUrl,
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    const personNameData = response.data.results;
    console.log(response.data);

    const personListElement = document.getElementById("responsible-person");

    personNameData.forEach((person) => {
      const option = document.createElement("option");
      option.value = person.id;
      option.text = person.first_name + " " + person.last_name;
      if (person.id === purchaseId) {
        option.selected = true; // Seçilen kişiyi seçili olarak işaretle
      }
      personListElement.appendChild(option);
      personList.push(person);
    });

    // başka sayfa olup olmadığının kontrolü
    const nextPage = response.data.next;
    if (nextPage !== null) {
      const nextPage = page + 1;
      return await getResponsiblePerson(personList, nextPage);
    } else {
      return personList;
    }
  } catch (error) {
    console.error(error);
  }
}
/*STATÜ DEĞERLERİNİ SAYFADA ANLAŞILIR HALE GETİRMEK İÇİN KULLANILIR */
const getStatusData = async () => {
  const statusSelect = document.getElementById("statusData");

  const statusOptions = [
    { value: "BE", text: "Bekleniyor" },
    { value: "ON", text: "Onaylandı" },
    { value: "TA", text: "Tamamlandı" },
    { value: "IP", text: "İptal Edildi" },
  ];

  statusOptions.forEach((option) => {
    const optionData = document.createElement("option");
    optionData.value = option.value;
    optionData.textContent = option.text;
    statusSelect.appendChild(optionData);
  });
};
/*KATEGORİ LİSTESİNİ İSMİNE GÖRE ALIR */
function getCategoryData() {
  const apiUrl = `${baseUrl}category`;
  const token = localStorage.getItem("token");

  axios({
    method: "get",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
  }).then((response) => {
    const responseData = response.data.results;
    console.log(responseData);
    const categoryList = document.getElementById("categoryData");
    categoryList.innerHTML = "";

    responseData.forEach((category) =>{
      const option = document.createElement("option");
      option.value = category.id;
      option.text = category.name;
      categoryList.appendChild(option)
    })
  }).catch((error) => {
      console.log(error);
  });
};
/*KALKMIŞ OLAN EKLE BUTONUNUN YERİNE DÜZENLE BUTONU GELİR */
function createEditButton(purchaseId) {
  modalButtonBox.innerHTML += `
      <button type="button" class="btn btn-primary" id="row-edit-btn">Düzenle</button>
    `;
  document.getElementById("row-edit-btn").addEventListener("click", () => {
    if (!valueControl()) {
      editPurchaseRequest(purchaseId);
    }
  });

  getPurchaseData(purchaseId);
}
/*İLGİLİ SATIRDAKİ İSTEĞİ DÜZENLEMEK İÇİNDİR */
function editPurchaseRequest(purchaseId) {
  const apiUrl = `${baseUrl}purchase-request/${purchaseId}/`;
  const token = localStorage.getItem("token");

  axios({
    method: "patch",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      responsible_person: responsiblePerson.value,
      product_name: productName.value,
      price: price.value,
      deadline: formatDateToCustomFormat(deadline.value),
      count: count.value,
      e_commerce_site: link.value,
      description: description.value,
    },
  })
    .then((response) => {
      const userData = response.data;
      console.log(userData);
      // window.location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
}

/*İLGİLİ SATIRDAKİ İSTEĞİ SİLMEK İÇİNDİR */
const deletePurchase = async (delete_button) => {
  Id = delete_button.getAttribute("data-user-id");
  const apiUrl = `${baseUrl}purchase-request/${Id}/`;
  const token = localStorage.getItem("token");

  const api = new Promise((resolve, reject) => {
    console.log("hello");
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

  try {
    const response = await api;
    return response;
  } catch (e) {
    return e;
  }
};
//GİRİŞ YAPAN KİŞİNİN BİLGİLERİNİ ALIR*/
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
        const statusMenu = document.getElementById("statusMenu");
        const orderingDateMenu = document.getElementById("orderingDateMenu");
        // if (userInfo.user_type === "AdminUser") {
        //   statusBtn.style.display = "inline-block ";
        //   statusMenu.style.display=('block');
        //   // getStatusData();
        // }

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
    console.log(e);
  }
};

/*İNPUT ALANLARINI BOŞALTIR */
function clearInput() {
  productName.value = "";
  price.value = "";
  count.value = "";
  link.value = "";
  deadline.value = "";
  description.value = "";
  responsiblePerson.value = "";
}

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

/*TABLODAKİ VERİLER ARASINDA ARAMA YAPAR*/
function searchData() {
  const searchInput = document.getElementById("search-input");
  const searchTerm = searchInput.value.toLowerCase();
  const tableRows = document.querySelectorAll("#purchaseTable tbody tr");

  tableRows.forEach((row) => {
    const rowData = Array.from(row.getElementsByTagName("td"))
      .map((cell) => cell.textContent.toLowerCase())
      .join(" ");

    if (rowData.includes(searchTerm) || searchTerm === "") {
      row.style.display = "table-row";
    } else {
      row.style.display = "none";
    }
  });
}

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm === "") {
    const tableRows = document.querySelectorAll("#purchaseTable tbody tr");
    tableRows.forEach((row) => {
      row.style.display = "table-row";
    });
  } else {
    searchData(searchTerm);
  }
});
/*SAYFA YENİLENDİĞİNDE ÇALIŞIR */
window.addEventListener("load", async (event) => {
  const loginnedUser = await getUserInfoId();
  const loginnedUserType = loginnedUser.user_type;
  if (loginnedUserType === "AdminUser") {
    cancelBtn.style.display = "inline-block";
    statusBtn.style.display = "inline-block ";
    orderingDateMenu.style.display = "block";
    statusMenu.style.display = "block";

    getStatusData();
  }
  getResponsiblePerson();

  purchaseList(1);
  getCategoryData();
});
