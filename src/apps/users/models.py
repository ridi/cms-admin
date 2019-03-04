from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    id = models.CharField(primary_key=True, max_length=32)
    #passwd = models.CharField(max_length=128)
    password = models.CharField(max_length=128)
    email = models.CharField(max_length=128)
    name = models.CharField(max_length=32)
    team = models.CharField(max_length=32)
    is_use = models.IntegerField(default=1)
    reg_date = models.DateTimeField(auto_now_add=True)

    REQUIRED_FIELDS = ['password']
    USERNAME_FIELD = 'id'
    class Meta:
        db_table = 'tb_admin2_user'