from django.db import models

#class TbAdmin2Tag(models.Model):
class Tags(models.Model):
    name = models.CharField(unique=True, max_length=32)
    display_name = models.CharField(max_length=32)
    is_use = models.IntegerField()
    creator = models.CharField(max_length=32)
    reg_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'tb_admin2_tag'
