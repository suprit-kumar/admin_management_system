# Generated by Django 2.2.2 on 2020-12-31 06:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('management_app', '0003_auto_20201231_1150'),
    ]

    operations = [
        migrations.AlterField(
            model_name='agent',
            name='admin_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='management_app.KycAdmin'),
        ),
    ]
