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
    }).catch((error) =>{
        console.log(error)
    })
}
getPurchase();