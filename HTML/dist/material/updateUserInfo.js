document.addEventListener("DOMContentLoaded", function () {
    const updateButton = document.getElementById('updateBtn');
    updateButton.addEventListener('click', function () {
        openUpdateModal();
    });

    function openUpdateModal() {
        const updateModal = document.getElementById('updateModal');
        updateModal.style.display = "block";
    }

    function updateUserInfo() {
        const apiUrl = "http://backend.norbit.com.tr/accounts/user/";
        const token = localStorage.getItem('token');

        const newFirstName = document.getElementById('newFirstName').value;
        const newLastName = document.getElementById('newLastName').value;

        const updateData = {
            first_name: newFirstName,
            last_name: newLastName
        };

        axios({
            method: 'patch',
            url: apiUrl,
            headers: {
                "Authorization": `Token ${token}`
            },
            data: updateData
        }).then((response) => {
            const userData = response.data;
            UserDetails(userData);
            
            // Modalı kapat
            const updateModal = document.getElementById('updateModal');
            updateModal.style.display = "none";
        }).catch((error) => {
            console.log(error);
        });
    }

    function UserDetails(userData) {
        document.getElementById("firstNameValue").textContent = userData.first_name;
        document.getElementById("lastNameValue").textContent = userData.last_name;
    }

    const saveChangesBtn = document.getElementById('saveChangesBtn');
    saveChangesBtn.addEventListener('click', function () {
        updateUserInfo();
    });

    window.onload = function () {
        getUserInfo();
    };
});
   