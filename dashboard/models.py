from django.db import models
import datetime
from django.contrib.auth.models import User

class users(models.Model):
    first_name = models.CharField(max_length = 30)
    last_name = models.CharField(max_length = 30)
    email = models.CharField(max_length = 30)
    user_name = models.CharField(max_length = 10)
    password = models.CharField(max_length = 10)
    dob = models.DateField(null=True, blank = True)

    def __str__(self):
        return f'{self.first_name}{self.last_name}'
    

class PDFUpload(models.Model):
    file = models.FileField(upload_to='pdfs/')  # Field to upload PDF files
    uploaded_at = models.DateTimeField(auto_now_add=True)  # Optional: timestamp for when the PDF is uploaded

    def __str__(self):
        return self.file.name  # Return the file name for easier identification
