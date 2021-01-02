import re
from django.shortcuts import render
from django.http import JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from management_app import models
from management_app.utils import *


# Create your views here.
def loginHtml(request):
    return render(request, 'login.html')


@csrf_exempt
def login_operation(request):
    try:
        useremail = request.POST.get('useremail')
        password = request.POST.get('password')
        u_name = re.search(r'\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b', useremail, re.I)
        if u_name:
            try:
                validate_user = models.AuthUsers.objects.get(useremail=useremail,
                                                             password=encrypt_password(password),
                                                             status__iexact='active')
                if validate_user is not None:
                    request.session['usercode'] = validate_user.user_code
                    response_msg = {"result": "success", 'u_type': validate_user.role_id.role_code,
                                    'u_code': validate_user.user_code}
                    print(response_msg)
                else:
                    response_msg = {"result": "failed", "msg": "Invalid User credentials"}
            except models.AuthUsers.DoesNotExist:
                response_msg = {"result": "failed", "msg": "Invalid User credentials"}
            return JsonResponse(response_msg)
        else:
            return JsonResponse({"result": "Invalid", "msg": "Invalid Username."})
    except Exception as e:
        print("Exception in login_operation views.py-->", e)
        return JsonResponse({"result": "error", "msg": "Opps!, Server error while login"})


def logout(request):
    try:
        # Remove the authenticated user's ID from the request and flush their session data.Add details to UserLogs table.
        if 'usercode' in request.session:
            user_code = request.session['usercode']
            print('LOGOUT - ---- > ', user_code)
            request.session.flush()
        return HttpResponseRedirect('/')
    except Exception as e:
        print('Exception in logout --> ', e)
        request.session.flush()
        return HttpResponseRedirect('/')


def superadmin_dashboard(request):
    print('request-->', request)
    try:
        if 'usercode' in request.session:
            user_code = request.session['usercode']
            print('user_code-->', user_code)
            user_details = list(
                models.AuthUsers.objects.filter(user_code=user_code).values('name', 'useremail'))
            return render(request, 'superadmin_dashboard.html',
                          {'user_code': user_code, 'details': user_details, 'type': 'SUPERADMIN'})
    except Exception as e:
        print('Exception in rendering superadmin_dashboard --> ', e)
        request.session.flush()
        return HttpResponseRedirect('/')


def kycadmin_dashboard(request):
    try:
        if 'usercode' in request.session:
            user_code = request.session['usercode']
            user_details = list(
                models.AuthUsers.objects.filter(user_code=user_code).values('name', 'useremail'))
            return render(request, 'kycadmin_dashboard.html',
                          {'user_code': user_code, 'details': user_details, 'type': 'KYCADMIN'})
    except Exception as e:
        print('Exception in rendering superadmin_dashboard --> ', e)
        request.session.flush()
        return HttpResponseRedirect('/')


def agent_dashboard(request):
    try:
        if 'usercode' in request.session:
            user_code = request.session['usercode']
            user_details = list(
                models.AuthUsers.objects.filter(user_code=user_code).values('name', 'useremail'))
            return render(request, 'agent_dashboard.html',
                          {'user_code': user_code, 'details': user_details, 'type': 'AGENT'})
    except Exception as e:
        print('Exception in rendering superadmin_dashboard --> ', e)
        request.session.flush()
        return HttpResponseRedirect('/')


