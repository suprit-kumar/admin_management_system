# Generated by Django 2.2.2 on 2021-01-02 13:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management_app', '0004_auto_20201231_1150'),
    ]

    operations = [
        migrations.AddField(
            model_name='agent',
            name='agent_usercode',
            field=models.CharField(default='', max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='kycadmin',
            name='kycadmin_usercode',
            field=models.CharField(default='', max_length=100, null=True),
        ),
    ]
