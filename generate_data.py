import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(42)

# Generate 1000 rows of sales data
n = 1000
start_date = datetime(2024, 1, 1)
dates = [start_date + timedelta(days=np.random.randint(0, 730)) for _ in range(n)]

products = ['Laptop', 'Smartphone', 'Tablet', 'Headphones', 'Smartwatch', 'Camera', 'Speaker', 'Monitor', 'Keyboard', 'Mouse']
categories = {'Laptop': 'Electronics', 'Smartphone': 'Electronics', 'Tablet': 'Electronics',
              'Headphones': 'Accessories', 'Smartwatch': 'Wearables', 'Camera': 'Electronics',
              'Speaker': 'Accessories', 'Monitor': 'Electronics', 'Keyboard': 'Accessories', 'Mouse': 'Accessories'}
regions = ['North', 'South', 'East', 'West', 'Central']
segments = ['Premium', 'Standard', 'Budget']
sources = ['Website', 'Mobile App', 'In-Store', 'Partner', 'Social Media']

product_col = np.random.choice(products, n)
data = {
    'date': sorted(dates),
    'product': product_col,
    'category': [categories[p] for p in product_col],
    'revenue': np.round(np.random.uniform(50, 2500, n), 2),
    'quantity': np.random.randint(1, 20, n),
    'region': np.random.choice(regions, n),
    'customer_segment': np.random.choice(segments, n),
    'source': np.random.choice(sources, n),
    'rating': np.round(np.random.uniform(1, 5, n), 1),
    'return_flag': np.random.choice([0, 1], n, p=[0.92, 0.08])
}

df = pd.DataFrame(data)
df['date'] = pd.to_datetime(df['date']).dt.strftime('%Y-%m-%d')
df.to_csv('data/sales_data.csv', index=False)
print(f"Generated {len(df)} rows of sales data")
print(df.head())
print(df.describe())