@csrf_exempt
def save_admin_details(request):
    try:
        if 'usercode' in request.session:
            if request.method == 'POST':
                adminHiddenUniqueCode = request.POST['adminHiddenUniqueCode']
                adminEmail = request.POST['adminEmail']
                adminName = request.POST['adminName']
                adminMobile = request.POST['adminMobile']
                adminState = request.POST['adminState']
                adminAddress = request.POST['adminAddress']

                if adminHiddenUniqueCode == '':
                    chek_email_exist = models.AuthUsers.objects.filter(username=adminEmail).exists()
                    if chek_email_exist is False:
                        unique_usercode = getUniqueUserCode()
                        create_admin = models.KycAdmin.objects.create(kycadmin_usercode=unique_usercode,
                                                                      kycadmin_name=adminName,
                                                                      kycadmin_email=adminEmail,
                                                                      kycadmin_mobile=adminMobile,
                                                                      kycadmin_address=adminAddress,
                                                                      kycadmin_state=adminState,
                                                                      )
                        if create_admin is not None:
                            try:
                                pwd = random_pwd_generate()
                                models.AuthUsers.objects.create(user_code=unique_usercode, name=adminName,
                                                                password=encrypt_password(pwd),
                                                                role_id=models.Role.objects.get(role_code='KYCADMIN'),
                                                                user_email=adminEmail,
                                                                )
                                return JsonResponse({'result': 'created',
                                                     'msg': 'New Admin Added Successfully\nPassword has been sent to the respective email id to access the account'})
                            except Exception as e:
                                print('Exception in new admin creation -->', e)
                                models.KycAdmin.objects.filter(agent_usercode=unique_usercode).delete()
                                return JsonResponse({'result': 'failed', 'msg': 'Failed to save details! Try again'})
                    elif chek_email_exist is True:
                        return JsonResponse({'result': 'email_already_exits',
                                             'msg': 'We have already an account with this email id! Try another email id'})
                else:
                    models.KycAdmin.objects.filter(kycadmin_usercode=adminHiddenUniqueCode).update(
                        agent_name=adminName,
                        agent_mobile=adminMobile,
                        agent_address=adminAddress,
                        agent_state=adminState,
                    )
                    return JsonResponse({'result': 'updated', 'msg': 'Details updated successfully'})
    except Exception as e:
        print('Exception in save_admin_details /management_app/views.py -->', e)
        return JsonResponse({'result': 'failed', 'msg': 'Failed to save details! Try again'})


@csrf_exempt
def save_agent_details_by_superadmin(request):
    try:
        if 'usercode' in request.session:
            if request.method == 'POST':
                agentHiddenUniqueCode = request.POST['agentHiddenUniqueCode']
                selectAdminForAgent = request.POST['selectAdminForAgent']
                agentEmail = request.POST['agentEmail']
                agentName = request.POST['agentName']
                agentMobile = request.POST['agentMobile']
                agentState = request.POST['agentState']
                agentAddress = request.POST['agentAddress']

                if agentHiddenUniqueCode == '':
                    chek_email_exist = models.AuthUsers.objects.filter(username=agentEmail).exists()
                    if chek_email_exist is False:
                        unique_usercode = getUniqueUserCode()
                        kycadmin_id = models.KycAdmin.objects.get(kycadmin_usercode=selectAdminForAgent)
                        create_agent = models.Agent.objects.create(agent_usercode=unique_usercode,
                                                                   agent_name=agentName,
                                                                   agent_email=agentEmail,
                                                                   agent_mobile=agentMobile,
                                                                   agent_address=agentAddress,
                                                                   agent_state=agentState,
                                                                   admin_id=models.KycAdmin.objects.get(
                                                                       admin_id=kycadmin_id.admin_id)
                                                                   )
                        if create_agent is not None:
                            try:
                                pwd = random_pwd_generate()
                                models.AuthUsers.objects.create(user_code=unique_usercode, name=agentName,
                                                                password=encrypt_password(pwd),
                                                                role_id=models.Role.objects.get(role_code='AGENT'),
                                                                user_email=agentEmail,
                                                                )
                                return JsonResponse({'result': 'created',
                                                     'msg': 'New Agent Added Successfully\nPassword has been sent to the respective email id to access the account'})
                            except Exception as e:
                                print('Exception in new admin creation -->', e)
                                models.Agent.objects.filter(agent_usercode=unique_usercode).delete()
                                return JsonResponse({'result': 'failed', 'msg': 'Failed to save details! Try again'})
                    elif chek_email_exist is True:
                        return JsonResponse({'result': 'email_already_exits',
                                             'msg': 'We have already an account with this email id! Try another email id'})
                else:
                    models.Agent.objects.filter(agent_usercode=agentHiddenUniqueCode).update(
                        agent_name=agentName,
                        agent_mobile=agentMobile,
                        agent_address=agentAddress,
                        agent_state=agentState,
                    )
                    return JsonResponse({'result': 'updated', 'msg': 'Details updated successfully'})
    except Exception as e:
        print('Exception in save_agent_details_by_kycadmin /management_app/views.py -->', e)
        return JsonResponse({'result': 'failed', 'msg': 'Failed to save details! Try again'})


