"""
Schema definitions for IoT Smart Meter Connector
"""

from typing import Dict, Any

def get_schema() -> Dict[str, Any]:
    """
    Define the schema for tables that will be synced to BigQuery
    """
    return {
        "devices": {
            "primary_key": ["device_id"],
            "columns": {
                "device_id": {"type": "STRING"},
                "name": {"type": "STRING"},
                "location": {"type": "STRING"},
                "installation_date": {"type": "TIMESTAMP"}
            }
        },
        "readings": {
            "primary_key": ["device_id", "timestamp"],
            "columns": {
                "device_id": {"type": "STRING"},
                "timestamp": {"type": "TIMESTAMP"},
                "power_w": {"type": "FLOAT"},
                "energy_wh": {"type": "FLOAT"},
                "voltage": {"type": "FLOAT"},
                "temp_c": {"type": "FLOAT"},
                "occupancy": {"type": "BOOLEAN"},
                "source": {"type": "STRING"}
            }
        }
    }

def validate_record(table_name: str, record: Dict[str, Any]) -> bool:
    """
    Validate a record against the schema
    """
    schema = get_schema()
    
    if table_name not in schema:
        return False
    
    table_schema = schema[table_name]
    columns = table_schema["columns"]
    
    # Check all required columns are present
    for column_name in columns.keys():
        if column_name not in record:
            return False
    
    return True
