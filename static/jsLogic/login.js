$(document).ready(function () {

    $("#signInBtn").click(function () {
        validateFields();
    });

    $('#signUpBtn').click(function () {
        registerNewUser();
    });

});


function validateFields() {
    var useremail = $("#email_input").val();
    var password = $("#pwd_input").val();
    if (useremail === '' || useremail === undefined) {
        swal("Please enter login email");
        return false;
    } else if (password === '' || password === undefined) {
        swal("Please enter password");
        return false;
    } else if (!checkuser(useremail, password)) {
        return false;
    } else {

    }
}


function checkuser(useremail, password) {
    $('#signInBtn').prop('disabled', true);
    const flag = false;
    const UserDetails = {
        "useremail": useremail,
        "password": password
    };
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    $.ajax({
        type: "POST",
        url: "/login_operation/",
        headers: {'X-CSRFToken': csrftoken},
        data: UserDetails,
        async: false,
        success: function (data) {
            if (data.result === "success") {
                gotoRespectiveLogin(data.u_code, data.u_type);
            } else if (data.result === "failed") {
                resetLoginButtonAndInputs();
                swal(data.msg);
            } else if (data.result === "error") {
                resetLoginButtonAndInputs();
                swal(data.msg);
            }
        },
        error: function (error) {
            console.log("Error in checkuser function", error);
        }
    });
    return flag;
}


function gotoRespectiveLogin(user_code, user_type) {
    if (user_type === 'SADMIN') {
        window.location.href = '/superadmin_dashboard/';
    } else if (user_type === 'KYCADMIN') {
        window.location.href = '/kycadmin_dashboard/';
    } else if (user_type === 'AGENT') {
        window.location.href = '/agent_dashboard/';
    }
}


function resetLoginButtonAndInputs() {
    $("#email_input, #pwd_input").val('');
    $('#signInBtn').prop('disabled', false);
}


function registerNewUser() {
    const name = $('#reg_name_input').val();
    const email = $('#reg_email_input').val();
    const password = $('#reg_pass_input').val();
    const emailadd = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!name) {
        swal('Enter your name');
        return false;
    } else if (!email) {
        swal('Enter your email id');
        return false;
    } else if (!(emailadd.test(email))) {
        swal("Enter Valid Email Id");
        return false;
    } else if (password.length < 5) {
        swal("Enter minimum 5 characters for password.");
        return false;
    } else {
        const details = {'name': name, 'email': email, 'password': password};
        $('#signUpBtn').prop('disabled', true);
        $.ajax({
            type: 'POST',
            url: '/register/',
            data: details,
            success: function (response) {
                if (response.result === 'success') {
                    swal(response.msg);
                    $('#signUpBtn').prop('disabled', false);
                    setTimeout(function () {
                        window.location.reload();
                    }, 2000);
                } else if (response.result === "email_exist") {
                    $('#signUpBtn').prop('disabled', false);
                    swal(response.msg);
                } else if (response.result === 'failed') {
                    $('#signUpBtn').prop('disabled', false);
                    swal(response.msg);
                }
            }, error: function (error) {
                console.log('Error in registerNewUser function ->', error)
            }
        });
    }
}