@csrf_exempt
def save_agent_details_by_kycadmin(request):
    try:
        if 'usercode' in request.session:
            usercode = request.session['usercode']

            if request.method == 'POST':
                agentHiddenUniqueCode = request.POST['agentHiddenUniqueCode']
                agentEmail = request.POST['agentEmail']
                agentName = request.POST['agentName']
                agentMobile = request.POST['agentMobile']
                agentState = request.POST['agentState']
                agentAddress = request.POST['agentAddress']

                if agentHiddenUniqueCode == '':
                    chek_email_exist = models.AuthUsers.objects.filter(username=agentEmail).exists()
                    if chek_email_exist is False:
                        unique_usercode = getUniqueUserCode()
                        kycadmin_id = models.KycAdmin.objects.get(kycadmin_usercode=usercode)
                        create_agent = models.Agent.objects.create(agent_usercode=unique_usercode,
                                                                   agent_name=agentName,
                                                                   agent_email=agentEmail,
                                                                   agent_mobile=agentMobile,
                                                                   agent_address=agentAddress,
                                                                   agent_state=agentState,
                                                                   admin_id=models.KycAdmin.objects.get(
                                                                       admin_id=kycadmin_id.admin_id)
                                                                   )
                        if create_agent is not None:
                            try:
                                pwd = random_pwd_generate()
                                models.AuthUsers.objects.create(user_code=unique_usercode, name=agentName,
                                                                password=encrypt_password(pwd),
                                                                role_id=models.Role.objects.get(role_code='AGENT'),
                                                                user_email=agentEmail,
                                                                )
                                return JsonResponse({'result': 'created',
                                                     'msg': 'New Agent Added Successfully\nPassword has been sent to the respective email id to access the account'})
                            except Exception as e:
                                print('Exception in new admin creation -->', e)
                                models.Agent.objects.filter(agent_usercode=unique_usercode).delete()
                                return JsonResponse({'result': 'failed', 'msg': 'Failed to save details! Try again'})
                    elif chek_email_exist is True:
                        return JsonResponse({'result': 'email_already_exits',
                                             'msg': 'We have already an account with this email id! Try another email id'})
                else:
                    models.Agent.objects.filter(agent_usercode=agentHiddenUniqueCode).update(
                        agent_name=agentName,
                        agent_mobile=agentMobile,
                        agent_address=agentAddress,
                        agent_state=agentState,
                    )
                    return JsonResponse({'result': 'updated', 'msg': 'Details updated successfully'})
    except Exception as e:
        print('Exception in save_agent_details_by_kycadmin /management_app/views.py -->', e)
        return JsonResponse({'result': 'failed', 'msg': 'Failed to save details! Try again'})


@csrf_exempt
def fetch_all_agents_under_admin(request):
    try:
        if 'usercode' in request.session:
            user_code = request.session['usercode']

            if request.method == 'POST':
                kycadmin_id = models.KycAdmin.objects.get(kycadmin_usercode=user_code)
                agents_under_admin = list(
                    models.Agent.objects.values('agent_id', 'agent_name', 'agent_email', 'agent_mobile',
                                                'agent_address', 'agent_state').
                        filter(admin_id=models.KycAdmin.objects.get(admin_id=kycadmin_id.admin_id)).
                        order_by('-created_time'))

                return JsonResponse({'result': 'success', 'agents_under_admin': agents_under_admin})
    except Exception as e:
        print('Exception in fetch_all_agents_under_admin  /management_app/views.py  -->', e)
        return JsonResponse({"result": "failed", 'msg': 'Failed to load agents! Refresh the Page'})


@csrf_exempt
def fetch_all_agents_and_admins_under_for_superadmin(request):
    try:
        if 'usercode' in request.session:
            if request.method == 'POST':
                all_agents = list(
                    models.Agent.objects.all().values('agent_id', 'agent_name', 'agent_email', 'agent_mobile',
                                                      'agent_address', 'agent_state').
                        order_by('-created_time'))
                all_admins = list(
                    models.KycAdmin.objects.all().values('admin_id', 'kycadmin_name', 'kycadmin_usercode',
                                                         'kycadmin_email',
                                                         'kycadmin_mobile', 'kycadmin_address', 'kycadmin_state').
                        order_by('-created_time'))

                return JsonResponse({'result': 'success', 'all_agents': all_agents, 'all_admins': all_admins})
    except Exception as e:
        print('Exception in fetch_all_agents_under_admin  /management_app/views.py  -->', e)
        return JsonResponse({"result": "failed", 'msg': 'Failed to load agents! Refresh the Page'})
