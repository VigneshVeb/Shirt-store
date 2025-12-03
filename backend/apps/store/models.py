from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True, null=True)

class Brand(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self): return self.name

class Product(models.Model):
    name = models.CharField(max_length=200)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name="products")
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    def __str__(self): return self.name

class ProductSize(models.Model):
    SIZE_CHOICES = [('XS','XS'),('S','S'),('M','M'),('L','L'),('XL','XL')]
    Brand=models.ForeignKey(Brand, on_delete=models.CASCADE, related_name="sizes", null=True)

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="sizes")
    size = models.CharField(max_length=2, choices=SIZE_CHOICES)
    stock = models.PositiveIntegerField(default=0)
    def __str__(self): return f"{self.product.name} - {self.size}"

class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart_items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    size = models.CharField(max_length=5)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ("user","product","size")

class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")
    full_name = models.CharField(max_length=200)
    address_line = models.CharField(max_length=300)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    phone = models.CharField(max_length=20)

class Order(models.Model):
    STATUS = [('PENDING','Pending'),('PROCESSING','Processing'),('SHIPPED','Shipped'),('DELIVERED','Delivered'),('CANCELLED','Cancelled')]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS, default='PENDING')
    payment_status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    tracking_id = models.CharField(max_length=100, blank=True, null=True)
    def __str__(self): return f"Order {self.id} - {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    size = models.CharField(max_length=5)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
