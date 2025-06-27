from django.db import models
from django.contrib.auth.models import User

from prompt_posts.models import Prompt


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    prompt = models.ForeignKey(Prompt, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Like"
        verbose_name_plural = "Likes"
        db_table_comment = "Table for storing user's liked prompts"

        constraints = [
                models.UniqueConstraint(fields=["user", "prompt"], name="unique_like")
        ]

