const addBtn = document.getElementById("add-btn");
const modaltitle = document.getElementById("exampleModalLabel");

const personName = document.getElementById("personName");
const productName = document.getElementById("productName");
const price = document.getElementById("price");
const count = document.getElementById("count");
const link = document.getElementById("link");
const purchasingDate = document.getElementById("purchasingDate");
const description = document.getElementById("description");
const responsiblePerson = document.getElementById("responsible-person");
const statusData = document.getElementById("statusData");
const categoryData = document.getElementById("categoryData");

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

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    purchaseList(currentPage);
  }
});

nextPageBtn.addEventListener("click", () => {
  currentPage++;
  purchaseList(currentPage);
});
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
    // console.log(results);

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
  getResponsiblePerson();
  clearInput();
  modalButtonBox.innerHTML += `
    <button type="button" class="btn btn-primary" id="row-add-btn" onclick='createPurchase()'>Ekle</button>
    `;
  document.querySelector("#row-add-btn").addEventListener("click", () => {
    // if (modalValueControl()) {
    //   modal.hide();
    // }
  });
});

function valueControl() {
  const alert = document.getElementById("alertWarning"); // Define 'alert' here
  if (
    !responsiblePerson.value ||
    !productName.value ||
    !price.value ||
    !count.value ||
    !purchasingDate.value ||
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
}

async function createPurchase() {
  const apiUrl = `${baseUrl}purchase-request/list/`;
  const token = localStorage.getItem("token");
  valueControl();
  axios({
    method: "post",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      responsible_person: responsiblePerson.value,
      product_name: productName.value,
      price: price.value,
      count: count.value,
      created_at: formatDateToCustomFormat(purchasingDate.value),
      e_commerce_site: link.value,
      description: description.value,
      status: statusData.value,
      category: [categoryData.value],
      project:[],
    },
  })
    .then(async (response) => {
      getResponsiblePerson();
      clearInput();
      tableBody.innerHTML = "";
      // window.location.reload();
      purchaseList();
    })
    .catch((error) => {
      console.log(error);
    });
}

function formatTarih(tarih) {
  if (tarih) {
    const tarihParcalari = tarih.split("T");
    return tarihParcalari[0];
  }
  return "-";
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
      const purchasingDateData = purchaseData.created_at;
      const linkData = purchaseData.e_commerce_site;
      const descriptionData = purchaseData.description;

      // const transDate = new Date (purchasingDateData);

      responsiblePerson.value = responsiblePersonData;
      productName.value = productNameData;
      price.value = priceData;
      count.value = countData;
      purchasingDate.value = formatTarih(purchasingDateData);
      link.value = linkData;
      description.value = descriptionData;
      getResponsiblePerson(purchaseData.responsible_person);
    })
    .catch((error) => {
      console.error(error);
    });
};
function getModalValues() {
  const data = {
    responsiblePerson: responsiblePerson.value,
    productName: productName.value,
    price: price.value,
    count: count.value,
    purchasingDate: purchasingDate.value,
    link: link.value,
    description: description.value,
  };
  return data;
}

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

    // Check if there are more pages
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

function modalValueControl() {
  const newResponsible = document.getElementById("responsible-person");
  const newProductName = document.getElementById("productName");
  const newPrice = document.getElementById("price");
  const newCount = document.getElementById("count");
  const newPurchaseDate = document.getElementById("purchasingDate");
  const newLink = document.getElementById("link");
  // const newDescription = document.getElementById("description");

  const alert = document.getElementById("alertWarning");

  if (
    !newResponsible.value ||
    !newProductName.value ||
    !newPrice.value ||
    !newCount.value ||
    !newPurchaseDate.value ||
    !newLink.value
  ) {
    alert.style.display = "block";
    setTimeout(() => {
      alert.style.display = "none";
    }, 1600);
    return false;
  }

  alert.style.display = "none";
  return true;
}

function createEditButton(purchaseId) {
  modalButtonBox.innerHTML += `
      <button type="button" class="btn btn-primary" id="row-edit-btn">Düzenle</button>
    `;
  document.getElementById("row-edit-btn").addEventListener("click", () => {
    if (modalValueControl()) {
      editPurchaseRequest(purchaseId);
    }
  });

  getPurchaseData(purchaseId);
}
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
      created_at: formatDateToCustomFormat(purchasingDate.value),
      count: count.value,
      e_commerce_site: link.value,
      description: description.value,
    },
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

const getUserInfoId = async () => {
  //GİRİŞ YAPAN KİŞİNİN BİLGİLERİ
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

function clearInput() {
  productName.value = "";
  price.value = "";
  count.value = "";
  link.value = "";
  purchasingDate.value = "";
  description.value = "";
  responsiblePerson.value = "";
}
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

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

window.addEventListener("load", async (event) => {
  const loginnedUser = await getUserInfoId();
  const loginnedUserType = loginnedUser.user_type;
  if (loginnedUserType === "AdminUser") {
    cancelBtn.style.display = "inline-block";
    statusBtn.style.display = "inline-block ";
    statusMenu.style.display = "block";
    getStatusData();
  }

  purchaseList(1);
  getCategoryData();
});
