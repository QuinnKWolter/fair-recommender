from django.urls import path 
from data import views

app_name = 'data'
urlpatterns = [
    path('loadData/',
        view=views.LoadData.as_view(),
        name='load_data'
    ),
]