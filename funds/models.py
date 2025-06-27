from django.dispatch import receiver
from django.db.models.signals import post_save
from django.db import models
# from simple_history.models import HistoricalRecords
from simple_history.models import HistoricalRecords
import uuid


class Fund(models.Model):
    name = models.CharField(max_length=200)
    # Asset Management Company
    amc_name = models.CharField(max_length=200, null=True, blank=True)
    # e.g., 'Equity Fund', 'Debt Fund'
    primary_badge = models.CharField(max_length=100, null=True, blank=True)
    market_cap = models.CharField(max_length=200)
    # Compound Annual Growth Rate
    cagr = models.FloatField(null=True, blank=True)
    equity_size = models.FloatField()
    high_return = models.FloatField()
    low_return = models.FloatField()
    std_deviation = models.FloatField()
    sharpe_ratio = models.FloatField()
    sortino_ratio = models.FloatField()
    beta = models.FloatField()
    alpha = models.FloatField()
    r_squared = models.FloatField()
    expense_ratio = models.FloatField()
    updated_at = models.DateTimeField(auto_now=True)
    nav = models.FloatField()  # Net Asset Value
    aum = models.FloatField()  # Assets Under Management
    # e.g., '3 years', 'No lock-in'
    lock_in_period = models.CharField(max_length=100, null=True, blank=True)

    history = HistoricalRecords(
        history_id_field=models.UUIDField(default=uuid.uuid4))

    def __str__(self):
        return self.name


class FundArticle(models.Model):
    fund = models.ForeignKey(
        Fund, related_name='articles', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    summary = models.TextField()
    content = models.TextField()
    date = models.DateTimeField(auto_now_add=True)


@receiver(post_save, sender=Fund)
def limit_fund_history(sender, instance, **kwargs):
    """Keep only the most recent 100 history records for each fund."""
    history_queryset = instance.history.all().order_by('-history_date')
    if history_queryset.count() > 100:
        # Delete all records beyond the 100th
        to_delete = history_queryset[100:]
        for record in to_delete:
            record.delete()
