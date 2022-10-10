// Confirm Logout function
function confirmLogout() {
    var logout = confirm("Are you sure you want to logout?");
    if (logout == true) {
        window.location.href = "/logout";
    }
}

function confirmDelete(_id){
    if(confirm("Are you sure you want to delete this evaluation?")){
        window.location.href = "/evaluations/deeniyat/" + _id + "/delete";
    }
}

function confirmDeleteAcademic(_id){
    if(confirm("Are you sure you want to delete this evaluation?")){
        window.location.href = "/evaluations/academic/" + _id + "/delete";
    }
}

function equateValue(){
    let address = document.getElementById('address').value;
    let currentAddress = document.getElementById('currentAddress').value;
    if(document.getElementById('sameAddress').checked){
        document.getElementById('currentAddress').value = address;
    }else{
        document.getElementById('currentAddress').value = currentAddress;
    }
}

 function loader(){
    setTimeout(() => {
        document.getElementById('loader').style.display = "none";
        document.getElementById('main').style.display = "block";
    }, 400);
}