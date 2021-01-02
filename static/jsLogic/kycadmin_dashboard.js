$(document).ready(function () {

    $('#save_agent_details').click(function () {
        saveAgentDetails();
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
    } else if (!(emailadd.test(clientEmail))) {
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
        $.ajax({
            type: 'POST',
            url: '/admin/save_agent_details_by_kycadmin/',
            data: details,
            success: function (response) {
                if (response.result === 'created') {
                    // fetchAgentsUnderAdmin();
                    swal(response.msg);
                }
                if (response.result === 'updated') {
                    // fetchAgentsUnderAdmin();
                    swal(response.msg);
                } else if (response.result === 'email_already_exits') {
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


function fetchAgentsUnderAdmin() {
    $.ajax({
        type: 'POST',
        url: '/admin/fetch_all_agents_under_admin/',
        success: function (response) {
            if (response.result === 'success') {
                $('#agent_details_table > tbody').empty();
                response.agents_under_admin.forEach(function (agent) {
                    let tableDetails = "<tr>" +
                        // "<td><div class='form-check'><input type='checkbox' class='form-check-input select_checkbox' name='select_checkbox' id='" + agent.client_id + "'></div></td>" +
                        "<td>" + agent.agent_name + "</td>" +
                        "<td>" + agent.agent_email + "</td>" +
                        "<td>" + agent.agent_mobile + "</td>" +
                        "<td>" + agent.agent_state + "</td>" +
                        "<td>" + agent.agent_address + "</td>" +
                        "<td>" + "<button id='" + agent.agent_id + "' class='btn btn-info btn-sm edit-client'>Edit</button><button id='" + agent.agent_id + "' class='btn btn-sm  change-client-status'>Delete</button>" + "</td>";

                    tableDetails += "</tr>";
                    $('#agent_details_table > tbody').append(tableDetails);
                });

                $('#agent_details_table').DataTable({
                    'destroy': true,
                    "ordering": false,
                    'searching': true,
                    'retrieve': true,
                });
                $('.dataTables_length').addClass('bs-select');

                $('#agentFormModal').on('hidden.bs.modal', function (e) {
                    $("#agentHiddenId,#agent_email,#agent_name,#agent_mobile,#agent_state,#agent_address").val('');
                });

            } else if (response.result === 'failed') {
                swal(response.msg);
            }
        }, error: function (error) {
            console.log('Error in fetchAgentsUnderAdmin function -->', error);
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