const tablebody = document.getElementById('purchase-table');
const statusBtn = document.getElementById('situation');
const cancelBtn = document.getElementById('cancel');
const replyBtn = document.getElementById('reply');

async function cancelRequest(requestId){
    const apiUrl = `http://backend.norbit.com.tr/purchase-request/${requestId}/`;
    const token = localStorage.getItem('token');

    axios({
        method:'patch',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
            data:{
            status: 'İptal Edildi',
        }

    }).then((response)=>{
        console.log(response.data)
        if (response.status === 200) {
            console.log('Status updated successfully:', response.data);
            window.location.reload();

        } else {
            console.error('Status update failed:', response);
        }

    }).catch((error) => {

        console.error('An error occurred while updating the status:', error);

    })
}
async function updatePurchaseStatus(requestId){
    const apiUrl = `http://backend.norbit.com.tr/purchase-request/${requestId}/`;
    const token = localStorage.getItem('token');

    axios({
        method:'patch',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
         data:{
            status: 'Tamamlandı',
        }

    }).then((response)=>{
        console.log(response.data)
        if (response.status === 200) {
            console.log('Status updated successfully:', response.data);
            window.location.reload();

        } else {
            console.error('Status update failed:', response);
        }

    }).catch((error) => {

        console.error('An error occurred while updating the status:', error);

    })
}
async function replyRequest(requestId){
    const apiUrl = `http://backend.norbit.com.tr/purchase-request/${requestId}/`;
    const token = localStorage.getItem('token');

    axios({
        method:'patch',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
         data:{
            status: 'Bekleniyor',
        }

    }).then((response)=>{
        console.log(response.data)
        if (response.status === 200) {
            console.log('Status updated successfully:', response.data);
            window.location.reload();

        } else {
            console.error('Status update failed:', response);
        }

    }).catch((error) => {

        console.error('An error occurred while updating the status:', error);

    })
}

function getPurchase(){
    const apiUrl = `http://backend.norbit.com.tr/purchase/list/`;
    const token  = localStorage.getItem('token');

    axios ({
        method:'get',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
    }).then((response) =>{
        const responseData = response.data.results;
        console.log(responseData)
        showPurchase(responseData)
    }).catch((error) =>{
        console.log(error)
    })
}
const showPurchase = async (responseData)  => {
    // tableBody.innerHTML = '';
    responseData.forEach( async purchase => {

        const newRow = document.createElement('tr') ;
        const owner = await getOwnerName(purchase.owner)  || '-';
        const productName = purchase.product_name || '-';
        const price = purchase.price || '-';
        const count = purchase.count || '-';
        const e_commerce_site = purchase.e_commerce_site || '-';
        const purchasing_date = purchase.purchasing_date || '-';

        newRow.innerHTML = `
        <td><input class="form-check" type ="checkbox"  id="checkbox" value=""</td>
        <td>${owner}</td>
        <td>${purchase.status}</td>
        <td>${productName}</td>
        <td>${price}</td>
        <td>${count}</td>
        <td><a href="${e_commerce_site}" target="_blank" style="text-decoration:underline!important">${e_commerce_site}</a></td>  
        <td>${purchasing_date}</td>

        `;
        tablebody.appendChild(newRow);

        const checkBox = newRow.querySelector('input[type="checkbox"]');
        checkBox.addEventListener('change', (e) => {
            e.preventDefault();
            const purchaseId = purchase.id;
            if(this.checked){
                console.log("Seçilen satırın ID'si: " + purchaseId);
            }   
            statusBtn.addEventListener('click', () => {
                updatePurchaseStatus(purchaseId);
                });
            
            cancelBtn.addEventListener('click', () =>{
                cancelRequest(purchaseId);
            });

            replyBtn.addEventListener('click', () =>{
                replyRequest(purchaseId);
            });

        })
    });
}


const getOwnerName = async (id) => {

    const apiUrl= `http://backend.norbit.com.tr/ems/list/?id=${id}`
    const token  = localStorage.getItem('token');
    const api = new Promise((resolve, reject) => {
    axios({
        method:'get',
        url:apiUrl,
        headers:{ 
            "Authorization": `Token ${token}`
        },
    }).then((response)=>{
        const responseData = response.data.results


        const ownerData = responseData.map((item) => {
            const ownerID = item.id;
            const firstname = item.first_name;
            const lastname = item.last_name;
            return firstname + ' ' + lastname
            console.log(firstname)
        });

        resolve(ownerData);
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
}

window.addEventListener('load', (event) => {
    getPurchase();
    });
    