from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated

from .models import Product, Brand, CartItem, Address, Order, OrderItem, ProductSize
from .serializers import (
    ProductSerializer, BrandSerializer, CartItemSerializer,
    AddressSerializer, OrderSerializer, UserSerializer, RegisterSerializer
)
from rest_framework.views import APIView


# ------------------ REGISTER ------------------

class RegisterView(APIView):
    permission_classes = []
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=201)


# ------------------ PRODUCTS ------------------

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.prefetch_related("sizes", "brand").all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]


# ------------------ BRANDS ------------------

class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [permissions.AllowAny]


# ------------------ CART ------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get("product_id")
    size = request.data.get("size")
    quantity = int(request.data.get("quantity", 1))

    product = get_object_or_404(Product, id=product_id)

    cart_item, created = CartItem.objects.get_or_create(
        user=request.user,
        product=product,
        size=size,
        defaults={"quantity": quantity},
    )

    if not created:
        cart_item.quantity += quantity
        cart_item.save()

    return Response(CartItemSerializer(cart_item).data)


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user).select_related("product")

    @action(detail=False, methods=["delete"])
    def clear(self, request):
        CartItem.objects.filter(user=request.user).delete()
        return Response(status=204)


# ------------------ ORDERS ------------------

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")

    def create(self, request, *args, **kwargs):
        user = request.user
        cart_items = CartItem.objects.filter(user=user)

        if not cart_items.exists():
            return Response({"detail": "Cart empty"}, status=400)

        address_id = request.data.get("address_id")
        address = get_object_or_404(Address, id=address_id, user=user)

        total = sum([item.product.price * item.quantity for item in cart_items])
        order = Order.objects.create(user=user, address=address, total_amount=total)

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                size=item.size,
                quantity=item.quantity,
                price=item.product.price
            )

            ps = ProductSize.objects.filter(product=item.product, size=item.size).first()
            if ps:
                ps.stock = max(ps.stock - item.quantity, 0)
                ps.save()

        cart_items.delete()
        return Response(OrderSerializer(order).data, status=201)


# ------------------ ADDRESSES ------------------

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
