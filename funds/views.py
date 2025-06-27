from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Fund
from .serializers import FundSerializer
from .serializers import HistoricalFundSerializer
from .models import FundArticle
from rest_framework.pagination import PageNumberPagination
from .serializers import FundArticleSerializer


class FundViewSet(viewsets.ModelViewSet):
    queryset = Fund.objects.all()
    serializer_class = FundSerializer

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """Get historical records for a specific fund."""
        fund = self.get_object()
        historical_records = fund.history.all().order_by('-history_date')[:100]
        serializer = HistoricalFundSerializer(historical_records, many=True)
        return Response(serializer.data)


class FundArticleViewSet(viewsets.ModelViewSet):
    serializer_class = FundArticleSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        fund_id = self.request.query_params.get('fund_id')
        if fund_id:
            return FundArticle.objects.filter(fund_id=fund_id).order_by('-date')
        return FundArticle.objects.all().order_by('-date')
