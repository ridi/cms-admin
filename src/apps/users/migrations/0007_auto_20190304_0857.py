# Generated by Django 2.1.2 on 2019-03-04 08:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_auto_20190304_0853'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='reg_date',
            field=models.DateTimeField(),
        ),
    ]
