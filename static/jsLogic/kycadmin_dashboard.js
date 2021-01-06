$(document).ready(function () {
    updateClientStatus();
    fetchAllAgentsUnderAdmin();
    fetchAllClientsForAdmin();

    $('#save_agent_details').click(function () {
        saveAgentDetails();
    });
    $("#save_client_details_btn").click(function () {
        saveClientDetails();
    });
});


function saveAgentDetails() {
    const agentHiddenUniqueCode = $('#agentHiddenId').val();
    const agentEmail = $('#agent_email').val();
    const agentName = $('#agent_name').val();
    const agentMobile = $('#agent_mobile').val();
    const agentState = $('#agent_state').val();
    const agentAddress = $('#agent_address').val();
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
            'agentEmail': agentEmail,
            'agentName': agentName,
            'agentMobile': agentMobile,
            'agentState': agentState,
            'agentAddress': agentAddress
        };
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        $.ajax({
            type: 'POST',
            url: '/admin/save_agent_details_by_kycadmin/',
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
                console.log('Error in saveAgentDetails function ->', error);
            }
        })
    }
}


function fetchAllAgentsUnderAdmin() {
    $.ajax({
        type: 'POST',
        url: '/admin/fetch_all_agents_under_admin/',
        async: false,
        success: function (response) {
            if (response.result === 'success') {
                $('#agent_details_tab > tbody').empty();
                response.agents_under_admin.forEach(function (agent) {
                    let tableDetails = "<tr>" +
                        "<td>" + agent.agent_name + "</td>" +
                        "<td>" + agent.agent_email + "</td>" +
                        "<td>" + agent.agent_mobile + "</td>" +
                        "<td>" + agent.agent_state + "</td>" +
                        "<td>" + agent.agent_address + "</td>" +
                        "<td>" + "<button id='" + agent.agent_id + "' class='btn btn-info btn-sm edit-agent-details'>Edit</button>" + "</td>" +
                        "<td>" + "<button id='" + agent.agent_id + "' value='" + agent.agent_name + "' class='btn btn-info btn-sm btn-dark agent-form-check-details'>View</button>" + "</td>";

                    tableDetails += "</tr>";
                    $('#agent_details_tab > tbody').append(tableDetails);
                });

                $('#agent_details_tab').DataTable({
                    'destroy': true,
                    "ordering": false,
                    'searching': true,
                    'retrieve': true,
                });
                $('.dataTables_length').addClass('bs-select');

                $('#agentFormModal').on('hidden.bs.modal', function (e) {
                    $("#agentHiddenId,#agent_email,#agent_name,#agent_mobile,#agent_state,#agent_address").val('');
                });

                $('.edit-agent-details').click(function () {
                    const id = $(this).attr('id');
                    fetchAgentDetailsById(id);
                    $('#agentFormModal').modal('show');
                });

                $('.agent-form-check-details').click(function () {
                    const agentId = $(this).attr('id');
                    const agentName = $(this).attr('value');
                    fetchCheckedFormDetails(agentId, agentName);
                    $('#formCheckDetailsModal').modal('show');
                });


            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log('Error in fetchAgentsUnderAdmin function -->', error);
        }
    })
}

function fetchCheckedFormDetails(agentId, agentName) {
    $.ajax({
        type: 'POST',
        url: '/fetch_checked_form_details/',
        data: {'agentId': agentId},
        async: false,
        success: function (response) {
            if (response.result === 'success') {
                $('#form_checked_agent_name').text(agentName);
                $('#no_of_forms_checked').text(response.form_checked_count);
            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log("Error in fetchCheckedFormDetails function --->", error);
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
                $('#agentHiddenId').val(details.agent_usercode);
                $('#agent_email').val(details.agent_email);
                $('#agent_name').val(details.agent_name);
                $('#agent_mobile').val(details.agent_mobile);
                $('#agent_state').val(details.agent_state);
                $('#agent_address').val(details.agent_address);

            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log("Error in fetchAdminDetailsById function --->", error);
        }
    })
}

function fetchAllClientsForAdmin() {
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
                    clientTableDetails += "<td>" + "<button id='" + client.client_id + "' class='btn btn-info btn-sm edit-client-details'>Edit</button>" + "</td>";

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
                if (response.result === 'updated') {
                    swal(response.msg);
                    reload();
                } else if (response.result === 'failed') {
                    swal(response.msg);
                }
            }, error: function (error) {
                console.log('Error in saveClientDetails function ->', error);
            }
        })
    }
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

function reload() {
    setTimeout((function () {
        window.location.reload();
    }), 2000);
}
