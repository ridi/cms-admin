from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

from django.contrib.auth.models import AbstractUser

#class TbAdmin2Tag(models.Model):
class Tag(models.Model):
    name = models.CharField(unique=True, max_length=32)
    display_name = models.CharField(max_length=32)
    is_use = models.IntegerField()
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.PROTECT)
    reg_date = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'tb_admin2_tag'
