from django.urls import path, include
from rest_framework.routers import DefaultRouter # type: ignore
from .views import ProductViewSet, BrandViewSet, CartViewSet, AddressViewSet, OrderViewSet, RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register("products", ProductViewSet, basename="products")
router.register("brands", BrandViewSet, basename="brands")
router.register("cart", CartViewSet, basename="cart")
router.register("addresses", AddressViewSet, basename="addresses")
router.register("orders", OrderViewSet, basename="orders")

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", include(router.urls)),
]
