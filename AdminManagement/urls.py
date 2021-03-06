"""AdminManagement URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from management_app import views

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('', views.loginHtml, name='loginHtml'),
    path('login_operation/', views.login_operation, name='login_operation'),
    path('logout/', views.logout, name='logout'),
    path('superadmin_dashboard/', views.superadmin_dashboard, name='superadmin_dashboard'),
    path('kycadmin_dashboard/', views.kycadmin_dashboard, name='kycadmin_dashboard'),
    path('agent_dashboard/', views.agent_dashboard, name='agent_dashboard'),
    path('superadmin/save_admin_details/', views.save_admin_details, name='save_admin_details'),
    path('superadmin/save_client_details/', views.save_client_details, name='save_client_details'),

    path('superadmin/save_agent_details_by_superadmin/', views.save_agent_details_by_superadmin,
         name='save_agent_details_by_superadmin'),
    path('superadmin/fetch_all_admins_under_for_superadmin/',
         views.fetch_all_admins_under_for_superadmin, name='fetch_all_admins_under_for_superadmin'),
    path('superadmin/fetch_all_client/',
         views.fetch_all_client, name='fetch_all_client'),
    path('superadmin/fetch_all_agents_under_for_superadmin/',
         views.fetch_all_agents_under_for_superadmin, name='fetch_all_agents_under_for_superadmin'),
    path('admin/save_agent_details_by_kycadmin/', views.save_agent_details_by_kycadmin,
         name='save_agent_details_by_kycadmin'),
    path('admin/fetch_all_agents_under_admin/', views.fetch_all_agents_under_admin,
         name='fetch_all_agents_under_admin'),

    path('fetch_admin_details_by_id/', views.fetch_admin_details_by_id, name='fetch_admin_details_by_id'),
    path('fetch_client_details_by_id/', views.fetch_client_details_by_id, name='fetch_client_details_by_id'),
    path('fetch_agent_details_by_id/', views.fetch_agent_details_by_id, name='fetch_agent_details_by_id'),

    path('delete_admin_details_by_id/', views.delete_admin_details_by_id, name='delete_admin_details_by_id'),
    path('delete_agent_details_by_id/', views.delete_agent_details_by_id, name='delete_agent_details_by_id'),
    path('delete_client_details_by_id/', views.delete_client_details_by_id, name='delete_client_details_by_id'),
    path('update_client_status/', views.update_client_status,
         name='update_client_status'),
    path('check_client_by_agent/', views.check_client_by_agent, name='check_client_by_agent'),
    path('fetch_checked_form_details/', views.fetch_checked_form_details, name='fetch_checked_form_details'),
]
