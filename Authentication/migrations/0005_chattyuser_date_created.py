# Generated by Django 3.2.4 on 2021-06-19 02:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Authentication', '0004_auto_20210618_1435'),
    ]

    operations = [
        migrations.AddField(
            model_name='chattyuser',
            name='date_created',
            field=models.BigIntegerField(default=1624068277083),
            preserve_default=False,
        ),
    ]
