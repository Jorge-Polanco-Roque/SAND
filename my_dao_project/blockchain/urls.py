from django.urls import path
from . import views

urlpatterns = [
    path('check_connection/', views.check_connection, name='check_connection'),
    path('dao_info/', views.get_dao_info, name='get_dao_info'),
    path('proposals/', views.get_all_proposals, name='get_all_proposals'),
    path('proposal/<int:proposal_index>/', views.get_proposal, name='get_proposal'),
    path('voting_params/', views.get_voting_params, name='get_voting_params'),
    path('', views.home, name='home'),  # Home page of the blockchain app
]
