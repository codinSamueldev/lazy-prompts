from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User

from cloudinary.models import CloudinaryField

from datetime import datetime

class Topic(models.Model):
    name:str = models.CharField(max_length=255)
    slug:str = models.SlugField(unique=True, blank=True, null=True)
    description:str = models.TextField()
    created_at:datetime = models.DateTimeField(auto_now_add=True)
    updated_at:datetime = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Topic"
        verbose_name_plural = "Topics"
        ordering = ["-created_at"]
        db_table_comment = "Table for storing topics with their details, including name and description."


class Prompt(models.Model):
    title:str = models.CharField(max_length=255)
    slug:str = models.SlugField(unique=True, blank=True, null=True)
    description:str = models.CharField(max_length=500, blank=True, null=True)
    content:str = models.TextField()
    author:str = models.ForeignKey(User, on_delete=models.CASCADE)
    topic:str = models.ForeignKey(Topic, on_delete=models.CASCADE)
    image:CloudinaryField = CloudinaryField("prompt_image", blank=True, null=True)
    view_count:int = models.IntegerField(default=0)
    copy_count:int = models.IntegerField(default=0)
    created_at:datetime = models.DateTimeField(auto_now_add=True)
    updated_at:datetime = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Prompt"
        verbose_name_plural = "Prompts"
        ordering = ["-created_at"]
        db_table_comment = "Table for storing prompts with their details, including author, topic, and image."

        indexes = [
            models.Index(fields=['content'], name='prompt_content_idx'),
            models.Index(fields=['author'], name='prompt_author_idx'),
            models.Index(fields=['topic'], name='prompt_topic_idx'),
        ]
