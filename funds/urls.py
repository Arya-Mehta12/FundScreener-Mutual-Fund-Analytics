from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FundViewSet,FundArticleViewSet

router = DefaultRouter()
router.register(r'funds', FundViewSet)
router.register(r'articles', FundArticleViewSet, basename='articles')

urlpatterns = [
    path('', include(router.urls)),
]
