from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product, Brand, CartItem, Address, Order, OrderItem, ProductSize
from .serializers import ProductSerializer, BrandSerializer, CartItemSerializer, AddressSerializer, OrderSerializer
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, RegisterSerializer
from rest_framework.permissions import IsAuthenticated

class RegisterView(APIView):
    permission_classes = []
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=201)

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.prefetch_related("sizes","brand").all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    def get_queryset(self):
        qs = super().get_queryset()
        brand = self.request.query_params.get('brand')
        size = self.request.query_params.get('size')
        q = self.request.query_params.get('q')
        if brand:
            qs = qs.filter(brand__name__icontains=brand)
        if q:
            qs = qs.filter(name__icontains=q)
        if size:
            qs = qs.filter(sizes__size=size).distinct()
        return qs

class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [permissions.AllowAny]

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user).select_related("product")
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        item = serializer.save()
        return Response(self.get_serializer(item).data, status=status.HTTP_201_CREATED)
    @action(detail=False, methods=["delete"])
    def clear(self, request):
        CartItem.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")
    def create(self, request, *args, **kwargs):
        user = request.user
        cart_items = CartItem.objects.filter(user=user)
        if not cart_items.exists():
            return Response({"detail":"Cart empty"}, status=400)
        address_id = request.data.get("address_id")
        address = get_object_or_404(Address, id=address_id, user=user)
        total = sum([item.product.price * item.quantity for item in cart_items])
        order = Order.objects.create(user=user, address=address, total_amount=total)
        for item in cart_items:
            OrderItem.objects.create(order=order, product=item.product, size=item.size, quantity=item.quantity, price=item.product.price)
            # reduce stock
            ps = ProductSize.objects.filter(product=item.product, size=item.size).first()
            if ps:
                ps.stock = max(0, ps.stock - item.quantity)
                ps.save()
        cart_items.delete()
        # TODO: integrate payment and set payment_status
        return Response(OrderSerializer(order).data, status=201)

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
