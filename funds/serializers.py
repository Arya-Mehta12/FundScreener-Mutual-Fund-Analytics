from rest_framework import serializers
from .models import Fund
from .models import FundArticle

class FundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fund
        fields = '__all__'
class HistoricalFundSerializer(serializers.ModelSerializer):
    history_date = serializers.DateTimeField()
    
    
    class Meta:
        model = Fund.history.model
        fields = ['history_id', 'history_date', 'name', 'market_cap', 'equity_size', 
                  'high_return', 'low_return', 'std_deviation', 'sharpe_ratio', 
                  'sortino_ratio', 'beta', 'alpha', 'r_squared', 'expense_ratio','nav', 'aum', 'lock_in_period']
        

class FundArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundArticle
        fields = ['id', 'title', 'summary', 'content', 'date']