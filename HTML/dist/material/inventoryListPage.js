const tableBody = document.getElementById('inventory-table');

function getInventory(){
    const apiUrl = 'http://backend.norbit.com.tr/inventory/list/';
    const token = localStorage.getItem('token');
    
    axios ({
        method:'get',
        url:apiUrl,
        headers:{
            "Authorization": `Token ${token}`
        },
    }).then((response) => {
        const responseData = response.data.results;
        console.log(responseData);
        showInventory(responseData);
    }).catch((error) =>{
        console.log(error)
    })
}

const showInventory =  async (responseData) => {
    responseData.forEach(item => {
        const newRow = document.createElement('tr');
        console.log(responseData)
        const product_name = item.product_name || '-';
        const where_in_the_office = item.where_in_the_office || '-';
        const price = item.price || '-';
        const count = item.count || '-';
        const purchasing_date = item.purchasing_date || '-';
        newRow.innerHTML = `
        <td>${product_name}</td>
        <td>${where_in_the_office}</td>
        <td>${price}</td>
        <td>${count}</td>
        <td>${purchasing_date}</td>
        <td>${item.description}</td>
        `
        tableBody.appendChild(newRow);
    });
}


window.addEventListener('load', () =>{
    getInventory();
})