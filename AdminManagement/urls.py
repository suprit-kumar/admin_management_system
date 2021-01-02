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
    path('admin/save_agent_details_by_kycadmin/', views.save_agent_details_by_kycadmin, name='save_agent_details_by_kycadmin'),
    path('admin/fetch_all_agents_under_admin/', views.fetch_all_agents_under_admin, name='fetch_all_agents_under_admin'),
]
