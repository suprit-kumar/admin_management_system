$(document).ready(function () {
    updateClientStatus();
    fetchAllAdminForSuperadmin();
    fetchAllAgentsForSuperadmin();
    fetchAllClientsForSuperadmin();

    $('#save_admin_details_btn').click(function () {
        saveAdminDetails();
    });

    $("#superadmin_save_agent_details").click(function () {
        saveAgentDetailsBySuperadmin();
    });

    $("#save_client_details_btn").click(function () {
        saveClientDetails();
    });

    $('#addNewAdminModal').on('hidden.bs.modal', function (e) {
        $("#adminHiddenCode,#admin_email_input,#admin_name_input,#admin_mobile_input,#admin_state_input,#admin_address_input").val('');
    });

    $('#addNewAgentBehalf_ofAdminModal').on('hidden.bs.modal', function (e) {
        $("#agentHiddenCode,#select_admin_for_agent,#admin_name_input,#admin_mobile_input,#admin_state_input,#admin_address_input").val('');
    });

    $('#create_update_client_modal').on('hidden.bs.modal', function (e) {
        $("#clientHiddenCode,#client_email_input,#client_name_input,#client_mobile_input,#client_state_input,#client_address_input").val('');
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
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        $.ajax({
            type: 'POST',
            url: '/superadmin/save_admin_details/',
            headers: {'X-CSRFToken': csrftoken},
            data: details,
            success: function (response) {
                if (response.result === 'created') {
                    fetchAllAdminForSuperadmin();
                    swal(response.msg);
                    reload();
                } else if (response.result === 'updated') {
                    fetchAllAdminForSuperadmin();
                    swal(response.msg);
                    reload();
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


function fetchAllAdminForSuperadmin() {
    $.ajax({
        type: 'POST',
        url: '/superadmin/fetch_all_admins_under_for_superadmin/',
        async: false,
        success: function (response) {
            if (response.result === 'success') {
                $('#agent_details_table,#admin_details_table > tbody').empty();
                $('#select_admin_for_agent').empty();
                $('#select_admin_for_agent').prepend("<option value=''>Select Admin For Agent</option>");
                response.all_admins.forEach(function (admin) {
                    let adminTableDetails = "<tr>" +
                        "<td>" + admin.kycadmin_name + "</td>" +
                        "<td>" + admin.kycadmin_email + "</td>" +
                        "<td>" + admin.kycadmin_mobile + "</td>" +
                        "<td>" + admin.kycadmin_state + "</td>" +
                        "<td>" + admin.kycadmin_address + "</td>" +
                        "<td>" + "<button id='" + admin.admin_id + "' class='btn btn-info btn-sm edit-admin-details'>Edit</button><button id='" + admin.admin_id + "' class='btn btn-sm delete-admin-details btn-danger'>Delete</button>" + "</td>";
                    adminTableDetails += "</tr>";
                    $('#admin_details_table > tbody').append(adminTableDetails);
                    $('#select_admin_for_agent').append("<option value='" + admin.kycadmin_usercode + "'>" + admin.kycadmin_name + "</option>");
                });
                $('#admin_details_table').DataTable({
                    'destroy': true,
                    "ordering": false,
                    'searching': true,
                    'retrieve': true,
                });
                $('.dataTables_length').addClass('bs-select');

                $('.edit-admin-details').click(function () {
                    const id = $(this).attr('id');
                    fetchAdminDetailsById(id);
                    $('#addNewAdminModal').modal('show');
                });

                $('.delete-admin-details').click(function () {
                    const id = $(this).attr('id');
                    deleteAdminDetailsById(id);
                });
            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log('Error in fetchAllAdminForSuperadmin function -->', error);
        }
    })
}

function deleteAdminDetailsById(id) {
    $.ajax({
        type: 'POST',
        url: '/delete_admin_details_by_id/',
        data: {'id': id},
        success: function (response) {
            if (response.result === 'deleted') {
                fetchAllAdminForSuperadmin();
                swal(response.msg);
            } else if (response.result === 'failed') {
                fetchAllAdminForSuperadmin();
                swal(response.msg);
            }
        }, error: function (error) {
            console.log('Error in deleteAdminDetailsById function --->', error);
        },
    })
}

function fetchAllAgentsForSuperadmin() {
    $.ajax({
        type: 'POST',
        url: '/superadmin/fetch_all_agents_under_for_superadmin/',
        async: false,
        success: function (response) {
            if (response.result === 'success') {
                $('#agent_details_tab > tbody').empty();
                response.all_agents.forEach(function (agent) {
                    var agentTableDetails = "<tr>" +
                        "<td>" + agent.agent_name + "</td>" +
                        "<td>" + agent.agent_email + "</td>" +
                        "<td>" + agent.agent_mobile + "</td>" +
                        "<td>" + agent.agent_state + "</td>" +
                        "<td>" + agent.agent_address + "</td>" +
                        "<td>" + "<button id='" + agent.agent_id + "' class='btn btn-info btn-sm edit-agent-details'>Edit</button><button id='" + agent.agent_id + "' class='btn btn-sm btn-danger delete-agent-details'>Delete</button>" + "</td>";
                    agentTableDetails += "</tr>";
                    $('#agent_details_tab > tbody').append(agentTableDetails);
                });

                $('#agent_details_tab').DataTable({
                    'destroy': true,
                    "ordering": false,
                    'searching': true,
                    'retrieve': true,
                });
                $('.dataTables_length').addClass('bs-select');

                $('.edit-agent-details').click(function () {
                    const id = $(this).attr('id');
                    fetchAgentDetailsById(id);
                    $('#addNewAgentBehalf_ofAdminModal').modal('show');
                });

                $('.delete-agent-details').click(function () {
                    const id = $(this).attr('id');
                    deleteAgentDetailsById(id);
                });
            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log('Error in fetchAllAdminForSuperadmin function -->', error);
        }
    })
}

function deleteAgentDetailsById(id) {
    $.ajax({
        type: 'POST',
        url: '/delete_agent_details_by_id/',
        data: {'id': id},
        success: function (response) {
            if (response.result === 'deleted') {
                fetchAllAgentsForSuperadmin();
                swal(response.msg);
            } else if (response.result === 'failed') {
                fetchAllAgentsForSuperadmin();
                swal(response.msg);
            }
        }, error: function (error) {
            console.log('Error in deleteAdminDetailsById function --->', error);
        },
    })
}

function fetchAdminDetailsById(id) {
    $.ajax({
        type: 'POST',
        url: '/fetch_admin_details_by_id/',
        data: {'id': id},
        success: function (response) {
            if (response.result === 'success') {
                const details = response.admin_details[0];
                $('#adminHiddenCode').val(details.kycadmin_usercode);
                $('#admin_email_input').val(details.kycadmin_email);
                $('#admin_name_input').val(details.kycadmin_name);
                $('#admin_mobile_input').val(details.kycadmin_mobile);
                $('#admin_state_input').val(details.kycadmin_state);
                $('#admin_address_input').val(details.kycadmin_address);
            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log("Error in fetchAdminDetailsById function --->", error);
        }
    })
}

function fetchAgentDetailsById(id) {
    $.ajax({
        type: 'POST',
        url: '/fetch_agent_details_by_id/',
        data: {'id': id},
        success: function (response) {
            if (response.result === 'success') {
                const details = response.agent_details[0];
                $('#agentHiddenCode').val(details.agent_usercode);
                $('#select_admin_for_agent').val(details.admin_id__kycadmin_usercode).trigger('change');
                $('#agent_email_input').val(details.agent_email);
                $('#agent_name_input').val(details.agent_name);
                $('#agent_mobile_input').val(details.agent_mobile);
                $('#agent_state_input').val(details.agent_state);
                $('#agent_address_input').val(details.agent_address);

            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log("Error in fetchAdminDetailsById function --->", error);
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
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        $.ajax({
            type: 'POST',
            url: '/superadmin/save_agent_details_by_superadmin/',
            headers: {'X-CSRFToken': csrftoken},
            data: details,
            success: function (response) {
                if (response.result === 'created') {
                    fetchAllAgentsForSuperadmin();
                    swal(response.msg);
                    reload();
                } else if (response.result === 'updated') {
                    fetchAllAgentsForSuperadmin();
                    swal(response.msg);
                    reload();
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

function saveClientDetails() {
    const clientHiddenUniqueCode = $('#clientHiddenCode').val();
    const clientEmail = $('#client_email_input').val();
    const clientName = $('#client_name_input').val();
    const clientMobile = $('#client_mobile_input').val();
    const clientState = $('#client_state_input').val();
    const clientAddress = $('#client_address_input').val();
    const emailadd = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (clientEmail === '') {
        swal("Enter Emailid");
        return false;
    } else if (!(emailadd.test(clientEmail))) {
        swal("Enter Valid Email Id");
        return false;
    } else {
        const details = {
            'clientHiddenUniqueCode': clientHiddenUniqueCode,
            'clientEmail': clientEmail,
            'clientName': clientName,
            'clientMobile': clientMobile,
            'clientState': clientState,
            'clientAddress': clientAddress
        };
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        $.ajax({
            type: 'POST',
            url: '/superadmin/save_client_details/',
            headers: {'X-CSRFToken': csrftoken},
            data: details,
            success: function (response) {
                if (response.result === 'created') {
                    swal(response.msg);
                    reload();
                } else if (response.result === 'updated') {
                    swal(response.msg);
                    reload();
                } else if (response.result === 'email_already_exists') {
                    swal(response.msg);
                } else if (response.result === 'failed') {
                    swal(response.msg);
                }
            }, error: function (error) {
                console.log('Error in saveClientDetails function ->', error);
            }
        })
    }
}

function fetchAllClientsForSuperadmin() {
    $.ajax({
        type: 'POST',
        url: '/superadmin/fetch_all_client/',
        async: false,
        success: function (response) {
            if (response.result === 'success') {
                $('#client_details_tab > tbody').empty();
                response.all_clients.forEach(function (client) {
                    let clientTableDetails = "<tr>" +
                        "<td>" + client.client_name + "</td>" +
                        "<td>" + client.client_email + "</td>" +
                        "<td>" + client.client_mobile + "</td>" +
                        "<td>" + client.client_state + "</td>" +
                        "<td>" + client.client_address + "</td>" +
                        "<td>" + client.client_status + "</td>";
                    if (client.agent_id__agent_name === null) {
                        clientTableDetails += "<td></td>";
                    } else {
                        clientTableDetails += "<td>" + client.agent_id__agent_name + "</td>";
                    }
                    clientTableDetails += "<td>" + client.checked_time.split('.')[0] + "</td>";
                    clientTableDetails += "<td>" + "<button id='" + client.client_id + "' class='btn btn-info btn-sm edit-client-details'>Edit</button><button id='" + client.client_id + "' class='btn btn-sm delete-client-details btn-danger'>Delete</button>" + "</td>";
                    clientTableDetails += "</tr>";
                    $('#client_details_tab > tbody').append(clientTableDetails);
                });
                $('#client_details_tab').DataTable({
                    'destroy': true,
                    "ordering": false,
                    'searching': true,
                    'retrieve': true,
                });
                $('.dataTables_length').addClass('bs-select');

                $('.edit-client-details').click(function () {
                    const id = $(this).attr('id');
                    fetchClientDetailsById(id);
                    $('#create_update_client_modal').modal('show');
                });

                $('.delete-client-details').click(function () {
                    const id = $(this).attr('id');
                    deleteClientDetailsById(id);
                });
            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log('Error in fetchAllAdminForSuperadmin function -->', error);
        }
    })
}

function fetchClientDetailsById(id) {
    $.ajax({
        type: 'POST',
        url: '/fetch_client_details_by_id/',
        data: {'id': id},
        success: function (response) {
            if (response.result === 'success') {
                const details = response.client_details[0];
                $('#clientHiddenCode').val(details.client_usercode);
                $('#client_email_input').val(details.client_email);
                $('#client_name_input').val(details.client_name);
                $('#client_mobile_input').val(details.client_mobile);
                $('#client_state_input').val(details.client_state);
                $('#client_address_input').val(details.client_address);
            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log("Error in fetchClientDetailsById function --->", error);
        }
    })
}

function deleteClientDetailsById(id) {
    $.ajax({
        type: 'POST',
        url: '/delete_client_details_by_id/',
        data: {'id': id},
        success: function (response) {
            if (response.result === 'deleted') {
                fetchAllClientsForSuperadmin();
                swal(response.msg);
            } else if (response.result === 'failed') {
                fetchAllClientsForSuperadmin();
                swal(response.msg);
            }
        }, error: function (error) {
            console.log('Error in deleteAdminDetailsById function --->', error);
        },
    })
}

function updateClientStatus() {
    $.ajax({
        type: 'POST',
        url: '/update_client_status/',
        async: true,
        success: function (response) {
            if (response.result === 'success') {

            } else if (response.result === 'failed') {
                swal(response.msg)
            }
        }, error: function (error) {
            console.log("Error in updateClientStatus function -->", error);
        }
    })
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

function reload() {
    setTimeout((function () {
        window.location.reload();
    }), 2000);
}