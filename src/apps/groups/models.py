from django.db import models
from django.conf import settings


class Group(models.Model):
    name = models.CharField(unique=True, max_length=32)
    is_use = models.IntegerField(default=1)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tb_admin2_group'