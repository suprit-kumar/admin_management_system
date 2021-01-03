from django.db import models


# Create your models here.
class Role(models.Model):
    role_id = models.AutoField(primary_key=True)
    role_name = models.CharField(max_length=50, null=True, default="")
    role_code = models.CharField(max_length=50, null=True, default="")
    role_status = models.CharField(max_length=50, null=True, default="")
    created_time = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        db_table = "role"

    def __unicode__(self):
        return u'%s' % [self.role_id]


class KycAdmin(models.Model):
    admin_id = models.AutoField(primary_key=True)
    kycadmin_name = models.CharField(max_length=100, null=True, default="")
    kycadmin_usercode = models.CharField(max_length=100, null=True, default="")
    kycadmin_email = models.CharField(max_length=100, null=True, default="")
    kycadmin_mobile = models.CharField(default='', null=True, max_length=10)
    kycadmin_address = models.CharField(max_length=250, null=True, default="")
    kycadmin_state = models.CharField(max_length=50, null=True, default="")
    kycadmin_status = models.CharField(max_length=50, null=True, default="active")
    created_time = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        db_table = "kyc_admin"

    def __unicode__(self):
        return u'%s' % [self.admin_id]


class Agent(models.Model):
    agent_id = models.AutoField(primary_key=True)
    agent_name = models.CharField(max_length=100, null=True, default="")
    agent_usercode = models.CharField(max_length=100, null=True, default="")
    agent_email = models.CharField(max_length=100, null=True, default="")
    agent_mobile = models.CharField(default='', null=True, max_length=10)
    agent_address = models.CharField(max_length=250, null=True, default="")
    agent_state = models.CharField(max_length=50, null=True, default="")
    admin_id = models.ForeignKey(KycAdmin, on_delete=models.CASCADE)
    agent_status = models.CharField(max_length=50, null=True, default="active")
    created_time = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        db_table = "agent"

    def __unicode__(self):
        return u'%s' % [self.agent_id]


class AuthUsers(models.Model):
    u_id = models.AutoField(primary_key=True)
    user_code = models.CharField(max_length=50, null=True, default="")
    name = models.CharField(max_length=100, null=True, default="")
    useremail = models.CharField(max_length=100, null=True, default="")
    password = models.CharField(max_length=100, null=True, default="")
    role_id = models.ForeignKey(Role, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, null=True, default="active")
    user_created_time = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        db_table = "authenticated_users"

    def __unicode__(self):
        return u'%s' % [self.u_id]
