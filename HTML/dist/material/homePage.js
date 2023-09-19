
const getCalendar = ()=> {
    const apiUrl= "http://backend.norbit.com.tr/calendar/"
    const token  = localStorage.getItem('token');
    
   window.location.href = apiUrl
}
