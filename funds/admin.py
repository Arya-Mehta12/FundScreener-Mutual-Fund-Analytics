from django.contrib import admin
from .models import Fund, FundArticle
from simple_history.admin import SimpleHistoryAdmin
import pandas as pd
from django.shortcuts import render, redirect
from django.contrib import messages
from django.urls import path
from django.http import HttpResponseRedirect
from import_export import resources, fields
from import_export.admin import ImportExportModelAdmin

class FundResource(resources.ModelResource):
    class Meta:
        model = Fund
        skip_unchanged = True
        report_skipped = True
        import_id_fields = ['name']
        fields = (
            'name', 'amc_name', 'primary_badge', 'market_cap', 'cagr', 'equity_size',
            'high_return', 'low_return', 'std_deviation', 'sharpe_ratio', 'sortino_ratio', 'beta',
            'alpha', 'r_squared', 'expense_ratio', 'nav', 'aum', 'lock_in_period'
        )
    
    def import_obj(self, obj, data, dry_run):
        # Only update fields that are present and not blank in the import row
        for field in self.get_fields():
            if field.column_name in data:
                value = data[field.column_name]
                if value not in [None, '', 'nan']:  
                    setattr(obj, field.attribute, value)
        return super().import_obj(obj, data, dry_run)

class FundAdmin(ImportExportModelAdmin):  # Changed from admin.ModelAdmin
    resource_class = FundResource
    list_display = (
        'name', 'market_cap', 'nav', 'aum', 'lock_in_period', 'sharpe_ratio', 'sortino_ratio'
    )
    readonly_fields = ['updated_at']

class FundArticleAdmin(admin.ModelAdmin):
    list_display = ('fund', 'title', 'date')

# Register your model and admin class
admin.site.register(Fund, FundAdmin)
admin.site.register(FundArticle, FundArticleAdmin)
