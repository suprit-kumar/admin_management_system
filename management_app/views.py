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
            print('user_code-->',user_code)
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
