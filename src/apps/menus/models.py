from django.db import models

class Menu(models.Model):
    menu_title = models.CharField(max_length=50, unique=True)
    menu_url = models.CharField(max_length=200)
    menu_deep = models.IntegerField()
    menu_order = models.IntegerField()
    is_use = models.IntegerField(default=1)
    is_show = models.IntegerField(default=1)
    is_newtab = models.IntegerField()
    reg_date = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tb_admin2_menu'