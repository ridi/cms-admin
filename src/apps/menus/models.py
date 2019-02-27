from django.db import models


class TbAdmin2Menu(models.Model):
    menu_title = models.CharField(max_length=50)
    menu_url = models.CharField(max_length=200)
    menu_deep = models.IntegerField()
    menu_order = models.IntegerField()
    is_use = models.IntegerField()
    is_show = models.IntegerField()
    reg_date = models.DateTimeField()
    is_newtab = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'tb_admin2_menu'