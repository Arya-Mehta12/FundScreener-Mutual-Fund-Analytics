import pandas as pd
from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_date
from datetime import datetime
from funds.models import Fund  
import uuid

class Command(BaseCommand):
    help = 'Import fund data with historical records from Excel file'

    def add_arguments(self, parser):
        parser.add_argument('excel_file', type=str, help='Path to the Excel file')
        parser.add_argument('--sheet', type=str, default=0, help='Sheet name or index (default: 0)')

    def handle(self, *args, **options):
        excel_file = options['excel_file']
        sheet = options['sheet']
        
        try:
            # Read Excel file
            df = pd.read_excel(excel_file, sheet_name=sheet)
            
            # Group by fund name to handle historical data
            funds_data = {}
            
            for _, row in df.iterrows():
                fund_name = row.get('name') or row.get('Name')
                if not fund_name:
                    continue
                    
                if fund_name not in funds_data:
                    funds_data[fund_name] = []
                
                funds_data[fund_name].append(row)
            
            # Process each fund
            for fund_name, history_records in funds_data.items():
                # Sort by date (assuming there's a date column)
                history_records = sorted(history_records, 
                                       key=lambda x: parse_date(str(x.get('date', x.get('Date', datetime.now().date())))))
                
                fund = None
                
                for i, record in enumerate(history_records):
                    # Extract data from row
                    fund_data = {
                        'name': record.get('name') or record.get('Name'),
                        'amc_name': record.get('amc_name') or record.get('AMC_Name'),
                        'primary_badge': record.get('primary_badge') or record.get('Primary_Badge'),
                        'market_cap': record.get('market_cap') or record.get('Market_Cap'),
                        'cagr': self.safe_float(record.get('cagr') or record.get('CAGR')),
                        'equity_size': self.safe_float(record.get('equity_size') or record.get('Equity_Size')),
                        'high_return': self.safe_float(record.get('high_return') or record.get('High_Return')),
                        'low_return': self.safe_float(record.get('low_return') or record.get('Low_Return')),
                        'std_deviation': self.safe_float(record.get('std_deviation') or record.get('Std_Deviation')),
                        'sharpe_ratio': self.safe_float(record.get('sharpe_ratio') or record.get('Sharpe_Ratio')),
                        'sortino_ratio': self.safe_float(record.get('sortino_ratio') or record.get('Sortino_Ratio')),
                        'beta': self.safe_float(record.get('beta') or record.get('Beta')),
                        'alpha': self.safe_float(record.get('alpha') or record.get('Alpha')),
                        'r_squared': self.safe_float(record.get('r_squared') or record.get('R_Squared')),
                        'expense_ratio': self.safe_float(record.get('expense_ratio') or record.get('Expense_Ratio')),
                        'nav': self.safe_float(record.get('nav') or record.get('NAV')),
                        'aum': self.safe_float(record.get('aum') or record.get('AUM')),
                        'lock_in_period': record.get('lock_in_period') or record.get('Lock_In_Period'),
                    }
                    
                    # Get historical date
                    history_date = parse_date(str(record.get('date', record.get('Date', datetime.now().date()))))
                    
                    if i == 0:
                        # Create the fund instance for the first time
                        fund, created = Fund.objects.get_or_create(
                            name=fund_data['name'],
                            defaults=fund_data
                        )
                        if created:
                            self.stdout.write(f"Created fund: {fund.name}")
                        else:
                            # Update the fund with latest data
                            for key, value in fund_data.items():
                                if value is not None:
                                    setattr(fund, key, value)
                            fund.save()
                            self.stdout.write(f"Updated fund: {fund.name}")
                    else:
                        # Update fund data for historical record
                        for key, value in fund_data.items():
                            if value is not None:
                                setattr(fund, key, value)
                        fund.save()
                    
                    # Create historical record with specific date
                    if fund:
                        # Get the latest historical record and update its date
                        latest_history = fund.history.first()
                        if latest_history:
                            latest_history.history_date = history_date
                            latest_history.save()
                            
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully imported {len(history_records)} historical records for {fund_name}')
                )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error importing data: {str(e)}')
            )
    
    def safe_float(self, value):
        """Safely convert value to float"""
        if pd.isna(value) or value is None or value == '':
            return None
        try:
            return float(value)
        except (ValueError, TypeError):
            return None
