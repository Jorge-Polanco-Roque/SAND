# from django.contrib import admin
# from django.urls import path, include

# urlpatterns = [
#     path("admin/", admin.site.urls),
#     path('blockchain/', include('blockchain.urls')),

# ]

from django.contrib import admin
from django.urls import path, include
from blockchain import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('blockchain/', include('blockchain.urls')),
    path('', views.home, name='home'),  # Add this line for the root path
]
