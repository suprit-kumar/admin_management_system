# Generated by Django 2.2.2 on 2021-01-04 18:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('management_app', '0011_auto_20210104_2335'),
    ]

    operations = [
        migrations.AddField(
            model_name='clients',
            name='agent_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='management_app.Agent'),
        ),
    ]
