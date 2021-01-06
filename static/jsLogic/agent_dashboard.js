$(document).ready(function () {
    fetchAllClientsForAgent();
});

function fetchAllClientsForAgent() {
    $.ajax({
        type: 'POST',
        url: '/superadmin/fetch_all_client/',
        async: false,
        success: function (response) {
            if (response.result === 'success') {
                $('#client_details_tab > tbody').empty();
                response.all_clients.forEach(function (client) {
                    console.log(client.check_uncheck_status);
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
                    if (client.check_uncheck_status === false) {
                        clientTableDetails += "<td>" + "<button id='" + client.client_id + "' class='btn btn-warning check-client btn-sm'>Check</button>" + "</td>";
                    } else {
                        clientTableDetails += "<td>" + "<button class='btn btn-success btn-sm'>Checked</button>" + "</td>";
                    }
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

                $('.check-client').click(function () {
                    const clientId = $(this).attr('id');
                    checkClientByAgent(clientId);
                });

            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log('Error in fetchAllAdminForSuperadmin function -->', error);
        }
    })
}


function checkClientByAgent(clientId) {
    $.ajax({
        type: 'POST',
        url: '/check_client_by_agent/',
        data: {'clientId': clientId},
        async: false,
        success: function (response) {
            if (response.result === 'success') {
                fetchAllClientsForAgent();
            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log("Error in checkClientByAgent function --->", error);
        }
    })
}


