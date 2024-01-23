/*ANA SAYFADAKİ BUTONU TAKVİME YÖNLENDİRİR  */
const getCalendar = ()=> {
    const apiUrl= "https://calendar.google.com/calendar/u/0/r"
    const token  = localStorage.getItem('token');
    
   window.location.href = apiUrl
}
