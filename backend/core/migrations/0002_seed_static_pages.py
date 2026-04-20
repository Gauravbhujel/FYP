from django.db import migrations

def create_static_pages(apps, schema_editor):
    StaticPage = apps.get_model('core', 'StaticPage')
    
    pages = [
        {
            'title': 'Privacy Policy',
            'slug': 'privacy-policy',
            'content': '''
                <h2 class="text-2xl font-black text-primary mb-6">1. Information We Collect</h2>
                <p>We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us.</p>
                <p class="mt-4">This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.</p>
                
                <h2 class="text-2xl font-black text-primary mt-10 mb-6">2. Use of Information</h2>
                <p>We use the information we collect to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request.</p>
                
                <h2 class="text-2xl font-black text-primary mt-10 mb-6">3. Sharing of Information</h2>
                <p>We may share the information we collect about you as described in this statement or as described at the time of collection or sharing, including with vendors, consultants, marketing partners, and other service providers who need access to such information to carry out work on our behalf.</p>
            '''
        },
        {
            'title': 'Terms of Service',
            'slug': 'terms-of-service',
            'content': '''
                <h2 class="text-2xl font-black text-primary mb-6">1. Acceptance of Terms</h2>
                <p>By accessing or using GearUp Nepal, you agree to be bound by these terms. If you do not agree to these terms, do not use our services.</p>
                
                <h2 class="text-2xl font-black text-primary mt-10 mb-6">2. User Accounts</h2>
                <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
                
                <h2 class="text-2xl font-black text-primary mt-10 mb-6">3. Content</h2>
                <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.</p>
            '''
        }
    ]
    
    for page_data in pages:
        StaticPage.objects.get_or_create(
            slug=page_data['slug'],
            defaults={
                'title': page_data['title'],
                'content': page_data['content']
            }
        )

def remove_static_pages(apps, schema_editor):
    StaticPage = apps.get_model('core', 'StaticPage')
    StaticPage.objects.filter(slug__in=['privacy-policy', 'terms-of-service']).delete()

class Migration(migrations.Migration):
    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_static_pages, remove_static_pages),
    ]
