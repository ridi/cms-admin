# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Phinxlog(models.Model):
    version = models.BigIntegerField(primary_key=True)
    migration_name = models.CharField(max_length=100, blank=True, null=True)
    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)
    breakpoint = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'phinxlog'


class TbAdmin2Group(models.Model):
    name = models.CharField(unique=True, max_length=32)
    is_use = models.IntegerField()
    creator = models.CharField(max_length=32)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_admin2_group'


class TbAdmin2GroupTag(models.Model):
    group = models.ForeignKey(TbAdmin2Group, models.DO_NOTHING)
    tag = models.ForeignKey('TbAdmin2Tag', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'tb_admin2_group_tag'


class TbAdmin2GroupUser(models.Model):
    group = models.ForeignKey(TbAdmin2Group, models.DO_NOTHING)
    user = models.ForeignKey('TbAdmin2User', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'tb_admin2_group_user'


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
        managed = False
        db_table = 'tb_admin2_menu'


class TbAdmin2MenuAjax(models.Model):
    menu = models.ForeignKey(TbAdmin2Menu, models.DO_NOTHING)
    ajax_url = models.CharField(max_length=200)

    class Meta:
        managed = False
        db_table = 'tb_admin2_menu_ajax'


class TbAdmin2Tag(models.Model):
    name = models.CharField(unique=True, max_length=32)
    display_name = models.CharField(max_length=32)
    is_use = models.IntegerField()
    creator = models.CharField(max_length=32)
    reg_date = models.DateTimeField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_admin2_tag'


class TbAdmin2TagMenu(models.Model):
    tag = models.ForeignKey(TbAdmin2Tag, models.DO_NOTHING)
    menu = models.ForeignKey(TbAdmin2Menu, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'tb_admin2_tag_menu'


class TbAdmin2User(models.Model):
    id = models.CharField(primary_key=True, max_length=32)
    passwd = models.CharField(max_length=128)
    email = models.CharField(max_length=128)
    name = models.CharField(max_length=32)
    team = models.CharField(max_length=32)
    is_use = models.IntegerField()
    reg_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'tb_admin2_user'


class TbAdmin2UserMenu(models.Model):
    user = models.ForeignKey(TbAdmin2User, models.DO_NOTHING)
    menu = models.ForeignKey(TbAdmin2Menu, models.DO_NOTHING)
    reg_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'tb_admin2_user_menu'


class TbAdmin2UserPermissionLog(models.Model):
    user_id = models.CharField(max_length=32)
    menu_ids = models.CharField(max_length=512)
    tag_ids = models.CharField(max_length=512)
    edited_by = models.CharField(max_length=32)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'tb_admin2_user_permission_log'


class TbAdmin2UserTag(models.Model):
    user = models.ForeignKey(TbAdmin2User, models.DO_NOTHING)
    tag = models.ForeignKey(TbAdmin2Tag, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'tb_admin2_user_tag'
