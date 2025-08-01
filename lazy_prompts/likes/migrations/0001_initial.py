# Generated by Django 5.2 on 2025-06-27 17:53

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('prompt_posts', '0004_alter_prompt_table_comment_alter_topic_table_comment_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('prompt', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='prompt_posts.prompt')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Like',
                'verbose_name_plural': 'Likes',
                'db_table_comment': "Table for storing user's liked prompts",
                'constraints': [models.UniqueConstraint(fields=('user', 'prompt'), name='unique_like')],
            },
        ),
    ]
