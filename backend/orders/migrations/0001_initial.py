from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('products', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        # Removed ('vendors', '0001_initial') to break circular dependency
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('total_amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('commission_amount', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('vendor_earning', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('processing', 'Processing'), ('shipped', 'Shipped'), ('delivered', 'Delivered'), ('canceled', 'Canceled')], default='pending', max_length=20)),
                ('shipping_address', models.TextField(blank=True)),
                ('transaction_uuid', models.CharField(blank=True, max_length=100, null=True)),
                ('payment_method', models.CharField(choices=[('EPAY', 'ePay'), ('COD', 'Cash on Delivery')], default='EPAY', max_length=20)),
                ('payment_status', models.CharField(choices=[('pending', 'Pending'), ('paid', 'Paid'), ('failed', 'Failed')], default='pending', max_length=20)),
                ('is_paid', models.BooleanField(default=False)),
                ('esewa_ref_id', models.CharField(blank=True, max_length=100, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='customer_orders', to=settings.AUTH_USER_MODEL)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orders', to='products.product')),
                # vendor field removed temporarily to break cycle
            ],
            options={
                'db_table': 'orders',
                'ordering': ['-created_at'],
            },
        ),
    ]
