const tableBody = document.querySelector("#job-title-table tbody");
const modal = new bootstrap.Modal(document.getElementById("exampleModal"));
const inputJobTitle = document.getElementById("inputJobTitle");

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
    createJobTitle();
  });
  modal.show();
});

function clearInput() {
    inputJobTitle.value = "";
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

function getJobTitleList() {
  // GET COMPANY NAME
  const apiUrl = "https://backend.norbit.com.tr/jobs/list/";
  const token = localStorage.getItem("token");

  axios({
    method: "get",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => {
      const jobTitleData = response.data.results;
      console.log(jobTitleData);
      showJobList(jobTitleData);

    })
    .catch((error) => {
      console.log(error);
    });
}

function showJobList(jobTitleData) {
  tableBody.innerHTML = "";

  for (const item of jobTitleData) {
    const newRow = document.createElement("tr");
    const jobTitle = item.job_title;
    const createdDate = formatTarih(item.created_at) || "-";
    const itemId = item.id; // Şimdi itemId'yi doğru şekilde alıyoruz

    newRow.innerHTML = `
            <td style="text-align: center;">${jobTitle}</td>
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
        deleteJobTitle(itemId);
    });
  }
}
async function clickToEditBtn(jobId) {
  buttonBox.innerHTML = `
    <button type="button" class="btn btn-info" data-bs-dismiss="modal" id="save-btn">Kaydet</button>
    `;
  document.getElementById("save-btn").addEventListener("click", () => {
    editJobData(jobId);
  });
  getRowData(jobId);
}

function createJobTitle() {
  const apiUrl = "https://backend.norbit.com.tr/jobs/create/";
  const token = localStorage.getItem("token");
  axios({
    method: "post",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      job_title: inputJobTitle.value,
    },
  })
    .then(async (response) => {
      tableBody.innerHTML = "";
      getJobTitleList();
    })
    .catch((error) => {
      console.log(error);
    });
}

function getRowData(jobId) {
  const apiUrl = `http://backend.norbit.com.tr/jobs/${jobId}/`;
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

      const jobData = responseData.job_title;

      inputJobTitle.value = jobData;
    })
    .catch((error) => {
      console.log("error", error);
    });
}

function editJobTitle(jobId) {
  const apiUrl = `http://backend.norbit.com.tr/jobs/${jobId}/`;
  const token = localStorage.getItem("token");

  axios({
    method: "patch",
    url: apiUrl,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      job_title: inputJobTitle.value,
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
}
function deleteJobTitle(jobId) {
  const apiUrl = `http://backend.norbit.com.tr/jobs/${jobId}/`;
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
    getJobTitleList();
});
