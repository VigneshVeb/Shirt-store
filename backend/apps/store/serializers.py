from rest_framework import serializers
from .models import User, Product, ProductSize, Brand, CartItem, Address, Order, OrderItem
from django.contrib.auth.password_validation import validate_password


# ------------------ USER ------------------

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ("username", "password", "email", "first_name", "last_name")

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", "")
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


# ------------------ PRODUCT ------------------

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = "__all__"


class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    sizes = ProductSizeSerializer(many=True, read_only=True)
    brand = BrandSerializer(read_only=True)

    class Meta:
        model = Product
        fields = "__all__"


# ------------------ CART ------------------

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Product.objects.all(),
        source="product"
    )

    class Meta:
        model = CartItem
        fields = ["id", "product", "product_id", "size", "quantity"]

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["user"] = user

        item, created = CartItem.objects.update_or_create(
            user=user,
            product=validated_data["product"],
            size=validated_data["size"],
            defaults={"quantity": validated_data["quantity"]}
        )
        return item


# ------------------ ADDRESS ------------------

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"
        read_only_fields = ("user",)


# ------------------ ORDERS ------------------

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = "__all__"
        read_only_fields = ("user", "status", "tracking_id", "created_at")
