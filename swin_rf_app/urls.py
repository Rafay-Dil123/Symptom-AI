from django.urls import path
from .views import upload_input,welcome

urlpatterns = [
    path('upload/', upload_input),
    path('', welcome),
]