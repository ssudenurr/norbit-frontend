const tablebody = document.getElementById('purchase-table') 
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
        const newRow = document.createElement('tr');
        const owner = await getOwnerName(purchase.owner)
        console.log(responseData)

        newRow.innerHTML = `
        <td>${owner}</td>
        <td>${purchase.status}</td>
        <td>${purchase.product_name}</td>
        <td>${purchase.price}</td>
        <td>${purchase.count}</td>
        <td>${purchase.e_commerce_site}</td>
        <td>${purchase.purchasing_date}</td>

        `;
        tablebody.appendChild(newRow)
    });
}

window.addEventListener('load', (event) => {
getPurchase();
})

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