$(document).ready(function () {
    $('#save_admin_details_btn').click(function () {
        saveAdminDetails();
    });

    $('#addNewAdminModal').on('hidden.bs.modal', function (e) {
        $("#adminHiddenCode,#admin_email_input,#admin_name_input,#admin_mobile_input,#admin_state_input,#admin_address_input").val('');
    });

    $('#addNewAgentBehalf_ofAdminModal').on('hidden.bs.modal', function (e) {
        $("#agentHiddenCode,#select_admin_for_agent,#admin_name_input,#admin_mobile_input,#admin_state_input,#admin_address_input").val('');
    });
});


function saveAdminDetails() {
    const adminHiddenUniqueCode = $('#adminHiddenCode').val();
    const adminEmail = $('#admin_email_input').val();
    const adminName = $('#admin_name_input').val();
    const adminMobile = $('#admin_mobile_input').val();
    const adminState = $('#admin_state_input').val();
    const adminAddress = $('#admin_address_input').val();
    const emailadd = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (adminEmail === '') {
        swal("Enter Emailid");
        return false;
    } else if (!(emailadd.test(adminEmail))) {
        swal("Enter Valid Email Id");
        return false;
    } else if (!adminName) {
        swal("Enter Name");
        return false;
    } else if (!adminMobile) {
        swal("Enter Mobile Number");
        return false;
    } else if (adminMobile.length !== 10) {
        swal('Enter 10 digit mobile number');
        return false
    } else if (!adminState) {
        swal("Enter State");
        return false;
    } else if (!adminAddress) {
        swal("Enter Address");
        return false;
    } else {
        const details = {
            'adminHiddenUniqueCode': adminHiddenUniqueCode,
            'adminEmail': adminEmail,
            'adminName': adminName,
            'adminMobile': adminMobile,
            'adminState': adminState,
            'adminAddress': adminAddress
        };
        $.ajax({
            type: 'POST',
            url: '/superadmin/save_admin_details/',
            data: details,
            success: function (response) {
                if (response.result === 'created') {
                    swal(response.msg);
                } else if (response.result === 'updated') {
                    swal(response.msg);
                } else if (response.result === 'email_already_exists') {
                    swal(response.msg);
                } else if (response.result === 'failed') {
                    swal(response.msg);
                }
            }, error: function (error) {
                console.log('Error in createUpdateclientDetails function ->', error);
            }
        })
    }
}


function fetchAllAdminsAndAgentsForSuperadmin() {
    $.ajax({
        type: 'POST',
        url: '/fetch_all_agents_and_admins_for_superadmin/',
        success: function (response) {
            if (response.result === 'success') {
                $('#agent_details_table,#admin_details_table > tbody').empty();
                response.all_admins.forEach(function (admin) {
                    let adminTableDetails = "<tr>" +
                        // "<td><div class='form-check'><input type='checkbox' class='form-check-input select_checkbox' name='select_checkbox' id='" + agent.client_id + "'></div></td>" +
                        "<td>" + admin.kycadmin_name + "</td>" +
                        "<td>" + admin.kycadmin_email + "</td>" +
                        "<td>" + admin.kycadmin_mobile + "</td>" +
                        "<td>" + admin.kycadmin_state + "</td>" +
                        "<td>" + admin.kycadmin_address + "</td>" +
                        "<td>" + "<button id='" + admin.admin_id + "' class='btn btn-info btn-sm edit-client'>Edit</button><button id='" + admin.admin_id + "' class='btn btn-sm  change-client-status'>Delete</button>" + "</td>";

                    adminTableDetails += "</tr>";
                    $('#admin_details_table > tbody').append(adminTableDetails);
                });

                response.all_agents.forEach(function (agent) {
                    let agentTableDetails = "<tr>" +
                        // "<td><div class='form-check'><input type='checkbox' class='form-check-input select_checkbox' name='select_checkbox' id='" + agent.client_id + "'></div></td>" +
                        "<td>" + agent.agent_name + "</td>" +
                        "<td>" + agent.agent_email + "</td>" +
                        "<td>" + agent.agent_mobile + "</td>" +
                        "<td>" + agent.agent_state + "</td>" +
                        "<td>" + agent.agent_address + "</td>" +
                        "<td>" + "<button id='" + agent.agent_id + "' class='btn btn-info btn-sm edit-client'>Edit</button><button id='" + agent.agent_id + "' class='btn btn-sm  change-client-status'>Delete</button>" + "</td>";
                    agentTableDetails += "</tr>";
                    $('#agent_details_table > tbody').append(agentTableDetails);
                });

                $('#agent_details_table,#admin_details_table').DataTable({
                    'destroy': true,
                    "ordering": false,
                    'searching': true,
                    'retrieve': true,
                });
                $('.dataTables_length').addClass('bs-select');

            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log('Error in fetchAllAdminsAndAgentsForSuperadmin function -->', error);
        }
    })
}


function saveAgentDetailsBySuperadmin() {
    const agentHiddenUniqueCode = $('#agentHiddenCode').val();
    const selectAdminForAgent = $('#select_admin_for_agent').val();
    const agentEmail = $('#agent_email_input').val();
    const agentName = $('#agent_name_input').val();
    const agentMobile = $('#agent_mobile_input').val();
    const agentState = $('#agent_state_input').val();
    const agentAddress = $('#agent_address_input').val();
    const emailadd = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (agentEmail === '') {
        swal("Enter Emailid");
        return false;
    } else if (!(emailadd.test(agentEmail))) {
        swal("Enter Valid Email Id");
        return false;
    } else if (!agentName) {
        swal("Enter Name");
        return false;
    } else if (!agentMobile) {
        swal("Enter Mobile Number");
        return false;
    } else if (agentMobile.length !== 10) {
        swal('Enter 10 digit mobile number');
        return false
    } else if (!agentState) {
        swal("Enter State");
        return false;
    } else if (!agentAddress) {
        swal("Enter Address");
        return false;
    } else {
        const details = {
            'agentHiddenUniqueCode': agentHiddenUniqueCode,
            'selectAdminForAgent': selectAdminForAgent,
            'agentEmail': agentEmail,
            'agentName': agentName,
            'agentMobile': agentMobile,
            'agentState': agentState,
            'agentAddress': agentAddress
        };
        $.ajax({
            type: 'POST',
            url: '/superadmin/save_agent_details_by_superadmin/',
            data: details,
            success: function (response) {
                if (response.result === 'created') {
                    // fetchAgentsUnderAdmin();
                    swal(response.msg);
                } else if (response.result === 'updated') {
                    // fetchAgentsUnderAdmin();
                    swal(response.msg);
                } else if (response.result === 'email_already_exists') {
                    swal(response.msg);
                } else if (response.result === 'failed') {
                    swal(response.msg);
                }
            }, error: function (error) {
                console.log('Error in saveAgentDetailsBySuperadmin function ->', error);
            }
        })
    }
}


function keyValidate() {
    var e = event || window.event;  // get event object
    var key = e.keyCode || e.which; // get key cross-browser

    if (key == 9 || key == 8 || key == 46 || key == 37 || key == 39 || key == 96 || key == 97 || key == 98 || key == 99 || key == 100 || key == 101 || key == 102 || key == 103 || key == 104 || key == 105) {
    } else {
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) { //if it is not a number ascii code
            //Prevent default action, which is inserting character
            if (e.preventDefault) e.preventDefault(); //normal browsers
            e.returnValue = false; //IE
        }
    }
}