from django.db import models


class Group(models.Model):
    name = models.CharField(unique=True, max_length=32)
    is_use = models.IntegerField()
    creator = models.CharField(max_length=32)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'tb_admin2_group'