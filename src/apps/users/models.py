from django.db import models


class User(models.Model):
    id = models.CharField(primary_key=True, max_length=32)
    passwd = models.CharField(max_length=128)
    email = models.CharField(max_length=128)
    name = models.CharField(max_length=32)
    team = models.CharField(max_length=32)
    is_use = models.IntegerField(default=1)
    reg_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tb_admin2_user'