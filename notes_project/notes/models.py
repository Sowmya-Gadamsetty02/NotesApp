from django.db import models

# Create your models here.
class Note(models.Model):
    title= models.CharField(max_length=255)
    content= models.TextField()
    tags=models.CharField(max_length=255,blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
 
    def __str__(self):
        return self.title
        